import { Component, ViewChild, ElementRef, Input } from '@angular/core'
import { Stroke } from './stroke'
import { Frame } from './frame'

@Component({
  moduleId: module.id,
  selector: 'artboard-frame',
  templateUrl: './artboard-frame.component.html'
})
export class ArtboardFrameComponent {
  @Input() frame:Frame
  @ViewChild('canvas') canvasEF:ElementRef

  CTX_WIDTH:number = 680
  CTX_HEIGHT:number = 380

  private canvas:any
  private offsetTop:number
  private offsetLeft:number
  private ctx:any

  private stroke:Stroke
  private strokeMulti:any = {}

  private mousePressed:boolean = false

  // TODO: http://paperjs.org vector-based smoothing

  ngOnInit () : void {
    // Get drawing context
    this.canvas = this.canvasEF.nativeElement
    let offset = this.canvas.getBoundingClientRect()
    this.offsetTop = offset.top
    this.offsetLeft = offset.left
    this.ctx = this.canvas.getContext('2d')

    this.setupEventHandlers()
    this.setupKeyboardHandlers()
  }

  private setupEventHandlers () : void {
    this.canvas.addEventListener('touchstart', (e:any) => this.strokeStartMulti(e), false)
    this.canvas.addEventListener('touchmove', (e:any) => this.strokeMoveMulti(e), false)
    this.canvas.addEventListener('touchend', (e:any) => this.strokeEndMulti(e), false)
    this.canvas.addEventListener('touchcancel', (e:any) => this.strokeEndMulti(e), false)

    this.canvas.addEventListener('mousedown', (e:any) => this.strokeStart(e))
    this.canvas.addEventListener('mousemove', (e:any) => this.strokeMove(e))
    this.canvas.addEventListener('mouseup', (e:any) => this.strokeEnd(e))
    this.canvas.addEventListener('mouseleave', (e:any) => this.strokeEnd(e))
  }
  private setupKeyboardHandlers () : void {
    document.addEventListener('keypress', (e:any) => {
      if (this.mousePressed) return
      if (e.key === 'z') {
        this.frame.undo(this.ctx)
      } else if (e.key === 'x') {
        this.frame.redo(this.ctx)
      } else if (e.key === 'c') {
        this.frame.clear(this.ctx)
      }
    })
  }

  private strokeStartMulti (e:any) {
    let touches = e.changedTouches
    console.log(touches)

    for (let i = 0; i < touches.length; i++) {
      let s = new Stroke([ touches[i].clientX - this.offsetLeft, touches[i].clientY - this.offsetTop ])
      this.strokeMulti[touches[i].identifier] = s
    }

    console.log(this.strokeMulti)
  }
  private strokeMoveMulti (e:any) {
    e.preventDefault()
    let touches = e.changedTouches

    for (let i = 0; i < touches.length; i++) {
      let s:Stroke = this.strokeMulti[touches[i].identifier]
      if (!s) continue
      s.points.push(touches[i].clientX - this.offsetLeft, touches[i].clientY - this.offsetTop)
      s.draw(this.ctx)
    }
  }
  private strokeEndMulti (e:any) {
    e.preventDefault()
    let touches = e.changedTouches

    for (var i = 0; i < touches.length; i++) {
      let s = this.strokeMulti[touches[i].identifier]
      if (!s) continue
      s.simplify().smooth()
      this.frame.addStroke(s)
      this.strokeMulti[touches[i].identifier] = undefined
    }

    this.frame.draw(this.ctx)
  }

  private strokeStart (e:any) {
    this.stroke = new Stroke([e.clientX - this.offsetLeft, e.clientY - this.offsetTop])
    this.mousePressed = true
  }
  private strokeMove (e:any) {
    if (!this.mousePressed) return
    e.preventDefault()

    this.stroke.points.push(e.clientX - this.offsetLeft, e.clientY - this.offsetTop)
    this.stroke.draw(this.ctx)
  }
  private strokeEnd (e:any) {
    if (!this.mousePressed) return
    e.preventDefault()
    this.mousePressed = false

    this.stroke.simplify().smooth()
    this.frame.addStroke(this.stroke)

    this.frame.draw(this.ctx)
  }
}
