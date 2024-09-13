import AlienThreeImage from "../../../assets/alien-three.png";
import {AlienImgComponent} from "./alien-img-component";

export class AlienThreeImgComponent extends AlienImgComponent {

    points: number = 10;

    constructor() {
        const img = new Image();
        img.src = AlienThreeImage;
        super({sx: 0, sy: 0, sWidth: 24, sHeight: 16, dWidth: 12, dHeight: 8, img: img});
    }

    setImageOne() {
        this.sx = 0;
        this.sy = 0;
        this.img.src = AlienThreeImage;
        this.resetImg();
    }

    setImageTwo() {
        this.sx = 24;
        this.sy = 0;
        this.img.src = AlienThreeImage;
        this.resetImg();
    }

    private resetImg() {
        this.sWidth = 24;
        this.sHeight = 16;
        this.dWidth = 12;
        this.dHeight = 8;
    }
}
