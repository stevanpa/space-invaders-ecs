import {Entity} from "./entity";
import {EntityImpl} from "./entity-impl";
import {ExtentComponent} from "../components/extent-component";
import {CeilingLineComponent} from "../components/ceiling-line-component";

export class CeilingLineEntity {

    name = "CeilingLineEntity";
    entity: Entity;

    constructor() {
        const entity = new EntityImpl();
        entity.addComponent(new CeilingLineComponent());
        entity.addComponent(new ExtentComponent(0, 23, 224, 1));
        this.entity = entity;
    }

    getEntities(): Entity[] {
        const entities = new Array<Entity>();
        entities.push(this.entity);
        return entities;
    }
}
