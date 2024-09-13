import {Entity} from "./entity";
import {EntityImpl} from "./entity-impl";
import {PositionComponent} from "../components/position-component";
import {AlienSaucerImgComponent} from "../components/aliens/alien-saucer-img-component";
import {ExtentComponent} from "../components/extent-component";

export class AlienSaucerEntity {

    name = "AlienSaucerEntity";
    entities: Entity[] = [];

    constructor(top: number, left: number) {
        const entity = new EntityImpl();
        entity.addComponent(new ExtentComponent(0, 0, 12, 6));
        entity.addComponent(new PositionComponent({dx: left, dy: top}));
        entity.addComponent(new AlienSaucerImgComponent());
        this.entities.push(entity);
    }

    getEntities(): Entity[] {
        return this.entities;
    }
}
