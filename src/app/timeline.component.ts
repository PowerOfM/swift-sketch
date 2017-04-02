import { Component, Input } from '@angular/core'
import { Stroke } from './stroke'
import { Frame } from './frame'

@Component({
  moduleId: module.id,
  selector: 'timeline',
  templateUrl: './timeline.component.html'
})
export class TimelineComponent {
  @Input() frames:Frame[]

  constructor () {}

  onFrameAddClick (e:any) {
    e.preventDefault()
    console.log('Frame-add clicked')
  }
}
