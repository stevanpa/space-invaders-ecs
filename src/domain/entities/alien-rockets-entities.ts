import {Entity} from "./entity";
import {EntityImpl} from "./entity-impl";
import {PositionComponent} from "../components/position-component";
import {AlienPlungerShotComponent} from "../components/aliens/alien-plunger-shot-component";
import {AlienSquiglyShotComponent} from "../components/aliens/alien-squigly-shot-component";
import {ExtentComponent} from "../components/extent-component";

export class AlienRocketsEntities {

    name = "AlienRocketEntity";
    entities: Entity[] = [];

    constructor() {
        let entity = new EntityImpl();
        entity.addComponent(new ExtentComponent(0, 0, 1, 4));
        entity.addComponent(new PositionComponent({dx: 0, dy: 0}));
        entity.addComponent(new AlienPlungerShotComponent());
        this.entities.push(entity);

        entity = new EntityImpl();
        entity.addComponent(new ExtentComponent(0, 0, 1, 4));
        entity.addComponent(new PositionComponent({dx: 0, dy: 0}));
        entity.addComponent(new AlienSquiglyShotComponent());
        this.entities.push(entity);
    }

    getEntities(): Entity[] {
        return this.entities;
    }
}
