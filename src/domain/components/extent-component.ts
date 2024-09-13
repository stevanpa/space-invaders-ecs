import {Component} from "./component";

export class ExtentComponent implements Component {

    name = 'ExtentComponent';

    minx: number;
    miny: number;
    maxx: number;
    maxy: number;
    extent: [number, number, number, number];

    constructor(minx: number, miny: number, width: number, height: number) {
        this.minx = minx;
        this.miny = miny;
        this.maxx = this.minx + width;
        this.maxy = this.miny + height;
        this.extent = [this.minx, this.miny, this.maxx, this.maxy];
    }

    setExtent(x: number, width: number, y: number, height: number) {
        this.minx = x;
        this.miny = y;
        this.maxx = this.minx + width;
        this.maxy = this.miny + height;
        this.extent = [this.minx, this.miny, this.maxx, this.maxy];
    }

    getTopLeft() {
        return [this.minx, this.miny];
    }

    getBottomRight() {
        return [this.maxx, this.maxy];
    }

    intersects(extent: ExtentComponent): boolean {
        return this.minx <= extent.maxx
            && this.maxx >= extent.minx
            && this.miny <= extent.maxy
            && this.maxy >= extent.miny;
    }
}
