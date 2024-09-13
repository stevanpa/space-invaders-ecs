import {ImageComponent} from "../image-component";
import PlayerShot from "../../../assets/player-shot.png";
import PlayerShotExploding from "../../../assets/player-shot-exploding.png";

export class PlayerRocketComponent extends ImageComponent {

    name: string = 'PlayerRocketComponent';

    visible: boolean = false;
    triggerTime = performance.now();

    exploding = false;
    explosionFrameCount = performance.now();

    constructor() {
        const img = new Image();
        img.src = PlayerShot;
        super({sx: 0, sy: 0, sWidth: 1, sHeight: 4, dWidth: 1, dHeight: 4, img: img});
    }

    reset() {
        this.visible = false;
        this.exploding = false;
        this.triggerTime = performance.now();
        this.setImageOne();
    }

    setImageOne() {
        this.sx = 0;
        this.sy = 0;
        this.img.src = PlayerShot;
        this.resetImg();
    }

    private resetImg() {
        this.sWidth = 1;
        this.sHeight = 4;
        this.dWidth = 1;
        this.dHeight = 4;
    }

    setExplode() {
        this.sx = 0;
        this.sy = 0;
        this.sWidth = 8;
        this.sHeight = 8;
        this.dWidth = 8;
        this.dHeight = 8;
        this.img.src = PlayerShotExploding;
    }
}
