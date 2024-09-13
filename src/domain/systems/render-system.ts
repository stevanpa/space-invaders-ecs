import {Entity} from "../entities/entity";
import {System} from "./system";
import {PositionComponent} from "../components/position-component";
import {AlienImgComponent} from "../components/aliens/alien-img-component";
import {ShieldComponent} from "../components/shield-component";
import {PlayerComponent} from "../components/player/player-component";
import {PlayerRocketComponent} from "../components/player/player-rocket-component";
import {AlienRocketComponent} from "../components/aliens/alien-rocket-component";
import {AlienSaucerImgComponent} from "../components/aliens/alien-saucer-img-component";
import {ExtentComponent} from "../components/extent-component";
import {ImageComponent} from "../components/image-component";
import {PlayerEntity} from "../entities/player-entity";
import {PlayerRocketEntities} from "../entities/player-rocket-entities";
import {AlienSaucerEntity} from "../entities/alien-saucer-entity";
import {AlienEntities} from "../entities/alien-entities";
import {AlienRocketsEntities} from "../entities/alien-rockets-entities";
import {ShieldEntity} from "../entities/shield-entities";
import {GameState} from "../../game-state";
import {GameSettings} from "../../game-settings";

export class RenderSystem implements System {

    private ctx: CanvasRenderingContext2D;
    private alienFrameCount = performance.now();
    private alienRocketsFrameCount = performance.now();
    private entities: Map<string, Entity[]>;
    private player: Entity;
    private playerRockets: Entity[];
    private saucer: Entity;
    private aliens: Entity[];
    private alienRockets: Entity[];
    private shields: Entity[];
    private state: GameState;
    private settings: GameSettings;

    constructor(canvas: HTMLCanvasElement, entities: Map<string, Entity[]>, state: GameState, settings: GameSettings) {
        this.ctx = canvas.getContext("2d")!;
        this.entities = entities;
        this.player = entities.get(PlayerEntity.name)![0];
        this.playerRockets = entities.get(PlayerRocketEntities.name)!;
        this.saucer = entities.get(AlienSaucerEntity.name)![0];
        this.aliens = entities.get(AlienEntities.name)!;
        this.alienRockets = entities.get(AlienRocketsEntities.name)!;
        this.shields = entities.get(ShieldEntity.name)!;
        this.state = state;
        this.settings = settings;
    }

    process(): void {
        const components = this.player.components;

        // Player
        const plImg = components.get(PlayerComponent.name) as PlayerComponent;
        const plPos = components.get(PositionComponent.name) as PositionComponent;
        if (this.state.player.alive) {
            this.drawImage(plImg, plPos);
        }
        if (plImg.exploding) {
            if (performance.now() - plImg.explosionFrameCount <= this.settings.explosionDelay) {
                plImg.setExplode();
                const customPos = Object.create(plPos);
                customPos.dx -= 2;
                this.drawImage(plImg, customPos);
            } else {
                plImg.reset();
                plPos.reset();
            }
        }

        // Player rockets
        this.playerRockets.forEach(entity => {
            const components = entity.components;
            const img = components.get(PlayerRocketComponent.name) as PlayerRocketComponent;
            const pos = components.get(PositionComponent.name) as PositionComponent;
            if (img.visible) {
                img.setImageOne();
                this.drawImage(img, pos);
            }
            if (img.exploding) {
                if (performance.now() - img.explosionFrameCount <= this.settings.explosionDelay) {
                    img.setExplode();
                    const customPos = Object.create(pos);
                    customPos.dx -= 4;
                    this.drawImage(img, customPos);
                } else {
                    img.reset()
                }
            }
        });

        // Saucer
        const img = this.saucer.components.get(AlienSaucerImgComponent.name) as AlienSaucerImgComponent;
        const pos = this.saucer.components.get(PositionComponent.name) as PositionComponent;
        if (img.visible) {
            this.drawImage(img, pos);
        }
        if (img.exploding) {
            if (performance.now() - img.explosionFrameCount <= this.settings.explosionDelay) {
                img.setExplode();
                const customPos = Object.create(pos);
                customPos.dx -= 3;
                this.drawImage(img, customPos);
            } else {
                img.reset();
            }
        }

        // Aliens
        this.aliens.forEach(entity => {
            const components = entity.components;
            const img = components.get(AlienImgComponent.name) as AlienImgComponent;
            const pos = components.get(PositionComponent.name) as PositionComponent;
            if (img.visible) {
                if (performance.now() - this.alienFrameCount <= this.settings.aliens.moveDelay) {
                    img.setImageOne();
                } else if (performance.now() - this.alienFrameCount <= this.settings.aliens.moveDelay * 2) {
                    img.setImageTwo();
                } else {
                    img.setImageOne();
                    this.alienFrameCount = performance.now();
                }
                this.drawImage(img, pos);
            }
            if (img.exploding) {
                if (performance.now() - img.explosionFrameCount <= this.settings.explosionDelay) {
                    img.setExplode();
                    this.drawImage(img, pos);
                } else {
                    img.exploding = false;
                    this.alienFrameCount = performance.now();
                }
            }
        });

        // Alien Rockets
        this.alienRockets.forEach(entity => {
            const components = entity.components;
            const img = components.get(AlienRocketComponent.name) as AlienRocketComponent;
            const pos = components.get(PositionComponent.name) as PositionComponent;
            if (img.visible) {
                if (performance.now() - this.alienRocketsFrameCount <= 150) {
                    img.setImageOne();
                } else if (performance.now() - this.alienRocketsFrameCount <= 300) {
                    img.setImageTwo();
                } else if (performance.now() - this.alienRocketsFrameCount <= 450) {
                    img.setImageThree();
                } else if (performance.now() - this.alienRocketsFrameCount <= 600) {
                    img.setImageFour();
                } else {
                    img.setImageOne();
                    this.alienRocketsFrameCount = performance.now();
                }
                this.drawImage(img, pos);
            }
            if (img.exploding) {
                if (performance.now() - img.explosionFrameCount <= this.settings.explosionDelay) {
                    img.setExplode();
                    const customPos = Object.create(pos);
                    customPos.dx -= 3;
                    this.drawImage(img, customPos);
                } else {
                    img.exploding = false;
                    this.alienRocketsFrameCount = performance.now();
                }
            }
        });

        // Shields
        this.shields.forEach(entity => {
            const components = entity.components;
            const img = components.get(ShieldComponent.name) as ShieldComponent;
            const pos = components.get(PositionComponent.name) as PositionComponent;
            if (img.visible) {
                this.drawImage(img, pos);
            }
        });

        // Draw Extent
        if (this.settings.extent.debug) {
            this.entities.forEach((value: Entity[], key, map) => {
                value.forEach((entity: Entity) => {
                    const components = entity.components;
                    if (components.has(ExtentComponent.name)) {
                        const extent = components.get(ExtentComponent.name) as ExtentComponent;
                        this.ctx.strokeStyle = 'rgb(255, 0, 0)';
                        this.ctx.strokeRect(extent.minx, extent.maxy, extent.maxx - extent.minx, extent.miny - extent.maxy);
                    }
                });
            });
        }
    }

    private drawImage(img: ImageComponent, pos: PositionComponent) {
        this.ctx.drawImage(img.img,
            img.sx, img.sy, img.sWidth, img.sHeight,
            pos.dx, pos.dy, img.dWidth, img.dHeight);
    }
}
