import {System} from "./domain/systems/system";
import {Entity} from "./domain/entities/entity";
import {Systems} from "./domain/systems";
import {Entities} from "./domain/entities";
import {GameState} from "./game-state";
import {GameSettings} from "./game-settings";
import {Intro} from "./domain/pages/intro";
import {PlayerComponent} from "./domain/components/player/player-component";
import {Respawn} from "./domain/pages/respawn";
import {End} from "./domain/pages/end";
import {HighScores} from "./high-scores";

export class Game {

    state: GameState = new GameState();
    settings: GameSettings = new GameSettings();

    canvasGame: HTMLCanvasElement;
    canvases: HTMLCanvasElement[] = [];
    systems: System[] = [];
    intro: Intro;
    respawn: Respawn;
    end: End;

    entities: Map<string, Entity[]> = new Map();

    private readonly introEventListener: (e: KeyboardEvent) => void;
    private readonly respawnEventListener: (e: KeyboardEvent) => void;
    private readonly gameEventListenerKeyDown: (e: KeyboardEvent) => void;
    private readonly gameEventListenerKeyUp: (e: KeyboardEvent) => void;
    private readonly hiScoreEventListenerClick: (e: MouseEvent) => void;
    private readonly saveHiScoreClick: (e: MouseEvent) => void;
    // private readonly restartGameClick: (e: MouseEvent) => void;

    constructor() {
        this.settings.lastTick = performance.now();
        const container = document.createElement('div');
        container.id = 'container';
        document.body.appendChild(container);
        this.canvasGame = document.createElement('canvas');
        this.canvasGame.id = 'game';
        container.appendChild(this.canvasGame);
        this.canvases.push(this.canvasGame);

        addEventListener("DOMContentLoaded", () => {
            this.setAspectRatioToUse();
        });
        addEventListener("resize", () => {
            this.setAspectRatioToUse();
        });

        this.introEventListener = (e: KeyboardEvent) => this.introKeyDownEvent(e);
        this.respawnEventListener = (e: KeyboardEvent) => this.respawnKeyDownEvent(e);
        this.gameEventListenerKeyDown = (e: KeyboardEvent) => this.keyDownHandler(e);
        this.gameEventListenerKeyUp = (e: KeyboardEvent) => this.keyUpHandler(e);
        this.hiScoreEventListenerClick = (e: MouseEvent) => this.clickHighScore(e);
        this.saveHiScoreClick = (e: MouseEvent) => this.saveHiScore(e);
        // this.restartGameClick = (e: MouseEvent) => this.restartGame(e);

        // Create entities ---------------------------------------------------
        const entities = new Entities(this.canvasGame);
        this.entities = entities.getEntities();

        // Setup systems ------------------------------------------------------
        const systems = new Systems(this.entities, this.settings, this.state);
        this.systems = systems.getSystems(this.canvasGame);

        this.intro = new Intro(this.state, this.settings);
        this.respawn = new Respawn(this.state, this.settings);
        this.end = new End(this.state, this.settings);

        // Start Game --------------------------------------------------------
        this.init();
    }

    private setAspectRatioToUse(): void {
        const body = this.canvasGame.parentElement as HTMLBodyElement;

        const aspectRatioWidth = Math.floor(body.clientWidth / this.settings.relativeWidth);
        const aspectRatioHeight = Math.floor(body.clientHeight / this.settings.relativeHeight);
        const aspectRatio = (aspectRatioHeight < aspectRatioWidth) ? aspectRatioHeight : aspectRatioWidth;

        this.canvases.forEach(canvas => {
            canvas.width = this.settings.relativeWidth * aspectRatio;
            canvas.height = this.settings.relativeHeight * aspectRatio;
            const ctx = canvas.getContext('2d')!;
            ctx.setTransform(aspectRatio, 0, 0, aspectRatio, 0, 0);
            ctx.save();
        });
    }

    init() {
        addEventListener('keydown', this.introEventListener, false);
        this.gameLoop();
    }

