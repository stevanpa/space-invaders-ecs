import {Entity} from "../entities/entity";
import {System} from "./system";
import {PlayerRocketComponent} from "../components/player/player-rocket-component";
import {ExtentComponent} from "../components/extent-component";
import {AlienImgComponent} from "../components/aliens/alien-img-component";
import {AlienSaucerImgComponent} from "../components/aliens/alien-saucer-img-component";
import {ShieldComponent} from "../components/shield-component";
import {AlienRocketComponent} from "../components/aliens/alien-rocket-component";
import {PositionComponent} from "../components/position-component";
import {PlayerComponent} from "../components/player/player-component";
import {PlayerEntity} from "../entities/player-entity";
import {FinishLineEntity} from "../entities/finish-line-entity";
import {CeilingLineEntity} from "../entities/ceiling-line.entity";
import {PlayerRocketEntities} from "../entities/player-rocket-entities";
import {AlienEntities} from "../entities/alien-entities";
import {AlienSaucerEntity} from "../entities/alien-saucer-entity";
import {ShieldEntity} from "../entities/shield-entities";
import {AlienRocketsEntities} from "../entities/alien-rockets-entities";
import {GameState} from "../../game-state";

export class CollisionSystem implements System {

    private player: Entity;
    private playerRockets: Entity[];
    private aliens: Entity[];
    private saucer: Entity;
    private shields: Entity[];
    private alienRockets: Entity[];
    private floor: Entity;
    private ceiling: Entity;
    private state: GameState;

    constructor(entities: Map<string, Entity[]>, state: GameState) {
        this.player = entities.get(PlayerEntity.name)![0];
        this.floor = entities.get(FinishLineEntity.name)![0];
        this.ceiling = entities.get(CeilingLineEntity.name)![0];
        this.playerRockets = entities.get(PlayerRocketEntities.name)!;
        this.aliens = entities.get(AlienEntities.name)!;
        this.saucer = entities.get(AlienSaucerEntity.name)![0];
        this.shields = entities.get(ShieldEntity.name)!;
        this.alienRockets = entities.get(AlienRocketsEntities.name)!;
        this.state = state;
    }

    process(): void {
        // Player rockets
        this.playerRockets.forEach((entity: Entity) => {
            const components = entity.components;
            if (components.has(PlayerRocketComponent.name)) {
                const rocket = components.get(PlayerRocketComponent.name) as PlayerRocketComponent;
                const rocketPos = components.get(PositionComponent.name) as PositionComponent;
                const rocketExtent = components.get(ExtentComponent.name) as ExtentComponent;
                if (rocket.visible) {
                    this.rocketsAliens(rocket, rocketPos, rocketExtent);
                    this.rocketsSaucers(rocket, rocketPos, rocketExtent);
                    this.rocketsShields(rocket, rocketExtent);
                    this.rocketsRockets(rocket, rocketExtent);
                    this.rocketsCeiling(rocket, rocketExtent);
                }
            }
        });

        // Alien rockets vs Shields, Player and floor
        this.alienRockets.forEach((entity: Entity) => {
            const components = entity.components;
            const rocket = components.get(AlienRocketComponent.name) as AlienRocketComponent;
            const rocketExtent = components.get(ExtentComponent.name) as ExtentComponent;
            if (rocket.visible) {
                this.rocketsShields(rocket, rocketExtent);
                this.rocketsPlayer(rocketExtent);
                this.rocketsFloor(rocket, rocketExtent);
            }
        });

        // Aliens vs Shields and Player
        this.aliens.forEach((entity: Entity) => {
            const components = entity.components;
            if (components.has(AlienImgComponent.name)) {
                const alien = components.get(AlienImgComponent.name) as AlienImgComponent;
                const alienExtent = components.get(ExtentComponent.name) as ExtentComponent;
                if (alien.visible) {
                    this.aliensShields(alien, alienExtent);
                    this.aliensPlayer(alien, alienExtent);
                }
            }
        });
    }

    private rocketsPlayer(rocketExtent: ExtentComponent) {
        const player = this.player.components.get(PlayerComponent.name) as PlayerComponent;
        const playerExtent = this.player.components.get(ExtentComponent.name) as ExtentComponent;
        if (this.state.player.alive && rocketExtent.intersects(playerExtent)) {
            this.state.player.alive = false;
            this.state.player.lives -= 1;
            // initiate explosion
            player.exploding = true;
            player.explosionFrameCount = performance.now();
            this.resetRockets();

        }
    }

    private aliensShields(alien: AlienImgComponent, alienExtent: ExtentComponent) {
        this.shields.forEach((inner: Entity) => {
            const shield = inner.components.get(ShieldComponent.name) as ShieldComponent;
            const shieldExtent = inner.components.get(ExtentComponent.name) as ExtentComponent;
            if (shield.visible && alienExtent.intersects(shieldExtent)) {
                this.shieldDecay(shield);
                alien.visible = false;
            }
        });
    }

