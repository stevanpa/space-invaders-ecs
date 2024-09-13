import {Component} from "./component";

export class ImageComponent implements Component {

    name: string = "ImageComponent";

    visible: boolean = true;

    sx: number;
    sy: number;
    sWidth: number;
    sHeight: number;
    dWidth: number;
    dHeight: number;
    img: HTMLImageElement;

    constructor(params: {sx: number, sy: number, sWidth: number, sHeight: number,
                        dWidth: number, dHeight: number, img: HTMLImageElement}) {
        this.sx = params.sx;
        this.sy = params.sy;
        this.sWidth = params.sWidth;
        this.sHeight = params.sHeight;
        this.dWidth = params.dWidth;
        this.dHeight = params.dHeight;
        this.img = params.img;
    }
}
