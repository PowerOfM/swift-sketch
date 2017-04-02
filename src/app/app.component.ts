import { Component, ViewChild, ElementRef } from '@angular/core'
import { Stroke } from './stroke'
import { Frame } from './frame'

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public frames:Frame[]
  private curFrame:Frame

  constructor () {
    this.frames = [new Frame()]
    this.curFrame = this.frames[0]
  }
}