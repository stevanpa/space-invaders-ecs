import {EntityImpl} from "./entity-impl";
import {Entity} from "./entity";
import {PositionComponent} from "../components/position-component";
import {PlayerComponent} from "../components/player/player-component";
import {ExtentComponent} from "../components/extent-component";

export class PlayerEntity {

    name = "PlayerEntity";
    entity: Entity;

    constructor() {
        const entity = new EntityImpl();
        entity.addComponent(new PositionComponent({dx: 105, dy: 230}));
        entity.addComponent(new PlayerComponent());
        entity.addComponent(new ExtentComponent(105, 230 - 7, 13, 7));
        this.entity = entity;
    }

    getEntities(): Entity[] {
        const entities = new Array<Entity>();
        entities.push(this.entity);
        return entities;
    }
}
