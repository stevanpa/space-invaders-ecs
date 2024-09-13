import {Entity} from "./entity";
import {EntityImpl} from "./entity-impl";
import {FinishLineComponent} from "../components/finish-line-component";
import {ExtentComponent} from "../components/extent-component";

export class FinishLineEntity {

    name = "FinishLineEntity";
    entity: Entity;

    constructor() {
        const entity = new EntityImpl();
        entity.addComponent(new FinishLineComponent());
        entity.addComponent(new ExtentComponent(0, 256 - 18, 224, 1));
        this.entity = entity;
    }

    getEntities(): Entity[] {
        const entities = new Array<Entity>();
        entities.push(this.entity);
        return entities;
    }
}
