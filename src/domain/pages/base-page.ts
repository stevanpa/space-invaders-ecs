import {GameState} from "../../game-state";
import {GameSettings} from "../../game-settings";

export type Stars = {
    xPos: number;
    yPos: number;
    w: number;
    h: number;
    alpha: number;
}

export abstract class BasePage {

    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected state: GameState;
    protected settings: GameSettings;
    protected stars: Stars[] = [];

    protected constructor(state: GameState, settings: GameSettings) {
        this.canvas = document.getElementById('game')! as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!;
        this.state = state;
        this.settings = settings;
    }

    protected createRings() {
        const centerX = this.settings.relativeWidth / 2;
        const centerY = this.settings.relativeHeight / 2;
        this.ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
        for (let i=1; i<2; i++) {
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, i * 20 , 0, 2 * Math.PI);
            this.ctx.stroke();
        }
    }

    protected generateStars(): Stars[] {
        const stars: Stars[] = [];
        const canvasSize = this.settings.relativeWidth * this.settings.relativeHeight;
        const starsFraction = canvasSize / 500;

        const centerX = this.settings.relativeWidth / 2;
        const centerY = this.settings.relativeHeight / 2;

        for(let i = 0; i < starsFraction; i++) {
            //Set up random elements
            let xPos = this.random(centerX - 100, centerX + 100);
            let yPos = this.random(centerY - 20, centerY + 20);
            let alpha = this.random(0.5, 1);
            let size = this.random(0.1, 0.5);
            stars.push({xPos, yPos, w: size, h: size, alpha});
        }

        return stars;
    }

    protected updateStarsPosition() {
        this.stars.forEach(star => {
            // Expand the stars from the center
            const centerX = this.settings.relativeWidth / 2;
            const centerY = this.settings.relativeHeight / 2;

            // calculate unit vector
            const xV = star.xPos - centerX;
            const yV = (star.yPos < centerY) ? centerY - star.yPos : -star.yPos + centerY;
            const magnitude = Math.sqrt(xV * xV + yV * yV);
            const uX = Math.abs(xV / magnitude);
            const uY = Math.abs(yV / magnitude);

            if (star.xPos === centerX) {
                const xPos = this.random(centerX -10 , centerX + 10);
                star.xPos = (xPos === centerX) ? xPos + 1 : xPos;
            } else if (star.xPos < centerX && star.xPos > 0) {
                star.xPos -= uX;
            } else if (star.xPos > centerX && star.xPos < this.settings.relativeWidth) {
                star.xPos += uX;
            } else if (star.xPos < 0 || star.xPos > this.settings.relativeWidth) {
                const xPos = this.random(centerX -10 , centerX + 10);
                star.xPos = (xPos === centerX) ? xPos - 1 : xPos;
            }

            if (star.yPos === centerY) {
                const yPos = this.random(centerY - 10, centerY + 10);
                star.yPos = (yPos === centerY) ? yPos + 1 : yPos;
            } else if (star.yPos < centerY && star.yPos > 0) {
                star.yPos -= uY;
            } else if (star.yPos > centerY && star.yPos < this.settings.relativeHeight) {
                star.yPos += uY;
            } else if (star.yPos < 0 || star.yPos > this.settings.relativeHeight) {
                const yPos = this.random(centerY - 10, centerY + 10);
                star.yPos = (yPos === centerY) ? yPos - 1 : yPos;
            }
        });
    }

    protected createVectors() {
        const centerX = this.settings.relativeWidth / 2;
        const centerY = this.settings.relativeHeight / 2;
        this.ctx.strokeStyle = `rgba(255, 255, 255, 0.5)`;
        this.stars.forEach(star => {
            // calculate unit vector
            const xV = star.xPos - centerX;
            const yV = (star.yPos < centerY) ? centerY - star.yPos : -star.yPos + centerY;
            const magnitude = Math.sqrt(xV * xV + yV * yV);
            const uX = Math.abs(xV / magnitude);
            const uY = Math.abs(yV / magnitude);

            let xDelta = centerX;
            let yDelta = centerY;
            if (star.xPos < centerX - uX * 20 && star.xPos > 0) {
                xDelta = star.xPos - uX * -10;
            } else if (star.xPos > centerX + 20 && star.xPos < this.settings.relativeWidth) {
                xDelta = star.xPos + uX * -10;
            }

            if (star.yPos < centerY + uY * 20 && star.yPos > 0) {
                yDelta = star.yPos - uY * -10;
            } else if (star.yPos > centerY - 20 && star.yPos < this.settings.relativeHeight) {
                yDelta = star.yPos + uY * -10;
            }

            if (xDelta !== centerX && yDelta !== centerY) {
                this.ctx.beginPath();
                this.ctx.moveTo(xDelta, yDelta);
                this.ctx.lineTo(star.xPos + star.w / 2, star.yPos + star.h / 2);
                this.ctx.stroke();
            }
        });
    }

    private random(min: number, max: number): number {
        return min + Math.random() * (max + 1 - min);
    }
}