    private aliensPlayer(alien: AlienImgComponent, alienExtent: ExtentComponent) {
        const player = this.player.components.get(PlayerComponent.name) as PlayerComponent;
        const playerExtent = this.player.components.get(ExtentComponent.name) as ExtentComponent;
        if (this.state.player.alive && alienExtent.intersects(playerExtent)) {
            this.state.player.alive = false;
            this.state.player.lives -= 1;
            alien.visible = false;
            // initiate explosion
            player.exploding = true;
            player.explosionFrameCount = performance.now();
            this.resetRockets();
        }
    }

    private rocketsAliens(rocket: PlayerRocketComponent,
                          rocketPos: PositionComponent,
                          rocketExtent: ExtentComponent) {
        this.aliens.forEach((inner: Entity) => {
            const alien = inner.components.get(AlienImgComponent.name) as AlienImgComponent;
            const alienExtent = inner.components.get(ExtentComponent.name) as ExtentComponent;
            if (alien.visible && rocketExtent.intersects(alienExtent)) {
                alien.visible = false;
                rocketPos.dy = -10;
                rocket.visible = false;
                this.state.player.score += alien.points;
                // initiate explosion
                alien.exploding = true;
                alien.explosionFrameCount = performance.now();
            }
        });
    }

    private rocketsSaucers(rocket: PlayerRocketComponent,
                           rocketPos: PositionComponent,
                           rocketExtent: ExtentComponent) {
        const alien = this.saucer.components.get(AlienSaucerImgComponent.name) as AlienSaucerImgComponent;
        const alienExtent = this.saucer.components.get(ExtentComponent.name) as ExtentComponent;
        if (alien.visible && rocketExtent.intersects(alienExtent)) {
            alien.visible = false;
            alien.startTime = performance.now();
            rocketPos.dy = -10;
            rocket.visible = false;
            this.state.player.score += alien.points;
            // initiate explosion
            alien.exploding = true;
            alien.explosionFrameCount = performance.now();
        }
    }

    private rocketsRockets(rocket: PlayerRocketComponent,
                           rocketExtent: ExtentComponent) {
        this.alienRockets.forEach((inner: Entity) => {
            const alienRocket = inner.components.get(AlienRocketComponent.name) as AlienRocketComponent;
            const alienRocketExtent = inner.components.get(ExtentComponent.name) as ExtentComponent;
            if (alienRocket.visible && rocketExtent.intersects(alienRocketExtent)) {
                alienRocket.visible = false;
                rocket.visible = false;
            }
        });
    }

    private rocketsShields(rocket: PlayerRocketComponent | AlienRocketComponent,
                           rocketExtent: ExtentComponent): void {
        this.shields.forEach((inner: Entity) => {
            const shield = inner.components.get(ShieldComponent.name) as ShieldComponent;
            const shieldExtent = inner.components.get(ExtentComponent.name) as ExtentComponent;
            if (shield.visible && rocketExtent.intersects(shieldExtent)) {
                this.shieldDecay(shield);
                rocket.visible = false;
                // initiate explosion
                rocket.exploding = true;
                rocket.explosionFrameCount = performance.now();
            }
        });
    }

    private rocketsCeiling(rocket: PlayerRocketComponent,
                           rocketExtent: ExtentComponent): void {
        const ceilingExtent = this.ceiling.components.get(ExtentComponent.name) as ExtentComponent;
        if (rocketExtent.intersects(ceilingExtent)) {
            rocket.visible = false;
            // initiate explosion
            rocket.exploding = true;
            rocket.explosionFrameCount = performance.now();
        }
    }

    private rocketsFloor(rocket: AlienRocketComponent,
                         rocketExtent: ExtentComponent) {
        const finishExtent = this.floor.components.get(ExtentComponent.name) as ExtentComponent;
        if (rocketExtent.intersects(finishExtent)) {
            rocket.visible = false;
            // initiate explosion
            rocket.exploding = true;
            rocket.explosionFrameCount = performance.now();
        }
    }

    private shieldDecay(shield: ShieldComponent) {
        switch (shield.hits) {
            case 5:
                shield.setImageTwo();
                shield.hits = 4;
                break;
            case 4:
                shield.setImageThree();
                shield.hits = 3;
                break;
            case 3:
                shield.setImageFour();
                shield.hits = 2;
                break;
            case 2:
                shield.setImageFive()
                shield.hits = 1;
                break;
            case 1:
                shield.visible = false;
                shield.setImageOne();
                shield.hits = 5;
                break;
        }
    }

    private resetRockets() {
        // Reset all alien rockets
        this.alienRockets.forEach((entity: Entity) => {
            const rocket = entity.components.get(AlienRocketComponent.name) as AlienRocketComponent;
            rocket.visible = false;
            rocket.triggerTime = performance.now();
        });
        // Reset all player rockets
        this.playerRockets.forEach((entity: Entity) => {
            const rocket = entity.components.get(PlayerRocketComponent.name) as PlayerRocketComponent;
            rocket.visible = false;
        });
    }
}
