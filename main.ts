
let method = 0;
let N_METHODS = 3;

class MyPixelShader extends affine.Gpu.PixelShader {
    shade(pos: affine.Vec2, uv: affine.Vec2): number {
        switch (method) {
            case 0: {
                const size = 4;
                const x = Fx.toInt(pos.x) >> size;
                const y = Fx.toInt(pos.y) >> size;
                return (x + y) % 2 == 0 ? 1 : 2;
            }
            case 1: {
                const size = 2;
                const x = Fx.toInt(pos.x) >> size;
                const y = Fx.toInt(pos.y) >> size;
                return (x + y) % 3 == 0 ? 13 : (x + y) % 2 ? 5 : 6;
            }
            case 2: {
                const x = Fx.toInt(pos.x) >> 2;
                const y = Fx.toInt(pos.y) >> 2;
                const t = control.millis() / 1000;
                const s = Math.sin(x);
                const c = Math.cos(y + t);
                return Math.floor(1 + (Math.abs(s * c) * 3));
            }
            default: return 0;
        }
    }
}


class MyScene extends affine.Scene {
    sprite: affine.QuadSprite;

    constructor() {
        super();
        this.sprite = new affine.QuadSprite(
            this, 60, 60,
            (src: affine.Vertex[]) => new affine.Gpu.BasicVertexShader(src),
            () => new MyPixelShader());
    }

    startup() {
        controller.setRepeatDefault(0, 1);
        controller.up.onEvent(ControllerButtonEvent.Pressed, () => this.moveUp());
        controller.up.onEvent(ControllerButtonEvent.Repeated, () => this.moveUp());
        controller.down.onEvent(ControllerButtonEvent.Pressed, () => this.moveDown());
        controller.down.onEvent(ControllerButtonEvent.Repeated, () => this.moveDown());
        controller.left.onEvent(ControllerButtonEvent.Pressed, () => this.moveLeft());
        controller.left.onEvent(ControllerButtonEvent.Repeated, () => this.moveLeft());
        controller.right.onEvent(ControllerButtonEvent.Pressed, () => this.moveRight());
        controller.right.onEvent(ControllerButtonEvent.Repeated, () => this.moveRight());
        controller.A.onEvent(ControllerButtonEvent.Pressed, () => this.rotateClockwise());
        controller.A.onEvent(ControllerButtonEvent.Repeated, () => this.rotateClockwise());
        controller.B.onEvent(ControllerButtonEvent.Pressed, () => this.rotateCounterClockwise());
        controller.B.onEvent(ControllerButtonEvent.Repeated, () => this.rotateCounterClockwise());
        controller.menu.onEvent(ControllerButtonEvent.Pressed, () => this.cycleMethod());
    }

    draw() {
        this.sprite.draw();
    }

    moveSpeed = Fx8(2);
    rotSpeed = 2;
    
    cycleMethod() {
        method++;
        method %= N_METHODS;
    }


    moveUp() {
        this.sprite.xfrm.localPos.y = Fx.sub(this.sprite.xfrm.localPos.y, this.moveSpeed);
    }

    moveDown() {
        this.sprite.xfrm.localPos.y = Fx.add(this.sprite.xfrm.localPos.y, this.moveSpeed);
    }

    moveLeft() {
        this.sprite.xfrm.localPos.x = Fx.sub(this.sprite.xfrm.localPos.x, this.moveSpeed);
    }

    moveRight() {
        this.sprite.xfrm.localPos.x = Fx.add(this.sprite.xfrm.localPos.x, this.moveSpeed);
    }

    rotateClockwise() {
        this.sprite.xfrm.localRot += this.rotSpeed;
    }

    rotateCounterClockwise() {
        this.sprite.xfrm.localRot -= this.rotSpeed;
    }

}

affine.Scene.pushScene(new MyScene());
