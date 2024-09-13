import {System} from "./system";
import {Entity} from "../entities/entity";
import {PositionComponent} from "../components/position-component";
import {PlayerComponent} from "../components/player/player-component";
import {PlayerRocketComponent} from "../components/player/player-rocket-component";
import {PlayerEntity} from "../entities/player-entity";
import {PlayerRocketEntities} from "../entities/player-rocket-entities";
import {ExtentComponent} from "../components/extent-component";
import {GameSettings} from "../../game-settings";

export class UserInputSystem implements System {

    private plRocketEntities: Entity[] = [];
    private pl: PlayerComponent;
    private plPos: PositionComponent;
    private settings: GameSettings;

    constructor(entities: Map<string, Entity[]>, settings: GameSettings) {
        this.settings = settings;
        const player = entities.get(PlayerEntity.name)![0];
        this.pl = player.components.get(PlayerComponent.name) as PlayerComponent;
        this.plPos = player.components.get(PositionComponent.name) as PositionComponent;
        this.plRocketEntities = entities.get(PlayerRocketEntities.name)!;
    }

    process(): void {

        if (this.pl.fireRocket) {
            // Filter not visible
            const notVisibleRockets = this.plRocketEntities.filter(entity => {
                const plRocket = entity.components.get(PlayerRocketComponent.name) as PlayerRocketComponent;
                return !plRocket.visible;
            });

            // Filter visible and sort by latest triggerTime
            const visibleRockets = this.plRocketEntities.filter(entity => {
                const plRocket = entity.components.get(PlayerRocketComponent.name) as PlayerRocketComponent;
                return plRocket.visible;
            }).sort((a, b) => {
                const left = a.components.get(PlayerRocketComponent.name) as PlayerRocketComponent;
                const right = b.components.get(PlayerRocketComponent.name) as PlayerRocketComponent;
                return right.triggerTime - left.triggerTime;
            });

            // If none visible, fire first rocket
            if (notVisibleRockets.length === 3) {
                this.setRocketVisible(notVisibleRockets[0]);
            }
            // If visible rockets less than 3, Fire next rocket with a minimum time difference from latest visible rocket
            else if (visibleRockets.length < 3) {
                const plRocketVisible = visibleRockets[0].components.get(PlayerRocketComponent.name) as PlayerRocketComponent;
                if (performance.now() - plRocketVisible.triggerTime > this.settings.player.fireDelay) {
                    this.setRocketVisible(notVisibleRockets[0]);
                }
            }
        }
    }

    private setRocketVisible(entity: Entity): void {
        const plRocket = entity.components.get(PlayerRocketComponent.name) as PlayerRocketComponent;
        const plRocketPos = entity.components.get(PositionComponent.name) as PositionComponent;
        const plRocketExtent = entity.components.get(ExtentComponent.name) as ExtentComponent;
        plRocket.visible = true;
        plRocket.exploding = false;
        plRocket.triggerTime = performance.now();
        plRocketPos.dx = this.plPos.dx + this.pl.dWidth / 2;
        plRocketPos.dy = this.plPos.dy - this.pl.dHeight / 2;
        plRocketExtent.setExtent(plRocketPos.dx, plRocket.dWidth, plRocketPos.dy, plRocket.dHeight);
    }
}
