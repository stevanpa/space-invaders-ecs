import {Entity} from "./entity";
import {EntityImpl} from "./entity-impl";
import {PositionComponent} from "../components/position-component";
import {PlayerRocketComponent} from "../components/player/player-rocket-component";
import {ExtentComponent} from "../components/extent-component";

export class PlayerRocketEntities {

    name = "PlayerRocketEntities";
    entities: Entity[] = [];

    constructor() {
        for (let i = 0; i < 3; i++) {
            const entity = new EntityImpl();
            entity.addComponent(new ExtentComponent(0, 0, 1, 4));
            entity.addComponent(new PositionComponent({dx: 0, dy: 0}));
            entity.addComponent(new PlayerRocketComponent());
            this.entities.push(entity);
        }
    }

    getEntities(): Entity[] {
        return this.entities;
    }
}
