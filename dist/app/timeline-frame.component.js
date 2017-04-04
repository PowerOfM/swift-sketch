var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var frame_1 = require('./frame');
var TimelineFrameComponent = (function () {
    function TimelineFrameComponent() {
    }
    TimelineFrameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ctx = this.canvasEF.nativeElement.getContext('2d');
        this.frame.onUpdate.subscribe(function () { return _this.update(); });
        this.update();
    };
    TimelineFrameComponent.prototype.update = function () {
        if (!this.frame.image)
            return;
        var ctx = this.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(this.frame.image, 0, 0, ctx.canvas.width, ctx.canvas.height);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', frame_1.Frame)
    ], TimelineFrameComponent.prototype, "frame", void 0);
    __decorate([
        core_1.ViewChild('canvas'), 
        __metadata('design:type', core_1.ElementRef)
    ], TimelineFrameComponent.prototype, "canvasEF", void 0);
    TimelineFrameComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'timeline-frame',
            templateUrl: './timeline-frame.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], TimelineFrameComponent);
    return TimelineFrameComponent;
}());
exports.TimelineFrameComponent = TimelineFrameComponent;
//# sourceMappingURL=timeline-frame.component.js.map