import AlienRollingShot from "../../../assets/alien-rolling-shot.png";
import {AlienRocketComponent} from "./alien-rocket-component";

export class AlienRollingShotComponent extends AlienRocketComponent {

    constructor() {
        const img = new Image();
        img.src = AlienRollingShot;
        super({sx: 0, sy: 0, sWidth: 3, sHeight: 7, dWidth: 3, dHeight: 7, img});
    }

    setImageOne() {
        this.sx = 0;
        this.sy = 0;
        this.img.src = AlienRollingShot;
        this.resetImg();
    }

    setImageTwo() {
        this.sx = 3;
        this.sy = 0;
        this.img.src = AlienRollingShot;
        this.resetImg();
    }

    setImageThree() {
        this.sx = 6;
        this.sy = 0;
        this.img.src = AlienRollingShot;
        this.resetImg();
    }

    setImageFour() {
        this.sx = 9;
        this.sy = 0;
        this.img.src = AlienRollingShot;
        this.resetImg();
    }

    private resetImg() {
        this.sWidth = 3;
        this.sHeight = 7;
        this.dWidth = 3;
        this.dHeight = 7;
    }
}
