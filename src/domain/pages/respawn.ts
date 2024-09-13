import {GameState} from "../../game-state";
import {GameSettings} from "../../game-settings";
import {BasePage, Stars} from "./base-page";

export class Respawn extends BasePage {

    private lastTick: number = 0;
    private frameCount: number = 0;

    constructor(state: GameState, settings: GameSettings) {
        super(state, settings);
        if (this.lastTick == 0) {
            this.lastTick = this.settings.lastTick;
        }
        this.stars = this.generateStars();
    }

    process() {
        if (this.state.game.respawn) {
            this.clearCanvas();
            this.setBackground();

            // Draw
            this.drawLayerOne();
            this.drawLayerTwo();
        }
    }

    private clearCanvas() {
        this.ctx.clearRect(0, 0, this.settings.relativeWidth, this.settings.relativeHeight);
    }

    private setBackground() {
        this.ctx.fillStyle = 'rgb(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.settings.relativeWidth, this.settings.relativeHeight);
    }

    private drawLayerOne() {
        this.updateStarsPosition();
        this.stars.forEach((value: Stars) => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${value.alpha})`;
            this.ctx.fillRect(value.xPos, value.yPos, value.w, value.h);
        });
        // this.createRings();
        // this.createVectors();
    }

    private drawLayerTwo() {
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        const fontSize = 6;
        this.ctx.font = fontSize + 'px SpaceInvaders';
        let x = 70;
        let y = 125;
        this.ctx.fillText("SPACE INVADERS", x, y);
        this.frameCount ++;
        if (this.frameCount < 25) {
            this.ctx.fillText("Press SPACE to respawn", x - 18, y + 15);
            this.lastTick = this.settings.lastTick;
        } else if (this.frameCount >= 50) {
            this.frameCount = 0;
        }
        this.ctx.fillText("SCORE: " + this.state.player.score.toString(), x, y + 30);
    }
}
