'use strict';

class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    rotate(angle, knot){
        angle = -angle;
        let x = this.x - knot.x, y = this.y - knot.y;
        this.x = x*Math.cos(Math.PI*angle/180.0) - y*Math.sin(Math.PI*angle/180.0) + knot.x;
        this.y = x*Math.sin(Math.PI*angle/180.0) + y*Math.cos(Math.PI*angle/180.0) + knot.y;
    }
    copy(){
        return new Point(this.x, this.y);
    }
}

class PolarPoint{
    constructor(r, ang){
        this.r = r;
        this.ang = ang;
    }
    toCartesian(){
        return new Point(this.r* Math.cos((this.ang/180)*Math.PI), 
                (-1)*this.r* Math.sin((this.ang/180)*Math.PI));
    }
}


let bezier = function(p0, p1, p2, p3, acc){
    var cX = 3 * (p1.x - p0.x),
        bX = 3 * (p2.x - p1.x) - cX,
        aX = p3.x - p0.x - cX - bX;
  
    var cY = 3 * (p1.y - p0.y),
        bY = 3 * (p2.y - p1.y) - cY,
        aY = p3.y - p0.y - cY - bY;
  
    let getPoint = function(t){
        var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
        var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
        return new Point(x, y);
    } 

    var point = getPoint(0);
    let points = new Array();
    points.push(point);
    for(var i = acc; i <= 1; i+= acc){
        point = getPoint(i);
        points.push(point);
    }
    return points;
};

class Curve{
    constructor(curve, slope1, slope2){
        this.curve = curve;
        this.slope1 = slope1;
        this.slope2 = slope2;
    }

    bezier(p0, p1, p2, p3, acc){
        var cX = 3 * (p1.x - p0.x),
            bX = 3 * (p2.x - p1.x) - cX,
            aX = p3.x - p0.x - cX - bX;
      
        var cY = 3 * (p1.y - p0.y),
            bY = 3 * (p2.y - p1.y) - cY,
            aY = p3.y - p0.y - cY - bY;
      
        let getPoint = function(t){
            var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
            var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
            return new Point(x, y);
        } 
    
        var point = getPoint(0);
        let points = new Array();

        points.push(point);
        for(var i = acc; i <= 1; i+= acc){
            point = getPoint(i);
            points.push(point);
        }

        return points;
    }

    getCurve(){
        let p1 = new Point(0, 0);
        let p2 = this.curve.toCartesian();
        let c1 = this.slope1.toCartesian();
        let c2 = this.slope2.toCartesian();
        c2.x += p2.x, c2.y += p2.y;
        return bezier(p1, c1, c2, p2, .1);
    };    
}

class Path{
    constructor(curves){
        this.curves = curves;
        this.path = [];
    }

    updatePath(){
        this.path = [];
        let shift = new Point(0, 0);
        if(this.curves.length){
            this.path = this.curves[0].getCurve();
            shift = new Point(this.path[this.path.length-1].x, this.path[this.path.length-1].y);
        }
        for(let i = 1; i < this.curves.length; i++){
            let curve = this.curves[i].getCurve();
            for(let j = 1 ; j < curve.length; j++){
                curve[j].x += shift.x, curve[j].y += shift.y;
                this.path.push(curve[j]);
            }
            shift = new Point(curve[curve.length-1].x, curve[curve.length-1].y);
        }
    }
    shiftpath(point){        
        for(let i = 0; i < this.path.length; i++){
            this.path[i].x += point.x;
            this.path[i].y += point.y;
        }
    }

    getPath(){
        return this.path;
    }
}

class Graphic{
    constructor(path, angle, strokeWidth, strokeColor, fillColor, knot){
        this.pathObject = path;
        this.path = [];
        this.angle = angle;
        this.strokeWidth = strokeWidth;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
        this.polarKnot = knot;
        this.knot = knot.toCartesian();
    }
    shift(point){
        for(let i = 0; i < this.path.length; i++){
            this.path[i].x += point.x;
            this.path[i].y += point.y;
        }
        this.knot.x += point.x;
        this.knot.y += point.y;
    }

    rotate(angle , knot){
        for(let i = 0; i < this.path.length; i++){
            this.path[i].rotate(angle, knot);
        }
        this.knot.rotate(angle, knot);
    }

    build(){
        this.knot = this.polarKnot.toCartesian();
        this.pathObject.updatePath();
        this.path = this.pathObject.getPath();
        this.rotate(this.angle, this.knot);
    }
}

class GraphicSet{
    constructor(graphics, parentSet, parentNode){
        this.graphics = graphics;
        this.knot = graphics[0].knot;
        this.parentSet = parentSet;
        this.parentNode = parentNode;
        this.angle = 0;
    }
    build(){
        let point;
        if(this.graphics.length){
            this.graphics[0].build();
            this.graphics[0].rotate(this.angle, this.knot);
            let shiftBy;

            if(this.parentSet == null){
                shiftBy = new Point(0, 0);
            }else if(this.parentSet.graphics.length == this.parentNode){
                shiftBy = this.parentSet.graphics[this.parentNode-1].path[this.parentSet.graphics[this.parentNode-1].path.length - 1];
            }else{
                shiftBy = this.parentSet.graphics[this.parentNode].path[0];
            }
            this.graphics[0].shift(shiftBy);
            point = this.graphics[0].path[this.graphics[0].path.length-1].copy();
        }
        for(let i = 1 ;i < this.graphics.length; i++){
            this.graphics[i].build();
            this.graphics[i].rotate(this.angle, this.knot);

            let knot = this.graphics[i].knot;
            point.x = point.x - knot.x;
            point.y = point.y - knot.y;
            this.graphics[i].shift(point);
            point = this.graphics[i].path[this.graphics[i].path.length-1].copy();
        }
    }

    draw(ctx, point = new Point(0, 0)){
        for(let i = 0; i < this.graphics.length; i++){
            ctx.beginPath();
            ctx.moveTo(this.graphics[i].path[0].x + point.x, this.graphics[i].path[0].y + point.y);
            for(let j = 1; j < this.graphics[i].path.length; j++){
                ctx.lineTo(this.graphics[i].path[j].x + point.x, this.graphics[i].path[j].y + point.y);
            }
            if(this.graphics[i].fillColor){
                ctx.fillStyle = this.graphics[i].fillColor;
                ctx.fill();
            }
            if(this.graphics[i].strokeColor){
                ctx.strokeStyle = this.graphics[i].strokeColor;
                ctx.lineWidth = this.graphics[i].strokeWidth;
                ctx.stroke();
            }
        }
    }
}