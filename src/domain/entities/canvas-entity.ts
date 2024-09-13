import {Entity} from "./entity";
import {EntityImpl} from "./entity-impl";
import {CanvasComponent} from "../components/canvas-component";

export class CanvasEntity {

    name = "CanvasEntity";
    entity: Entity;

    constructor(canvas: HTMLCanvasElement) {
        const entity = new EntityImpl();
        entity.addComponent(new CanvasComponent(canvas));
        this.entity = entity;
    }

    getEntities(): Entity[] {
        const entities = new Array<Entity>();
        entities.push(this.entity);
        return entities;
    }
}
