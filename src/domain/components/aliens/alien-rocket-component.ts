import {ImageComponent} from "../image-component";
import AlienRocketExploding from "../../../assets/alien-shot-exploding.png";

export abstract class AlienRocketComponent extends ImageComponent {

    name: string = 'AlienRocketComponent';

    visible: boolean = false;
    triggerTime = performance.now();

    exploding = false;
    explosionFrameCount = performance.now();

    protected constructor(params: {sx: number, sy: number, sWidth: number, sHeight: number,
                        dWidth: number, dHeight: number, img: HTMLImageElement}) {
        super(params);
    }

    reset(): void {
        this.visible = false;
        this.exploding = false;
        this.triggerTime = performance.now();
        this.setImageOne(); // dubious
    }

    abstract setImageOne(): void;

    abstract setImageTwo(): void;

    abstract setImageThree(): void;

    abstract setImageFour(): void;

    setExplode() {
        this.sx = 0;
        this.sy = 0;
        this.sWidth = 6;
        this.sHeight = 8;
        this.dWidth = 6;
        this.dHeight = 8;
        this.img.src = AlienRocketExploding;
    }

}
