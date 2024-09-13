import {CanvasSystem} from "./systems/canvas-system";
import {UserInputSystem} from "./systems/user-input-system";
import {AlienRocketSystem} from "./systems/alien-rocket-system";
import {CollisionSystem} from "./systems/collision-system";
import {GameLogicSystem} from "./systems/game-logic-system";
import {MotionSystem} from "./systems/motion-system";
import {RenderSystem} from "./systems/render-system";
import {System} from "./systems/system";
import {Entity} from "./entities/entity";
import {GameSettings} from "../game-settings";
import {GameState} from "../game-state";

export class Systems {

    private readonly entities: Map<string, Entity[]>;
    private readonly settings: GameSettings;
    private readonly state: GameState;

    constructor(entities: Map<string, Entity[]>, settings: GameSettings, state: GameState) {
        this.entities = entities;
        this.settings = settings;
        this.state = state;
    }

    getSystems(canvas: HTMLCanvasElement): System[] {
        const systems: System[] = [];

        // Process the state of the game
        const userInputSystem = new UserInputSystem(this.entities, this.settings);
        systems.push(userInputSystem);

        const alienRocketSystem = new AlienRocketSystem(this.entities, this.settings);
        systems.push(alienRocketSystem);

        const collisionSystem = new CollisionSystem(this.entities, this.state);
        systems.push(collisionSystem);

        const gameLogicSystem = new GameLogicSystem(this.entities, this.settings, this.state);
        systems.push(gameLogicSystem);

        const motionSystem = new MotionSystem(this.entities, this.settings);
        systems.push(motionSystem);

        // Render the state of the game
        const canvasSystem = new CanvasSystem(this.entities, this.settings, this.state);
        systems.push(canvasSystem);

        const renderSystem = new RenderSystem(canvas, this.entities, this.state, this.settings);
        systems.push(renderSystem);

        return systems;
    }
}
