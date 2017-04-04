var Stroke = (function () {
    function Stroke(points, color, lineWidth, lineCap, controlPoints) {
        if (points === void 0) { points = []; }
        if (color === void 0) { color = 'black'; }
        if (lineWidth === void 0) { lineWidth = 2; }
        if (lineCap === void 0) { lineCap = 'round'; }
        if (controlPoints === void 0) { controlPoints = []; }
        this.points = points;
        this.color = color;
        this.lineWidth = lineWidth;
        this.lineCap = lineCap;
        this.controlPoints = controlPoints;
    }
    Stroke.prototype.simplify = function () {
        if (this.points.length < 3)
            return;
        console.log('Start length:', this.points.length);
        this.points = this.getDouglasPeucker(this.points, 5);
        console.log('Final length:', this.points.length);
        return this;
    };
    Stroke.prototype.smooth = function () {
        var pts = this.points;
        var cps = [];
        var len = pts.length / 2 - 2;
        for (var i = 0; i < len; i += 1) {
            cps = cps.concat(this.getControlPoints(0.5, pts[2 * i], pts[2 * i + 1], pts[2 * i + 2], pts[2 * i + 3], pts[2 * i + 4], pts[2 * i + 5]));
        }
        this.controlPoints = cps;
        return this;
    };
    Stroke.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.lineJoin = ctx.lineCap = this.lineCap;
        if (this.controlPoints.length) {
            this.drawCurvedPath(ctx, this.controlPoints, this.points);
        }
        else {
            var pts = this.points;
            ctx.moveTo(pts[0], pts[1]);
            for (var i = 2; i < pts.length; i += 2) {
                ctx.lineTo(pts[i], pts[i + 1]);
            }
        }
        ctx.stroke();
    };
    Stroke.prototype.getDouglasPeucker = function (points, epsilon) {
        if (points.length === 2)
            return points;
        var len = points.length - 2;
        var x1 = points[0];
        var y1 = points[1];
        var xL = points[points.length - 2];
        var yL = points[points.length - 1];
        var maxD = 0;
        var maxI = 0;
        for (var i = 2; i < len; i += 2) {
            var d = this.distToLine(x1, y1, xL, yL, points[i], points[i + 1]);
            if (d > maxD) {
                maxD = d;
                maxI = i;
            }
        }
        if (maxD > epsilon) {
            if (len == 2)
                return points;
            var res1 = this.getDouglasPeucker(points.slice(0, maxI + 2), epsilon);
            var res2 = this.getDouglasPeucker(points.slice(maxI, points.length), epsilon);
            return res1.concat(res2.slice(2));
        }
        else {
            return [x1, y1, xL, yL];
        }
    };
    Stroke.prototype.getControlPoints = function (tension, x1, y1, x2, y2, x3, y3) {
        var t = tension;
        var v = this.diff(x1, y1, x3, y3);
        var d01 = this.dist(x1, y1, x2, y2);
        var d12 = this.dist(x2, y2, x3, y3);
        var d012 = d01 + d12;
        return [x2 - v[0] * t * d01 / d012, y2 - v[1] * t * d01 / d012,
            x2 + v[0] * t * d12 / d012, y2 + v[1] * t * d12 / d012];
    };
    Stroke.prototype.drawCurvedPath = function (ctx, cps, pts) {
        var len = pts.length / 2;
        if (len < 2)
            return;
        if (len === 2) {
            ctx.moveTo(pts[0], pts[1]);
            ctx.lineTo(pts[2], pts[3]);
        }
        else {
            ctx.moveTo(pts[0], pts[1]);
            ctx.quadraticCurveTo(cps[0], cps[1], pts[2], pts[3]);
            for (var i = 2; i < len - 1; i += 1) {
                ctx.bezierCurveTo(cps[(2 * (i - 1) - 1) * 2], cps[(2 * (i - 1) - 1) * 2 + 1], cps[(2 * (i - 1)) * 2], cps[(2 * (i - 1)) * 2 + 1], pts[i * 2], pts[i * 2 + 1]);
            }
            ctx.quadraticCurveTo(cps[(2 * (i - 1) - 1) * 2], cps[(2 * (i - 1) - 1) * 2 + 1], pts[i * 2], pts[i * 2 + 1]);
        }
    };
    Stroke.prototype.distToLine = function (x1, y1, x2, y2, x0, y0) {
        return Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
    };
    Stroke.prototype.dist = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    };
    Stroke.prototype.diff = function (x1, y1, x2, y2) {
        return [x2 - x1, y2 - y1];
    };
    return Stroke;
}());
exports.Stroke = Stroke;
//# sourceMappingURL=stroke.js.map