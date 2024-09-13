import {ImageComponent} from "../image-component";
import PlayerImg from "../../../assets/friendly-ship.png";

export class PlayerComponent extends ImageComponent {

    name: string = 'PlayerComponent';

    rightPressed: boolean = false;
    leftPressed: boolean = false;
    fireRocket: boolean = false;

    exploding = false;
    explosionFrameCount = performance.now();

    constructor() {
        const img = new Image();
        img.src = PlayerImg;
        super({sx: 0, sy: 0, sWidth: 26, sHeight: 16, dWidth: 13, dHeight: 7, img: img});
    }

    reset(): void {
        this.visible = true;
        this.exploding = false;
        this.setImageOne();
    }

    setImageOne() {
        this.sx = 0;
        this.sy = 0;
        this.img.src = PlayerImg;
        this.resetImg();
    }

    setExplode() {
        this.sx = 26;
        this.sy = 0;
        this.sWidth = 30;
        this.sHeight = 16;
        this.dWidth = 15;
        this.dHeight = 7;
        this.img.src = PlayerImg;
    }

    private resetImg() {
        this.sWidth = 26;
        this.sHeight = 16;
        this.dWidth = 13;
        this.dHeight = 7;
    }

    // resetAlienMoveDelay(): void {
    //     this.alienMoveDelay = 500;
    // }
}
