import {ImageComponent} from "../image-component";
import AlienExploding from "../../../assets/alien-exploding.png";

export abstract class AlienImgComponent extends ImageComponent {

    name: string = "AlienImgComponent";

    visible: boolean = true;
    points: number = 0;

    moveRight = true;
    moveLeft = false;
    moveDown = false;
    startTime = performance.now();

    exploding = false;
    explosionFrameCount = performance.now();

    protected constructor(params: {sx: number, sy: number, sWidth: number, sHeight: number,
                        dWidth: number, dHeight: number, img: HTMLImageElement}) {
        super(params);
    }

    reset(): void {
        this.visible = true;
        this.moveRight = true;
        this.moveLeft = false;
        this.moveDown = false;
        this.exploding = false;
        this.startTime = performance.now();
        this.setImageOne();
    }

    abstract setImageOne(): void;

    abstract setImageTwo(): void;

    setExplode() {
        this.sx = 0;
        this.sy = 0;
        this.sWidth = 13;
        this.sHeight = 8;
        this.dWidth = 12;
        this.dHeight = 8;
        this.img.src = AlienExploding;
    }
}
