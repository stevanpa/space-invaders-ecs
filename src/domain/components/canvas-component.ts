import {Component} from "./component";

export class CanvasComponent implements Component {

    name: string = 'CanvasComponent';

    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
    }
}
