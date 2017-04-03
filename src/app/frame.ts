import { EventEmitter } from '@angular/core'
import { Stroke } from './stroke'

export class Frame {
  public onUpdate:EventEmitter<boolean>
  private redoStack:Stroke[]

  constructor(public image:any, public strokes:Stroke[] = []) {
    this.onUpdate = new EventEmitter<boolean>()
    this.redoStack = []
  }

  public addStroke (s:Stroke) {
    this.strokes.push(s)
    if (this.redoStack.length) this.redoStack = []
  }

  public undo (ctx?:any) : boolean {
    if (this.strokes.length === 0) return false

    this.redoStack.push(this.strokes.pop())
    if (ctx) this.draw(ctx)
    return true
  }

  public redo (ctx?:any) : boolean {
    if (this.redoStack.length === 0) return false

    this.strokes.push(this.redoStack.pop())
    if (ctx) this.draw(ctx)
    return true
  }

  public draw (ctx:any) : void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    let len = this.strokes.length
    for (let i = 0; i < len; i++) {
      this.strokes[i].draw(ctx)
    }

    this.image = ctx.canvas
    this.onUpdate.emit()
  }

  public clear (ctx?:any) : void {
    this.redoStack = []
    this.strokes = []
    if (ctx) this.draw(ctx)
  }
  
  /**
   * Preforms cleanup.
   * Note: MUST BE CALLED BEFORE SWITCING ACTIVE FRAME!
   * @param {any} ctx Canvas context.
   */
  public unload (ctx:any) : void {
    var img = new Image()
    img.src = ctx.canvas.toDataURL()
    this.image = img
  }
}