    gameLoop(): void {

        if (this.state.game.intro) {
            this.settings.tickLength = 20;
            const time = performance.now();
            if (this.settings.renderNext(time)) {
                this.settings.lastTick = time;
                this.intro.process();
            }
        }

        if (this.state.game.start) {
            addEventListener('keydown', this.gameEventListenerKeyDown, false);
            addEventListener('keyup', this.gameEventListenerKeyUp, false);
            this.state.game.running = true;
            this.state.game.start = false;
        }

        if (this.state.game.respawn) {
            this.settings.tickLength = 20;
            const time = performance.now();
            if (this.settings.renderNext(time)) {
                this.settings.lastTick = time;
                this.respawn.process();
            }
        }

        if (this.state.game.end) {
            this.settings.tickLength = 20;
            if (this.settings.renderNext(performance.now())) {
                removeEventListener('keydown', this.gameEventListenerKeyDown, false);
                removeEventListener('keyup', this.gameEventListenerKeyUp, false);
                this.state.game.running = false;
                this.settings.lastTick = performance.now();
                this.checkForHighScore();
                if (this.state.game.hiScore && !document.getElementById('hi-score')) {
                    addEventListener('click', this.hiScoreEventListenerClick, false);
                } else if (!this.state.game.hiScore && !document.getElementById('hi-score')) {
                    // addEventListener('click', this.restartGameClick, false);
                }
                this.end.process();
            }
        }

        if (this.state.game.nextLevel) {
            // console.log('nextLevel', this.state.game);
            this.state.game.nextLevel = false;
            this.state.game.running = false;

            // console.log("You won!");
            // console.log("Score:", this.state.player.score);
            // console.log("Next level:", this.state.game.level);
            this.settings.aliens.moveDelay = 500;
            this.state.game.running = true;
        }

        if (!this.state.player.alive && !this.state.game.end) {
            removeEventListener('keydown', this.gameEventListenerKeyDown, false);
            removeEventListener('keyup', this.gameEventListenerKeyUp, false);
            this.state.game.running = false;
            if (this.state.player.lives > -1) {
                addEventListener('keydown', this.respawnEventListener, false);
                this.state.player.alive = true;
                this.state.game.respawn = true;
            } else if (!this.state.game.intro) {
                this.state.game.end = true;
            }
        }

        if (this.state.game.running) {
            this.settings.tickLength = 50;
            // Loop through the systems. NOTE: order of the systems can influence the game.
            if (this.settings.renderNext(performance.now())) {
                this.systems.forEach(system => {
                    system.process();
                });
            }
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    private keyDownHandler(e: KeyboardEvent) {
        const pl = this.entities.get('PlayerEntity')![0].components.get('PlayerComponent') as PlayerComponent;
        if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') {
            pl.rightPressed = true;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') {
            pl.leftPressed = true;
        }

        if (e.key === ' ') {
            pl.fireRocket = true;
        }
    }

    private keyUpHandler(e: KeyboardEvent) {
        const pl = this.entities.get('PlayerEntity')![0].components.get('PlayerComponent') as PlayerComponent;
        if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') {
            pl.rightPressed = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') {
            pl.leftPressed = false;
        }

        if (e.key === ' ') {
            pl.fireRocket = false;
        }
    }

    private introKeyDownEvent(e: KeyboardEvent) {
        if (e.key === ' ') {
            this.state.game.start = true;
            this.state.game.end = false;
            this.state.game.intro = false;
            this.state.player.alive = true;
            this.state.game.level = 1;
            this.state.player.lives = 2;
            // console.log('introKeyDownEvent', this.state.game);
            removeEventListener('keydown', this.introEventListener, false);
        }
    }

    private respawnKeyDownEvent(e: KeyboardEvent) {
        if (e.key === ' ') {
            this.state.game.start = true;
            this.state.game.respawn = false;
            removeEventListener('keydown', this.respawnEventListener, false);
        }
    }

    private clickHighScore(e: MouseEvent) {
        this.state.game.hiScore = false;
        const container = document.getElementById('container')!;
        const div = document.createElement('div');
        div.id = 'hi-score';
        div.appendChild(document.createElement('input'));
        const button = document.createElement('button');
        button.id = 'save';
        button.textContent = 'Save';
        button.addEventListener('click', this.saveHiScoreClick);
        div.appendChild(button);
        container.appendChild(div);
        removeEventListener('click', this.hiScoreEventListenerClick, false);
    }

    private saveHiScore(e: MouseEvent) {
        // save
        removeEventListener('click', this.saveHiScoreClick);
        const score = document.getElementsByTagName('input')[0];

        let highScores = localStorage.getItem('highScores');
        if (highScores) {
            const object = JSON.parse(highScores) as HighScores;
            object.values.push({name: score.value, score: this.state.player.score});
            localStorage.setItem('highScores', JSON.stringify(object));
        } else {
            const object: HighScores = {
                values: [{name: score.value, score: this.state.player.score}]
            }
            localStorage.setItem('highScores', JSON.stringify(object));
        }

        const div = document.getElementById('hi-score')!;
        div.remove();
        this.state.game.hiScore = false;
    }

    // private restartGame(e: MouseEvent) {
    //     this.state.game.end = false;
    //     this.state.game.intro = true;
    //     this.state.game.running = true;
    //     removeEventListener('click', this.restartGameClick);
    //     addEventListener('keydown', this.introEventListener, false);
    //     console.log('restartGame', this.state.game);
    // }

    private checkForHighScore() {
        let highScores = localStorage.getItem('highScores');
        // console.log(highScores);
        if (highScores) {
            const object = JSON.parse(highScores) as HighScores;
            const hiScore = object.values.sort((a, b) => b.score - a.score);
            this.state.game.hiScore = hiScore[0].score < this.state.player.score;
        } else {
            this.state.game.hiScore = true;
        }
        this.state.player.highScore = this.state.player.score;
    }

}
