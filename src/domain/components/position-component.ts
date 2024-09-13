import {Component} from "./component";

export class PositionComponent implements Component{

    name: string = "PositionComponent";

    dx: number;
    dy: number;
    spawnX: number;
    spawnY: number;

    constructor(params: {dx: number; dy: number}) {
        this.spawnX = params.dx;
        this.spawnY = params.dy;
        this.dx = params.dx;
        this.dy = params.dy;
    }

    reset(): void {
        this.dx = this.spawnX;
        this.dy = this.spawnY;
    }
}
