'use strict';

class StickMan{
    constructor(){
        this.body = new ManBody();
        this.handL = new ManHand({parent : this.body, node: 1});
        this.handR = new ManHand({parent : this.body, node: 1});
        this.head = new ManHead({parent : this.body, node: 0});
        this.legL = new ManLeg({parent : this.body, node: 2});
        this.legR = new ManLeg({parent : this.body, node: 2});

        this.body.setAngle(-90);
        this.head.setAngle(90);
        this.handL.setAngle(-30);
        this.handR.setAngle(-150);
        this.legR.setAngle(-120);
        this.legL.setAngle(-60);
        this.forward = false;
        this.point = new Point(200, 100);

    }
    show(ctx){
        let point = this.point;
        if(this.forward){
            this.legL.setAngle(this.legL.angle + 5);
            this.legR.setAngle(this.legR.angle - 5);
            this.handL.setAngle(this.handL.angle + 8);
            this.handR.setAngle(this.handR.angle - 8);
            this.body.setAngle(this.body.angle + .3);
            if(this.legL.angle >= -40){
                this.forward = false;
            }
            this.head.setAngle(this.head.angle + 1);
        }else{
            this.legL.setAngle(this.legL.angle - 5);
            this.legR.setAngle(this.legR.angle + 5);
            this.handL.setAngle(this.handL.angle - 8);
            this.handR.setAngle(this.handR.angle + 8);
            this.head.setAngle(this.head.angle - 1);
            this.body.setAngle(this.body.angle - .3);

            if(this.legL.angle < -140){
                this.forward = true;
            }
        }

        this.body.show(ctx, point);
        this.head.show(ctx, point);
        this.handL.show(ctx, point);
        this.handR.show(ctx, point);
        this.legL.show(ctx, point);
        this.legR.show(ctx, point);
    }
}

class ManOrgan{
    constructor(p){
        this.parentInfo = {
            parent : p.parent,
            node : p.node
        };
        this.angle = 0;
    }
    setAngle(angle){
        this.angle = angle;
        this.set.angle = angle;
    }
}


class ManBody extends ManOrgan{
    constructor(){
        super({parent : null, node : 0});
        let bodyUp = new Path([
            new Curve(new PolarPoint(30, 20), new PolarPoint(5, 20), new PolarPoint( 15, -160)),
        ]);
        let bodyDown = new Path([
            new Curve(new PolarPoint(80, -10), new PolarPoint(10, 30), new PolarPoint( 30, 160))
        ]);
        this.bodyUp = new Graphic(bodyUp, 0, 5, "000", null , new PolarPoint(0, 0) );
        this.bodyDown = new Graphic(bodyDown, 0, 5, "000", null , new PolarPoint(0, 0) );
        this.set = new GraphicSet([this.bodyUp, this.bodyDown], null, this.parentInfo.node);
    }

    show(ctx, point){
        this.set.build();
        this.set.draw(ctx, point);
    }
}

class ManHead extends ManOrgan{
    constructor(p){
        super(p);
        let headPath = new Path([
            new Curve(new PolarPoint(50, 45), new PolarPoint(20, 90), new PolarPoint(20, 180)),
            new Curve(new PolarPoint(50, -45), new PolarPoint(15, 0), new PolarPoint(25, 90)),
            new Curve(new PolarPoint(50, -135), new PolarPoint(20, -90), new PolarPoint(25, 0)),
            new Curve(new PolarPoint(50, 135), new PolarPoint(15, 180), new PolarPoint(25, -90))
        ]);
        this.head = new Graphic(headPath, 20, 5, "000", null, new PolarPoint(0, 0) );
        this.set = new GraphicSet([this.head], this.parentInfo.parent.set, this.parentInfo.node);
    }

    show(ctx, point){
        this.set.build();
        this.set.draw(ctx, point);
    }
}

class ManHand extends ManOrgan{
    constructor(p){
        super(p);
        let handPath = new Path([
            new Curve(new PolarPoint(40, -30), new PolarPoint(10, -45), new PolarPoint( 10, 180)),
            new Curve(new PolarPoint(50, 30), new PolarPoint(20, 45), new PolarPoint( 20, 180))
        ]);
        let glovePath = new Path([
            new Curve(new PolarPoint(20, 45), new PolarPoint(10, 90), new PolarPoint(5, 180)),
            new Curve(new PolarPoint(20, -45), new PolarPoint(5, 0), new PolarPoint(10, 90)),
            new Curve(new PolarPoint(20, -135), new PolarPoint(10, -90), new PolarPoint(10, 0)),
            new Curve(new PolarPoint(20, 135), new PolarPoint(5, 180), new PolarPoint(5, -90))
        ]);
        this.hand = new Graphic(handPath, 0, 5, "000", null , new PolarPoint(0, 0) );
        this.glove = new Graphic(glovePath, 90, 5, "000", "000", new PolarPoint(15, 0) );
        this.set = new GraphicSet([this.hand, this.glove], this.parentInfo.parent.set, this.parentInfo.node);
    }

    show(ctx, point){
        this.set.build();
        this.set.draw(ctx, point);
    }
}

class ManLeg extends ManOrgan{
    constructor(p){
        super(p);
        let legPath = new Path([
            new Curve(new PolarPoint(50, 20), new PolarPoint(30, 45), new PolarPoint( 30, 180)),
            new Curve(new PolarPoint(50, -10), new PolarPoint(30, 0), new PolarPoint( 30, 170))
        ]);
        let shoe = new Path([
            new Curve(new PolarPoint(20, 45), new PolarPoint(10, 90), new PolarPoint(5, 180)),
            new Curve(new PolarPoint(20, -45), new PolarPoint(5, 0), new PolarPoint(10, 90)),
            new Curve(new PolarPoint(20, -135), new PolarPoint(10, -90), new PolarPoint(10, 0)),
            new Curve(new PolarPoint(20, 135), new PolarPoint(5, 180), new PolarPoint(5, -90))
        ]);
        this.leg = new Graphic(legPath, 0, 5, "000", null , new PolarPoint(0, 0) );
        this.shoe = new Graphic(shoe, 90, 5, "000", "000", new PolarPoint(15, 0) );
        this.set = new GraphicSet([this.leg, this.shoe], this.parentInfo.parent.set, this.parentInfo.node);
    }

    show(ctx, point){
        this.set.build();
        this.set.draw(ctx, point);
    }

}
