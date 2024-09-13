import {System} from "./system";
import {Entity} from "../entities/entity";
import {AlienSaucerImgComponent} from "../components/aliens/alien-saucer-img-component";
import {PositionComponent} from "../components/position-component";
import {ExtentComponent} from "../components/extent-component";
import {AlienImgComponent} from "../components/aliens/alien-img-component";
import {ShieldComponent} from "../components/shield-component";
import {AlienRocketComponent} from "../components/aliens/alien-rocket-component";
import {PlayerRocketComponent} from "../components/player/player-rocket-component";
import {PlayerEntity} from "../entities/player-entity";
import {PlayerRocketEntities} from "../entities/player-rocket-entities";
import {AlienRocketsEntities} from "../entities/alien-rockets-entities";
import {ShieldEntity} from "../entities/shield-entities";
import {AlienEntities} from "../entities/alien-entities";
import {AlienSaucerEntity} from "../entities/alien-saucer-entity";
import {FinishLineEntity} from "../entities/finish-line-entity";
import {GameSettings} from "../../game-settings";
import {GameState} from "../../game-state";

export class GameLogicSystem implements System {

    private player: Entity;
    private playerRockets: Entity[];
    private alienRockets: Entity[];
    private shields: Entity[];
    private aliens: Entity[];
    private saucer: Entity;
    private finishLine: Entity;

    private settings: GameSettings;
    private state: GameState;

    constructor(entities: Map<string, Entity[]>, settings: GameSettings, state: GameState) {
        this.player = entities.get(PlayerEntity.name)![0];
        this.playerRockets = entities.get(PlayerRocketEntities.name)!;
        this.alienRockets = entities.get(AlienRocketsEntities.name)!;
        this.shields = entities.get(ShieldEntity.name)!;
        this.aliens = entities.get(AlienEntities.name)!;
        this.saucer = entities.get(AlienSaucerEntity.name)![0];
        this.finishLine = entities.get(FinishLineEntity.name)![0];
        this.settings = settings;
        this.state = state;
    }

    process(): void {

        // Saucer logic
        let startTime = performance.now();
        const aliens = this.aliens.filter(entity => {
            const alien = entity.components.get(AlienImgComponent.name) as AlienImgComponent;
            return alien.visible;
        });
        // If less then 9 aliens than the saucer may start appearing
        if (aliens.length < 9) {
            const components = this.saucer.components;
            const img = components.get(AlienSaucerImgComponent.name) as AlienSaucerImgComponent;
            const pos = components.get(PositionComponent.name) as PositionComponent;
            if (!img.visible) {
                if (startTime - img.startTime >= this.settings.saucerStartDelay) {
                    img.setMoveDirection();
                    img.setImageOne();
                    img.visible = true;
                    img.startTime = performance.now();
                    if (img.moveRight) {
                        pos.dx = 0 - img.dWidth;
                    } else {
                        pos.dx = this.settings.relativeWidth + img.dWidth;
                    }
                }
            }
        }

        // Game end logic
        // Aliens land
        const extent = this.finishLine.components.get(ExtentComponent.name) as ExtentComponent;
        this.aliens.forEach((inner: Entity) => {
            const alien = inner.components.get(AlienImgComponent.name) as AlienImgComponent;
            const alienExtent = inner.components.get(ExtentComponent.name) as ExtentComponent;
            if (alien.visible && extent.intersects(alienExtent)) {
                this.state.game.end = true;
            }
        });

        // Player clears level
        this.playerClearsLevel();
    }

    private playerClearsLevel(): void {
        const aliens: Entity[] = this.aliens.filter(entity => {
            const alien = entity.components.get(AlienImgComponent.name) as AlienImgComponent;
            return alien.visible;
        });
        // Aliens respawn, shields respawn, reset rockets, player set in start position.
        if (aliens.length === 0) {
            const playerPos = this.player.components.get(PositionComponent.name) as PositionComponent;
            playerPos.reset();
            this.state.game.level += 1;
            this.state.game.nextLevel = true;

            this.alienRockets.forEach((entity: Entity) => {
                const rockets = entity.components.get(AlienRocketComponent.name) as AlienRocketComponent;
                const pos = entity.components.get(PositionComponent.name) as PositionComponent;
                rockets.reset();
                pos.reset();
            });

            const saucer = this.saucer.components.get(AlienSaucerImgComponent.name) as AlienSaucerImgComponent;
            saucer.visible = false;

            this.aliens.forEach((entity: Entity) => {
                const alien = entity.components.get(AlienImgComponent.name) as AlienImgComponent;
                const pos = entity.components.get(PositionComponent.name) as PositionComponent;
                alien.reset();
                pos.reset();
                switch (this.state.game.level) {
                    case 2:
                    case 3:
                    case 4:
                        pos.dy += 32;
                        break;
                    case 5:
                    case 6:
                    case 7:
                        pos.dy += 64;
                        break;
                }
            });

            this.shields.forEach((entity: Entity) => {
                const shield = entity.components.get(ShieldComponent.name) as ShieldComponent;
                const pos = entity.components.get(PositionComponent.name) as PositionComponent;
                shield.reset();
                pos.reset();
            });

            this.playerRockets.forEach((entity: Entity) => {
                const rockets = entity.components.get(PlayerRocketComponent.name) as PlayerRocketComponent;
                const pos = entity.components.get(PositionComponent.name) as PositionComponent;
                rockets.reset();
                pos.reset();
            });
        }
    }

}
