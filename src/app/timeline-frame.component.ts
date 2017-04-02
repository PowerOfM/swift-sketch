import { Component, ViewChild, OnInit, Input } from '@angular/core'
import { Frame } from './frame'

@Component({
  moduleId: module.id,
  selector: 'timeline-frame',
  templateUrl: './timeline-frame.component.html'
})
export class TimelineFrameComponent implements OnInit {
  @Input() frame:Frame
  @ViewChild('canvas') canvasEF:ElementRef

  private ctx:any

  constructor () {}

  ngOnInit () : void {
    this.ctx = this.canvasEF.nativeElement.getContext('2d')
    this.frame.onUpdate.subscribe(() =>  this.update())
    this.update()
  }

  update () : void {
    if (!this.frame.image) return

    var ctx = this.ctx
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(this.frame.image, 0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}
