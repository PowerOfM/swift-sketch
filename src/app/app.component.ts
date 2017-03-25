import { Component, ViewChild, ElementRef } from '@angular/core'
import { Curve } from './lib/curve'

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent  {
  @ViewChild('canvas') canvasEF:ElementRef

  CTX_WIDTH:number = 680
  CTX_HEIGHT:number = 380

  private canvas:any
  private offsetTop:number
  private offsetLeft:number
  private ctx:any
  private frames:Frame[]

  private frame:Frame
  private redo:Stroke[]

  private stroke:Stroke
  private strokeMulti:any = {}

  private mousePressed:boolean = false

  // TODO: http://paperjs.org vector-based smoothing

  ngOnInit () : void {
    // Setup data structures
    this.frame = new Frame([])
    this.frames = [this.frame]

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
        if (this.frame.strokes.length > 0) {
          this.redo.push(this.frame.strokes.pop())
          this.drawFrame(this.frame)
        }
      } else if (e.key === 'x') {
        if (this.redo.length > 0) {
          this.frame.strokes.push(this.redo.pop())
          this.drawFrame(this.frame)
        }
      } else if (e.key === 'c') {
        this.frame.strokes = []
        this.drawFrame(this.frame)
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

    // this.drawFrame(this.frame)
    for (let i = 0; i < touches.length; i++) {
      let s = this.strokeMulti[touches[i].identifier]
      if (!s) continue
      s.points.push(touches[i].clientX - this.offsetLeft, touches[i].clientY - this.offsetTop)
      this.drawStroke(s, true)
    }
  }
  private strokeEndMulti (e:any) {
    e.preventDefault()
    let touches = e.changedTouches

    for (var i = 0; i < touches.length; i++) {
      let s = this.strokeMulti[touches[i].identifier]
      if (!s) continue
      s.simplify()
      this.frame.strokes.push(s)
      this.strokeMulti[touches[i].identifier] = undefined
    }

    this.redo = []
    this.drawFrame(this.frame)
  }

  private strokeStart (e:any) {
    this.stroke = new Stroke([e.clientX - this.offsetLeft, e.clientY - this.offsetTop])
    this.mousePressed = true
  }
  private strokeMove (e:any) {
    if (!this.mousePressed) return
    e.preventDefault()

    this.stroke.points.push(e.clientX - this.offsetLeft, e.clientY - this.offsetTop)
    this.drawStroke(this.stroke, true)
  }
  private strokeEnd (e:any) {
    if (!this.mousePressed) return
    e.preventDefault()
    this.mousePressed = false

    this.drawFrame(this.frame)
    this.stroke.simplify().drawSplines(this.ctx)
    this.frame.strokes.push(this.stroke)
    this.redo = []
    
  }

  private drawFrame (frame:Frame) : void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    let len = frame.strokes.length
    for (let i = 0; i < len; i++) {
      this.drawStroke(frame.strokes[i], false)
    }
  }
  private drawStroke (stroke:Stroke, showPoints?:boolean) : void {
    let ctx = this.ctx
    let pts = stroke.points

    ctx.beginPath()

    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.lineJoin = this.ctx.lineCap = 'round'

    ctx.moveTo(pts[0], pts[1])

    for (let i = 2; i < pts.length; i += 2) {
      ctx.lineTo(pts[i], pts[i + 1])
    }
    ctx.stroke()
    // if (showPoints) {
    //   for (let i = 0; i < pts.length; i += 2) {
    //     ctx.fillRect(pts[i] - 4, pts[i + 1] - 4, 8, 8)
    //   }
    // }
  }
}

export class Stroke {
  constructor (public points:number[] = [], public controlPoints:number[] = []) {}

  simplify () : Stroke {
    if (this.points.length < 3) return
    console.log('Start length:', this.points.length)
    this.points = this.douglasPeucker(this.points, 1)
    console.log('Final length:', this.points.length)
    return this
  }

