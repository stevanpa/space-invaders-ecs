import {ImageComponent} from "./image-component";
import ShieldImage from "../../assets/friendly-blocks.png";

export class ShieldComponent extends ImageComponent {

    name: string = 'ShieldComponent';
    hits: number = 5;

    constructor() {
        const img = new Image();
        img.src = ShieldImage;
        super({sx: 0, sy: 0, sWidth: 44, sHeight: 32, dWidth: 22, dHeight: 16, img});
        this.setImageOne();
    }

    reset(): void {
        this.visible = true;
        this.hits = 5;
        this.setImageOne();
    }

    setImageOne() {
        this.sx = 0;
        this.sy = 0;
    }

    setImageTwo() {
        this.sx = 132;
        this.sy = 0;
    }

    setImageThree() {
        this.sx = 176;
        this.sy = 0;
    }

    setImageFour() {
        this.sx = 88;
        this.sy = 0;
    }

    setImageFive() {
        this.sx = 44;
        this.sy = 0;
    }
}
