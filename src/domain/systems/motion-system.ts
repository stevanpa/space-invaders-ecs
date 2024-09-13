import {System} from "./system";
import {Entity} from "../entities/entity";
import {AlienImgComponent} from "../components/aliens/alien-img-component";
import {PositionComponent} from "../components/position-component";
import {PlayerRocketComponent} from "../components/player/player-rocket-component";
import {PlayerComponent} from "../components/player/player-component";
import {AlienRocketComponent} from "../components/aliens/alien-rocket-component";
import {AlienSaucerImgComponent} from "../components/aliens/alien-saucer-img-component";
import {ExtentComponent} from "../components/extent-component";
import {PlayerEntity} from "../entities/player-entity";
import {AlienEntities} from "../entities/alien-entities";
import {AlienRocketsEntities} from "../entities/alien-rockets-entities";
import {PlayerRocketEntities} from "../entities/player-rocket-entities";
import {AlienSaucerEntity} from "../entities/alien-saucer-entity";
import {GameSettings} from "../../game-settings";

export class MotionSystem implements System {

    private player: Entity;
    private aliens: Entity[];
    private alienRockets: Entity[];
    private playerRockets: Entity[];
    private saucer: Entity;
    private settings: GameSettings;

    constructor(entities: Map<string, Entity[]>, settings: GameSettings) {
        this.aliens = entities.get(AlienEntities.name)!;
        this.alienRockets = entities.get(AlienRocketsEntities.name)!;
        this.player = entities.get(PlayerEntity.name)![0];
        this.playerRockets = entities.get(PlayerRocketEntities.name)!;
        this.saucer = entities.get(AlienSaucerEntity.name)![0];
        this.settings = settings;
    }

    process(): void {
        this.updateAlienSpeed();
        this.updateAlienMoveDirection();
        this.updateAliensPosition();
        this.updateAlienRocketPosition()
        this.updatePlayerPosition();
        this.updatePlayerRocketsPosition();
        this.updateSaucerPosition();
    }

    // If less then X aliens up the speed, for now less than 9
    private updateAlienSpeed() {
        const aliens = this.aliens.filter(entity => {
            const alien = entity.components.get(AlienImgComponent.name) as AlienImgComponent;
            return alien.visible;
        });
        if (aliens.length === 8) {
            this.settings.aliens.moveDelay = 250;
        }
        if (aliens.length === 2) {
            this.settings.aliens.moveDelay = 200;
        }
        if (aliens.length === 1) {
            this.settings.aliens.moveDelay = 100;
        }
    }

    private updateAlienMoveDirection(): void {
        // Get Aliens BoundingBox
        let maxX = 0;
        let maxY = 0;
        let minX = this.settings.relativeWidth;
        let minY = this.settings.relativeHeight;
        const padding = 10;
        this.aliens.forEach(entity => {
            const components = entity.components;
            const img = components.get(AlienImgComponent.name) as AlienImgComponent;
            const pos = components.get(PositionComponent.name) as PositionComponent;
            if (img.visible) {
                maxX = maxX < pos.dx + img.dWidth + padding ? pos.dx + img.dWidth + padding : maxX;
                maxY = maxY < pos.dy + img.dHeight ? pos.dy + img.dHeight : maxY;
                minX = minX > pos.dx ? pos.dx - padding : minX;
                minY = minY > pos.dy ? pos.dy : minY;
            }
        });

        // Aliens move direction
        this.aliens.forEach(entity => {
            const components = entity.components;
            const img = components.get(AlienImgComponent.name) as AlienImgComponent;
            if (img.moveRight) {
                if (maxX < 224) {
                    img.moveRight = true;
                } else {
                    img.moveRight = false;
                    img.moveLeft = true;
                    img.moveDown = true;
                }
            }
            if (img.moveLeft) {
                if (minX > 0) {
                    img.moveLeft = true;
                } else {
                    img.moveLeft = false;
                    img.moveRight = true;
                    img.moveDown = true;
                }
            }
        });
    }

