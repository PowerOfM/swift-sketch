import { NgModule }      from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'

import { AppComponent }  from './app.component'
import { ArtboardFrameComponent }  from './artboard-frame.component'
import { TimelineComponent }  from './timeline.component'
import { TimelineFrameComponent }  from './timeline-frame.component'

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    ArtboardFrameComponent,
    TimelineComponent,
    TimelineFrameComponent,
  ],
  bootstrap: [ AppComponent ],
  providers: []
})
export class AppModule { }
