import {Entity} from "./entity";
import {EntityImpl} from "./entity-impl";
import {ShieldComponent} from "../components/shield-component";
import {PositionComponent} from "../components/position-component";
import {ExtentComponent} from "../components/extent-component";

export class ShieldEntity {

    name = "AlienSaucerEntity";
    entities: Entity[] = [];

    constructor() {
        this.createShields();
    }

    getEntities(): Entity[] {
        return this.entities;
    }

    private createShields() {
        let entity = new EntityImpl();
        entity.addComponent(new ExtentComponent(32, 200, 22, 16));
        entity.addComponent(new ShieldComponent());
        entity.addComponent(new PositionComponent({dx: 32, dy: 200}))
        this.entities.push(entity);

        entity = new EntityImpl();
        entity.addComponent(new ExtentComponent(77, 200, 22, 16));
        entity.addComponent(new ShieldComponent());
        entity.addComponent(new PositionComponent({dx: 77, dy: 200}))
        this.entities.push(entity);

        entity = new EntityImpl();
        entity.addComponent(new ExtentComponent(122, 200, 22, 16));
        entity.addComponent(new ShieldComponent());
        entity.addComponent(new PositionComponent({dx: 122, dy: 200}))
        this.entities.push(entity);

        entity = new EntityImpl();
        entity.addComponent(new ExtentComponent(172, 200, 22, 16));
        entity.addComponent(new ShieldComponent());
        entity.addComponent(new PositionComponent({dx: 172, dy: 200}))
        this.entities.push(entity);
    }
}
