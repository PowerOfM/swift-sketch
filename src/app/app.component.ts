import { Component, ViewChild, ElementRef } from '@angular/core'

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent  {
  @ViewChild('canvas') canvas:ElementRef

  CTX_WIDTH:number = 680
  CTX_HEIGHT:number = 380

  private ctx:any
  private strokes:any = []
  private redo:any = []

  private curStroke:any = null
  private mousePressed:boolean = false

  // TODO: http://paperjs.org path smoothing

  ngOnInit () : void {
    var canvas = this.canvas.nativeElement
    this.ctx = canvas.getContext('2d')

    canvas.addEventListener('mousedown', (e:any) => this.strokeStart(e))
    canvas.addEventListener('mousemove', (e:any) => this.strokeMove(e))
    canvas.addEventListener('mouseup', (e:any) => this.strokeEnd(e))
    canvas.addEventListener('mouseleave', (e:any) => this.strokeEnd(e))
    document.addEventListener('keypress', (e:any) => {
      if (this.mousePressed) return
      if (e.key === 'z') {
        if (this.strokes.length > 0) {
          this.redo.push(this.strokes.pop())
          this.renderScene(this.strokes)
        }
      } else if (e.key === 'x') {
        if (this.redo.length > 0) {
          this.strokes.push(this.redo.pop())
          this.renderScene(this.strokes)
        }
      }
    })
  }

  private strokeStart (e:any) {
    var x = e.layerX
    var y = e.layerY
    this.mousePressed = true
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'blue'
    this.ctx.moveTo(x, y)
    this.curStroke = [{x, y}]
  }
  private strokeMove (e:any) {
    if (!this.mousePressed) return
    var x = e.layerX
    var y = e.layerY
    this.ctx.lineTo(x, y)
    this.curStroke.push({x, y})
    this.ctx.stroke()
  }
  private strokeEnd (e:any) {
    if (!this.mousePressed) return
    this.mousePressed = false
    this.ctx.closePath()

    this.redo = []
    this.strokes.push(this.curStroke)
    this.renderScene(this.strokes)
  }

  private renderScene (scene:any) {
    this.ctx.clearRect(0, 0, this.CTX_WIDTH, this.CTX_HEIGHT)
    this.ctx.beginPath()
    for (var i = 0; i < scene.length; i++) {
      let s = scene[i]
      this.ctx.moveTo(s[0].x, s[0].y)
      for (var j = 1; j < s.length; j++) {
        this.ctx.lineTo(s[j].x, s[j].y)
      }
    }
    this.ctx.stroke()
    this.ctx.closePath()
  }
}
