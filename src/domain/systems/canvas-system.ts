import {System} from "./system";
import {Entity} from "../entities/entity";
import {CanvasComponent} from "../components/canvas-component";
import FriendlyShip from "../../assets/friendly-ship.png";
import {CanvasEntity} from "../entities/canvas-entity";
import {GameSettings} from "../../game-settings";
import {GameState} from "../../game-state";

export class CanvasSystem implements System {

    private ctx: CanvasRenderingContext2D;
    private settings: GameSettings;
    private state: GameState;

    constructor(entities: Map<string, Entity[]>, settings: GameSettings, state: GameState) {
        const canvas = entities.get(CanvasEntity.name)![0].components.get(CanvasComponent.name) as CanvasComponent;
        this.ctx = canvas.ctx;
        this.settings = settings;
        this.state = state;
    }

    process(): void {
        this.clearCanvas();
        this.setBackground();
        this.drawScoreBoard();
        this.drawBottom();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.settings.relativeWidth, this.settings.relativeHeight);
    }

    setBackground() {
        this.ctx.fillStyle = 'rgb(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.settings.relativeWidth, this.settings.relativeHeight);
    }

    drawScoreBoard() {
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        const padding = 5;
        const fontSize = 6;
        this.ctx.font = fontSize + 'px SpaceInvaders';

        const column = this.settings.relativeWidth / 3;

        let x = 10;
        let y = padding + fontSize;
        let yy = 5 + padding + 2 * fontSize;
        this.ctx.fillText("SCORE<1>", x, y, column);
        x = x + 10;
        this.ctx.fillText(this.state.player.score.toString().padStart(4, '0'), x, yy, column);

        x = column + 10;
        y = padding + fontSize;
        yy = 5 + padding + 2 * fontSize;
        this.ctx.fillText("HIGHSCORE", x, y, column);
        x = column + 25;
        this.ctx.fillText(this.state.player.highScore.toString().padStart(4, '0'), x, yy, column);

        x = column * 2 + 23;
        y = padding + fontSize;
        yy = 5 + padding + 2 * fontSize;
        this.ctx.fillText("SCORE<2>", x, y, column);
        x = column * 2 + 33;
        this.ctx.fillText("0".padStart(4, '0'), x, yy, column);
    }

    drawBottom() {
        const padding = 105;
        const fontSize = 6;
        this.ctx.font = fontSize + 'px SpaceInvaders';

        // bottom line
        this.ctx.fillStyle = 'rgb(0, 255, 0)';
        this.ctx.fillRect(0, 240, this.settings.relativeWidth, 1);

        // level
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.fillText(this.state.game.level.toString().padStart(2, '0'), padding, 250);

        // lives
        const img = new Image();
        img.src = FriendlyShip;
        const sWidth = 26;
        const sHeight = 16;
        let dx = 10;
        const dy = 242;
        const dWidth = 16;
        const dHeight = 8;

        if (this.state.player.lives > 0) {
            this.ctx.drawImage(img, 0, 0, sWidth, sHeight, dx, dy, dWidth, dHeight);
        }
        if (this.state.player.lives > 1) {
            dx = 30;
            this.ctx.drawImage(img, 0, 0, sWidth, sHeight, dx, dy, dWidth, dHeight);
        }

        // credit
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.fillText(("CREDIT 99").padStart(2, '0'), 165, 250);
    }

    strokeDebug() {
        this.ctx.strokeStyle = 'rgb(255,0,0)';
        this.ctx.strokeRect(1, 1, this.settings.relativeWidth-1, this.settings.relativeHeight-1);
    }


}