  private douglasPeucker (points:number[], epsilon:number) : number[] {
    if (points.length === 2) return points
    let len = points.length - 2

    let x1 = points[0]
    let y1 = points[1]
    let xL = points[points.length - 2]
    let yL = points[points.length - 1]
    let maxD = 0
    let maxI = 0
    for (let i = 2; i < len; i += 2) {
      let d = this.dPointToLine(x1, y1, xL, yL, points[i], points[i + 1])
      if (d > maxD) {
        maxD = d
        maxI = i
      }
    }

    if (maxD > epsilon) {
      if (len == 2) return points
      let res1:number[] = this.douglasPeucker(points.slice(0, maxI + 2), epsilon)
      let res2:number[] = this.douglasPeucker(points.slice(maxI, points.length), epsilon)
      return res1.concat(res2.slice(2))
    } else {
      return [x1, y1, xL, yL]
    }
  }

  private dPointToLine (x1:number, y1:number, x2:number, y2:number, x0:number, y0:number) {
    return Math.abs((y2 - y1)*x0 - (x2 - x1)*y0 + x2*y1 - y2*x1) / Math.sqrt((y2 - y1)*(y2 - y1) + (x2 - x1)*(x2 - x1))
  }

  // smooth () : Stroke {
  //   console.log('Start length:', this.points.length)
  //   this.points = Array.from(Curve.getCurvePoints(this.points, 0.5, 10))
  //   console.log('End length:', this.points.length)
  //   return this
  // }

  drawSplines (ctx:any) {
    // There will be two control points for each "middle" point, 1 ... len-2e
    var pts = this.points
    var cps = this.controlPoints || []

    if (!cps.length) {
      var len = pts.length / 2 - 2
      for (var i = 0; i < len; i += 1) {
        cps = cps.concat(this.computeControlPoints(0.5, pts[2 * i], pts[2 * i + 1], pts[2 * i + 2], pts[2 * i + 3], pts[2 * i + 4], pts[2 * i + 5]))
      }
      this.controlPoints = cps
    }

    this.drawCurvedPath(ctx, cps, pts)
  }

  private computeControlPoints (tension:number, x1:number, y1:number, x2:number, y2:number, x3:number, y3:number) {
    var t = tension
    var v = this.va(x1, y1, x3, y3)
    var d01 = this.dista(x1, y1, x2, y2)
    var d12 = this.dista(x2, y2, x3, y3)
    var d012 = d01 + d12
    return [x2 - v[0] * t * d01 / d012, y2 - v[1] * t * d01 / d012,
      x2 + v[0] * t * d12 / d012, y2 + v[1] * t * d12 / d012 ]
  }
  private dista (x1:number, y1:number, x2:number, y2:number) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
  }
  private va (x1:number, y1:number, x2:number, y2:number) {
    return [x2 - x1, y2 - y1]
  }

  private drawCurvedPath (ctx:any, cps:number[], pts:number[]) {
    var len = pts.length / 2
    if (len < 2) return
    if (len === 2) {
      ctx.beginPath()
      ctx.moveTo(pts[0], pts[1])
      ctx.lineTo(pts[2], pts[3])
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.moveTo(pts[0], pts[1])
      
      // from point 0 to point 1 is a quadratic
      ctx.quadraticCurveTo(cps[0], cps[1], pts[2], pts[3])
      
      // for all middle points, connect with bezier
      for (var i = 2; i < len - 1; i += 1) {
        ctx.bezierCurveTo(cps[(2 * (i - 1) - 1) * 2], cps[(2 * (i - 1) - 1) * 2 + 1],
                    cps[(2 * (i - 1)) * 2], cps[(2 * (i - 1)) * 2 + 1],
                    pts[i * 2], pts[i * 2 + 1])
      }

      // connect last points with quadratic
      ctx.quadraticCurveTo(cps[(2 * (i - 1) - 1) * 2], cps[(2 * (i - 1) - 1) * 2 + 1],
                     pts[i * 2], pts[i * 2 + 1])
      ctx.stroke()
    }
  }
}

class Frame {
 constructor(public strokes:Stroke[] = []) {}
}