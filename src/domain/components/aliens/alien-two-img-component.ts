import AlienTwoImage from "../../../assets/alien-two.png";
import {AlienImgComponent} from "./alien-img-component";

export class AlienTwoImgComponent extends AlienImgComponent {

    points: number = 20;

    constructor() {
        const img = new Image();
        img.src = AlienTwoImage;
        super({sx: 0, sy: 0, sWidth: 24, sHeight: 16, dWidth: 12, dHeight: 8, img: img});
    }

    setImageOne() {
        this.sx = 0;
        this.sy = 0;
        this.img.src = AlienTwoImage;
        this.resetImg();
    }

    setImageTwo() {
        this.sx = 24;
        this.sy = 0;
        this.img.src = AlienTwoImage;
        this.resetImg();
    }

    private resetImg() {
        this.sWidth = 24;
        this.sHeight = 16;
        this.dWidth = 12;
        this.dHeight = 8;
    }
}
