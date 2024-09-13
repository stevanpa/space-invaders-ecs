import {Entity} from "./entities/entity";
import {CanvasEntity} from "./entities/canvas-entity";
import {PlayerEntity} from "./entities/player-entity";
import {PlayerRocketEntities} from "./entities/player-rocket-entities";
import {AlienEntities} from "./entities/alien-entities";
import {AlienRocketsEntities} from "./entities/alien-rockets-entities";
import {AlienSaucerEntity} from "./entities/alien-saucer-entity";
import {ShieldEntity} from "./entities/shield-entities";
import {FinishLineEntity} from "./entities/finish-line-entity";
import {CeilingLineEntity} from "./entities/ceiling-line.entity";

export class Entities {

    private readonly canvas: HTMLCanvasElement;
    private playerEntity: PlayerEntity;
    private entities: Map<string, Entity[]> = new Map();

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.playerEntity = new PlayerEntity();
        this.entities.set(PlayerEntity.name, this.playerEntity.getEntities());
    }

    getEntities(): Map<string, Entity[]> {
        const canvasEntity = new CanvasEntity(this.canvas);
        this.entities.set(canvasEntity.name, canvasEntity.getEntities());

        const playerRockets = new PlayerRocketEntities();
        this.entities.set(PlayerRocketEntities.name, playerRockets.getEntities());

        const aliens = new AlienEntities(30, 24);
        this.entities.set(AlienEntities.name, aliens.getEntities());

        const alienRockets = new AlienRocketsEntities();
        this.entities.set(AlienRocketsEntities.name, alienRockets.getEntities());

        const saucer = new AlienSaucerEntity(23, -30);
        this.entities.set(AlienSaucerEntity.name, saucer.getEntities());

        const shields = new ShieldEntity();
        this.entities.set(ShieldEntity.name, shields.getEntities());

        const finishLine = new FinishLineEntity();
        this.entities.set(finishLine.name, finishLine.getEntities());

        const ceilingLine = new CeilingLineEntity();
        this.entities.set(ceilingLine.name, ceilingLine.getEntities());

        return this.entities;
    }
}
