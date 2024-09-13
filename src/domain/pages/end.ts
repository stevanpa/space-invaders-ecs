import {GameState} from "../../game-state";
import {GameSettings} from "../../game-settings";
import {BasePage, Stars} from "./base-page";
import {HighScores} from "../../high-scores";

export class End extends BasePage {

    constructor(state: GameState, settings: GameSettings) {
        super(state, settings);
        this.stars = this.generateStars();
    }

    process() {
        if (this.state.game.end) {
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
        let x = 105;
        let y = 110;
        if (this.state.game.hiScore) {
            this.ctx.fillText("End", x, y);
            this.ctx.fillText("Click to add Hi-score", x - 45, y + 15);
            this.ctx.fillText("SCORE: " + this.state.player.score.toString(), x - 20, y + 30);
        } else {
            const highScores = localStorage.getItem('highScores');
            if (highScores) {
                this.ctx.fillText("HI-SCORES", x - 18, y - 15);
                const object = JSON.parse(highScores) as HighScores;
                const hiScore = object.values.sort((a, b) => b.score - a.score);
                for (let i=0; i<hiScore.length && i<5; i++) {
                    const item = hiScore[i];
                    this.ctx.fillText(`${item.name}`, x - 40, y + 15 * i);
                    this.ctx.fillText(`${item.score}`, x + 40, y + 15 * i);
                }
            }
        }
    }
}
