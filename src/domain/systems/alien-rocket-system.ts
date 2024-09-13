import {System} from "./system";
import {Entity} from "../entities/entity";
import {PositionComponent} from "../components/position-component";
import {AlienImgComponent} from "../components/aliens/alien-img-component";
import {AlienEntities} from "../entities/alien-entities";
import {AlienRocketsEntities} from "../entities/alien-rockets-entities";
import {AlienRocketComponent} from "../components/aliens/alien-rocket-component";
import {GameSettings} from "../../game-settings";

export class AlienRocketSystem implements System {

    private aliens: Entity[] = [];
    private alienRocketEntities: Entity[] = [];
    private settings: GameSettings;

    constructor(entities: Map<string, Entity[]>, settings: GameSettings) {
        this.settings = settings;
        this.aliens = entities.get(AlienEntities.name)!
        this.alienRocketEntities = entities.get(AlienRocketsEntities.name)!
    }

    process(): void {
        const randomAlien = this.get_randomAlien();
        if (randomAlien) {
            const alienImg = randomAlien.components.get(AlienImgComponent.name) as AlienImgComponent;
            const alienPos = randomAlien.components.get(PositionComponent.name) as PositionComponent;

            // Filter not visible
            const notVisibleRockets = this.alienRocketEntities.filter(entity => {
                const rocket = entity.components.get(AlienRocketComponent.name) as AlienRocketComponent;
                return !rocket.visible;
            });

            // Filter visible and sort by latest triggerTime.
            const visibleRockets = this.alienRocketEntities.filter(entity => {
                const rocket = entity.components.get(AlienRocketComponent.name) as AlienRocketComponent;
                return rocket.visible;
            }).sort((a, b) => {
                const left = a.components.get(AlienRocketComponent.name) as AlienRocketComponent;
                const right = b.components.get(AlienRocketComponent.name) as AlienRocketComponent;
                return right.triggerTime - left.triggerTime;
            });

            // If none visible, fire first rocket.
            if (notVisibleRockets.length === this.alienRocketEntities.length) {
                const rocket = this.get_random(notVisibleRockets);
                const plRocket = rocket.components.get(AlienRocketComponent.name) as AlienRocketComponent;
                const plRocketPos = rocket.components.get(PositionComponent.name) as PositionComponent;
                if (performance.now() - plRocket.triggerTime > this.settings.aliens.fireDelay) {
                    this.setRocketVisible(plRocket, plRocketPos, alienPos, alienImg);
                }
            }
            // If visible rockets is less than the total of alien rockets, Fire next rocket with a minimum time difference
            // from latest visible rocket.
            else if (visibleRockets.length < this.alienRocketEntities.length) {
                const rocket = this.get_random(notVisibleRockets);
                const plRocketVisible = visibleRockets[0].components.get(AlienRocketComponent.name) as AlienRocketComponent;
                const plRocket = rocket.components.get(AlienRocketComponent.name) as AlienRocketComponent;
                const plRocketPos = rocket.components.get(PositionComponent.name) as PositionComponent;
                if (performance.now() - plRocketVisible.triggerTime > this.settings.aliens.fireDelay) {
                    this.setRocketVisible(plRocket, plRocketPos, alienPos, alienImg);
                }
            }
        }
    }

    private get_randomAlien() {
        const aliens = this.aliens.filter(alien => (alien.components.get(AlienImgComponent.name) as AlienImgComponent).visible)
        return this.get_random(aliens);
    }

    private get_random(list: Entity[]) {
        return list[Math.floor((Math.random()*list.length))];
    }

    private setRocketVisible(plRocket: AlienRocketComponent, plRocketPos: PositionComponent,
                             alienPos: PositionComponent, alienImg: AlienImgComponent): void {
        plRocket.visible = true;
        plRocket.triggerTime = performance.now();
        plRocketPos.dx = alienPos.dx + alienImg.dWidth / 2;
        plRocketPos.dy = alienPos.dy + alienImg.dHeight;
    }

}
