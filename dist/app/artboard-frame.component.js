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
var stroke_1 = require('./stroke');
var frame_1 = require('./frame');
var ArtboardFrameComponent = (function () {
    function ArtboardFrameComponent() {
        this.CTX_WIDTH = 680;
        this.CTX_HEIGHT = 380;
        this.strokeMulti = {};
        this.mousePressed = false;
    }
    ArtboardFrameComponent.prototype.ngOnInit = function () {
        this.canvas = this.canvasEF.nativeElement;
        var offset = this.canvas.getBoundingClientRect();
        this.offsetTop = offset.top;
        this.offsetLeft = offset.left;
        this.ctx = this.canvas.getContext('2d');
        this.setupEventHandlers();
        this.setupKeyboardHandlers();
    };
    ArtboardFrameComponent.prototype.setupEventHandlers = function () {
        var _this = this;
        this.canvas.addEventListener('touchstart', function (e) { return _this.strokeStartMulti(e); }, false);
        this.canvas.addEventListener('touchmove', function (e) { return _this.strokeMoveMulti(e); }, false);
        this.canvas.addEventListener('touchend', function (e) { return _this.strokeEndMulti(e); }, false);
        this.canvas.addEventListener('touchcancel', function (e) { return _this.strokeEndMulti(e); }, false);
        this.canvas.addEventListener('mousedown', function (e) { return _this.strokeStart(e); });
        this.canvas.addEventListener('mousemove', function (e) { return _this.strokeMove(e); });
        this.canvas.addEventListener('mouseup', function (e) { return _this.strokeEnd(e); });
        this.canvas.addEventListener('mouseleave', function (e) { return _this.strokeEnd(e); });
    };
    ArtboardFrameComponent.prototype.setupKeyboardHandlers = function () {
        var _this = this;
        document.addEventListener('keypress', function (e) {
            if (_this.mousePressed)
                return;
            if (e.key === 'z') {
                _this.frame.undo(_this.ctx);
            }
            else if (e.key === 'x') {
                _this.frame.redo(_this.ctx);
            }
            else if (e.key === 'c') {
                _this.frame.clear(_this.ctx);
            }
        });
    };
    ArtboardFrameComponent.prototype.strokeStartMulti = function (e) {
        var touches = e.changedTouches;
        console.log(touches);
        for (var i = 0; i < touches.length; i++) {
            var s = new stroke_1.Stroke([touches[i].clientX - this.offsetLeft, touches[i].clientY - this.offsetTop]);
            this.strokeMulti[touches[i].identifier] = s;
        }
        console.log(this.strokeMulti);
    };
    ArtboardFrameComponent.prototype.strokeMoveMulti = function (e) {
        e.preventDefault();
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var s = this.strokeMulti[touches[i].identifier];
            if (!s)
                continue;
            s.points.push(touches[i].clientX - this.offsetLeft, touches[i].clientY - this.offsetTop);
            s.draw(this.ctx);
        }
    };
    ArtboardFrameComponent.prototype.strokeEndMulti = function (e) {
        e.preventDefault();
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var s = this.strokeMulti[touches[i].identifier];
            if (!s)
                continue;
            s.simplify().smooth();
            this.frame.addStroke(s);
            this.strokeMulti[touches[i].identifier] = undefined;
        }
        this.frame.draw(this.ctx);
    };
    ArtboardFrameComponent.prototype.strokeStart = function (e) {
        this.stroke = new stroke_1.Stroke([e.clientX - this.offsetLeft, e.clientY - this.offsetTop]);
        this.mousePressed = true;
    };
    ArtboardFrameComponent.prototype.strokeMove = function (e) {
        if (!this.mousePressed)
            return;
        e.preventDefault();
        this.stroke.points.push(e.clientX - this.offsetLeft, e.clientY - this.offsetTop);
        this.stroke.draw(this.ctx);
    };
    ArtboardFrameComponent.prototype.strokeEnd = function (e) {
        if (!this.mousePressed)
            return;
        e.preventDefault();
        this.mousePressed = false;
        this.stroke.simplify().smooth();
        this.frame.addStroke(this.stroke);
        this.frame.draw(this.ctx);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', frame_1.Frame)
    ], ArtboardFrameComponent.prototype, "frame", void 0);
    __decorate([
        core_1.ViewChild('canvas'), 
        __metadata('design:type', core_1.ElementRef)
    ], ArtboardFrameComponent.prototype, "canvasEF", void 0);
    ArtboardFrameComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'artboard-frame',
            templateUrl: './artboard-frame.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], ArtboardFrameComponent);
    return ArtboardFrameComponent;
}());
exports.ArtboardFrameComponent = ArtboardFrameComponent;
//# sourceMappingURL=artboard-frame.component.js.map