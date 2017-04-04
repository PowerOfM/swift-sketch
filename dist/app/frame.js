var core_1 = require('@angular/core');
var Frame = (function () {
    function Frame(image, strokes) {
        if (image === void 0) { image = null; }
        if (strokes === void 0) { strokes = []; }
        this.image = image;
        this.strokes = strokes;
        this.onUpdate = new core_1.EventEmitter();
        this.redoStack = [];
    }
    Frame.prototype.addStroke = function (s) {
        this.strokes.push(s);
        if (this.redoStack.length)
            this.redoStack = [];
    };
    Frame.prototype.undo = function (ctx) {
        if (this.strokes.length === 0)
            return false;
        this.redoStack.push(this.strokes.pop());
        if (ctx)
            this.draw(ctx);
        return true;
    };
    Frame.prototype.redo = function (ctx) {
        if (this.redoStack.length === 0)
            return false;
        this.strokes.push(this.redoStack.pop());
        if (ctx)
            this.draw(ctx);
        return true;
    };
    Frame.prototype.draw = function (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        var len = this.strokes.length;
        for (var i = 0; i < len; i++) {
            this.strokes[i].draw(ctx);
        }
        this.image = ctx.canvas;
        this.onUpdate.emit();
    };
    Frame.prototype.clear = function (ctx) {
        this.redoStack = [];
        this.strokes = [];
        if (ctx)
            this.draw(ctx);
    };
    Frame.prototype.unload = function (ctx) {
        var img = new Image();
        img.src = ctx.canvas.toDataURL();
        this.image = img;
    };
    return Frame;
}());
exports.Frame = Frame;
//# sourceMappingURL=frame.js.map