    private updateAliensPosition(): void {
        // Update Aliens position
        let startTime = performance.now();
        this.aliens.forEach(entity => {
            const components = entity.components;
            const img = components.get(AlienImgComponent.name) as AlienImgComponent;
            const pos = components.get(PositionComponent.name) as PositionComponent;
            const extent = components.get(ExtentComponent.name) as ExtentComponent;
            if (startTime - img.startTime >= this.settings.aliens.moveDelay) {
                if (img.moveDown) {
                    pos.dy += 5;
                    img.moveDown = false;
                } else if (img.moveRight) {
                    pos.dx += 5;
                } else if (img.moveLeft) {
                    pos.dx -= 5;
                }
            }
            extent.setExtent(pos.dx, img.dWidth, pos.dy, img.dHeight);
        });

        // Reset Aliens startTime
        startTime = performance.now();
        this.aliens.forEach(entity => {
            const components = entity.components;
            const img = components.get(AlienImgComponent.name) as AlienImgComponent;
            if (startTime - img.startTime >= this.settings.aliens.moveDelay) {
                img.startTime = startTime;
            }
        });
    }

    private updateAlienRocketPosition() {
        this.alienRockets.forEach(entity => {
            const components = entity.components;
            const img = components.get(AlienRocketComponent.name) as AlienRocketComponent;
            const pos = components.get(PositionComponent.name) as PositionComponent;
            const rocketExtent = components.get(ExtentComponent.name) as ExtentComponent;
            if (img.visible) {
                if (pos.dy < 256 - 23) {
                    pos.dy += 1;
                } else {
                    pos.dy = -10;
                    img.visible = false;
                }
            }
            if(!img.visible && !img.exploding) {
                pos.dy = -10;
            }
            rocketExtent.setExtent(pos.dx, img.dWidth, pos.dy, img.dHeight);
        });
    }

    private updatePlayerPosition(): void {
        const components = this.player.components;
        const pl = components.get(PlayerComponent.name) as PlayerComponent;
        const plPos = components.get(PositionComponent.name) as PositionComponent;
        const plExtent = components.get(ExtentComponent.name) as ExtentComponent;
        if (pl.rightPressed && plPos.dx + pl.dWidth < 224) {
            plPos.dx += 2;
        } else {
            pl.rightPressed = false;
        }
        if (pl.leftPressed && plPos.dx > 0) {
            plPos.dx -= 2;
        } else {
            pl.leftPressed = false;
        }
        plExtent.setExtent(plPos.dx, pl.dWidth, plPos.dy, pl.dHeight);
    }

    private updatePlayerRocketsPosition(): void {
        // Update Player Rockets position
        this.playerRockets.forEach(entity => {
            const components = entity.components;
            const rocket = components.get(PlayerRocketComponent.name) as PlayerRocketComponent;
            const rocketPos = components.get(PositionComponent.name) as PositionComponent;
            const rocketExtent = components.get(ExtentComponent.name) as ExtentComponent;
            if (rocket.visible) {
                if (rocketPos.dy > 23) {
                    rocketPos.dy -= 2;
                } else {
                    rocketPos.dy = -10;
                    rocket.visible = false;
                }
            }
            if(!rocket.visible && !rocket.exploding) {
                rocketPos.dy = -10;
            }

            rocketExtent.setExtent(rocketPos.dx, rocket.dWidth, rocketPos.dy, rocket.dHeight);
        });
    }

    private updateSaucerPosition(): void {
        const components = this.saucer.components;
        const img = components.get(AlienSaucerImgComponent.name) as AlienSaucerImgComponent;
        const pos = components.get(PositionComponent.name) as PositionComponent;
        const extent = components.get(ExtentComponent.name) as ExtentComponent;
        if (img.visible) {
            if (img.moveRight && pos.dx > 224) {
                pos.dx = 0 - img.dWidth;
                img.startTime = performance.now();
                img.visible = false;
            } else if (!img.moveRight && pos.dx < 0) {
                pos.dx = 224 + img.dWidth;
                img.startTime = performance.now();
                img.visible = false;
            } else if (img.moveRight) {
                pos.dx += 1;
            } else {
                pos.dx -= 1;
            }
            extent.setExtent(pos.dx, img.dWidth, pos.dy, img.dHeight);
        }
    }

}
