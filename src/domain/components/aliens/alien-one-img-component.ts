import AlienOneImage from "../../../assets/alien-one.png"
import {AlienImgComponent} from "./alien-img-component";

export class AlienOneImgComponent extends AlienImgComponent {

    points: number = 30;

    constructor() {
        const img = new Image();
        img.src = AlienOneImage;
        super({sx: 0, sy: 0, sWidth: 24, sHeight: 16, dWidth: 12, dHeight: 8, img: img});
    }

    setImageOne() {
        this.sx = 0;
        this.sy = 0;
        this.img.src = AlienOneImage;
        this.resetImg();
    }

    setImageTwo() {
        this.sx = 24;
        this.sy = 0;
        this.img.src = AlienOneImage;
        this.resetImg();
    }

    private resetImg() {
        this.sWidth = 24;
        this.sHeight = 16;
        this.dWidth = 12;
        this.dHeight = 8;
    }
}
