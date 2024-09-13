import AlienSaucerImage from "../../../assets/flying-saucer.png";
import {ImageComponent} from "../image-component";

export class AlienSaucerImgComponent extends ImageComponent {

    name: string = "AlienSaucerImgComponent";

    points: number = Math.floor(Math.random() * 300);
    visible: boolean = false;

    moveRight: boolean;
    startTime = performance.now();

    exploding = false;
    explosionFrameCount = performance.now();

    constructor() {
        const img = new Image();
        img.src = AlienSaucerImage;
        super({sx: 0, sy: 0, sWidth: 16, sHeight: 8, dWidth: 12, dHeight: 6, img: img});
        this.moveRight = this.setMoveDirection();
    }

    setMoveDirection(): boolean {
        this.moveRight = Math.random() < 0.5;
        return this.moveRight;
    }

    reset(): void {
        this.visible = false;
        this.exploding = false;
        this.setImageOne(); // dubious
    }

    setImageOne() {
        this.sx = 0;
        this.sy = 0;
        this.sWidth = 16;
        this.sHeight = 8;
        this.dWidth = 12;
        this.dHeight = 6;
    }

    setExplode() {
        this.sx = 16;
        this.sy = 0;
        this.sWidth = 21;
        this.sHeight = 8;
        this.dWidth = 16;
        this.dHeight = 6;
    }
}
