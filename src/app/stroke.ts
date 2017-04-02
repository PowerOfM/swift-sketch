export class Stroke {
  constructor (public points:number[] = [], public color:string = 'black', public lineWidth:number = 2, public lineCap:string = 'round', public controlPoints:number[] = []) {}

  simplify () : Stroke {
    if (this.points.length < 3) return
    console.log('Start length:', this.points.length)
    this.points = this.getDouglasPeucker(this.points, 5)
    console.log('Final length:', this.points.length)
    return this
  }

  smooth () : Stroke {
    var pts = this.points
    var cps = []
    
    // There will be two control points for each "middle" point, 1 ... len-2e   
    var len = pts.length / 2 - 2
    for (var i = 0; i < len; i += 1) {
      cps = cps.concat(this.getControlPoints(0.5, pts[2 * i], pts[2 * i + 1], pts[2 * i + 2], pts[2 * i + 3], pts[2 * i + 4], pts[2 * i + 5]))
    }
    this.controlPoints = cps

    return this
  }

  draw (ctx:any) : void {
    ctx.beginPath()

    ctx.strokeStyle = this.color
    ctx.lineWidth = this.lineWidth
    ctx.lineJoin = ctx.lineCap = this.lineCap
    
    // Draw smooth bezier curves between all points
    if (this.controlPoints.length) {
      this.drawCurvedPath(ctx, this.controlPoints, this.points)

    // Draw a simple stroke using line-to for all points
    } else {
      var pts = this.points
      ctx.moveTo(pts[0], pts[1])
      for (let i = 2; i < pts.length; i += 2) {
        ctx.lineTo(pts[i], pts[i + 1])
      }
    }

    ctx.stroke()
  }

  // Line simplification using the Douglas-Peucker algorithm
  private getDouglasPeucker (points:number[], epsilon:number) : number[] {
    if (points.length === 2) return points
    let len = points.length - 2

    let x1 = points[0]
    let y1 = points[1]
    let xL = points[points.length - 2]
    let yL = points[points.length - 1]
    let maxD = 0
    let maxI = 0
    for (let i = 2; i < len; i += 2) {
      let d = this.distToLine(x1, y1, xL, yL, points[i], points[i + 1])
      if (d > maxD) {
        maxD = d
        maxI = i
      }
    }

    if (maxD > epsilon) {
      if (len == 2) return points
      let res1:number[] = this.getDouglasPeucker(points.slice(0, maxI + 2), epsilon)
      let res2:number[] = this.getDouglasPeucker(points.slice(maxI, points.length), epsilon)
      return res1.concat(res2.slice(2))
    } else {
      return [x1, y1, xL, yL]
    }
  }

  // Compute control points for 3 points given a tension
  private getControlPoints (tension:number, x1:number, y1:number, x2:number, y2:number, x3:number, y3:number) {
    var t = tension
    var v = this.diff(x1, y1, x3, y3)
    var d01 = this.dist(x1, y1, x2, y2)
    var d12 = this.dist(x2, y2, x3, y3)
    var d012 = d01 + d12
    return [x2 - v[0] * t * d01 / d012, y2 - v[1] * t * d01 / d012,
      x2 + v[0] * t * d12 / d012, y2 + v[1] * t * d12 / d012 ]
  }

  // Plot a path using curves (assumes beginPath() has been called, and stroke() will be called after)
  private drawCurvedPath (ctx:any, cps:number[], pts:number[]) {
    var len = pts.length / 2
    if (len < 2) return
    if (len === 2) {
      ctx.moveTo(pts[0], pts[1])
      ctx.lineTo(pts[2], pts[3])
    } else {
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
    }
  }

  // Compute the shortest from a point to a lin between two points
  private distToLine (x1:number, y1:number, x2:number, y2:number, x0:number, y0:number) {
    return Math.abs((y2 - y1)*x0 - (x2 - x1)*y0 + x2*y1 - y2*x1) / Math.sqrt((y2 - y1)*(y2 - y1) + (x2 - x1)*(x2 - x1))
  }


  // Distance formula
  private dist (x1:number, y1:number, x2:number, y2:number) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
  }

  // The difference between two points
  private diff (x1:number, y1:number, x2:number, y2:number) {
    return [x2 - x1, y2 - y1]
  }
}
