import AlienPlungerShot from "../../../assets/alien-plunger-shot.png";
import {AlienRocketComponent} from "./alien-rocket-component";

export class AlienPlungerShotComponent extends AlienRocketComponent {

    constructor() {
        const img = new Image();
        img.src = AlienPlungerShot;
        super({sx: 0, sy: 0, sWidth: 3, sHeight: 7, dWidth: 3, dHeight: 7, img});
    }

    setImageOne() {
        this.sx = 0;
        this.sy = 0;
        this.img.src = AlienPlungerShot;
        this.resetImg();
    }

    setImageTwo() {
        this.sx = 3;
        this.sy = 0;
        this.img.src = AlienPlungerShot;
        this.resetImg();
    }

    setImageThree() {
        this.sx = 6;
        this.sy = 0;
        this.img.src = AlienPlungerShot;
        this.resetImg();
    }

    setImageFour() {
        this.sx = 9;
        this.sy = 0;
        this.img.src = AlienPlungerShot;
        this.resetImg();
    }

    private resetImg() {
        this.sWidth = 3;
        this.sHeight = 7;
        this.dWidth = 3;
        this.dHeight = 7;
    }
}
