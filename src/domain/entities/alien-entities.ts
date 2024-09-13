import {Entity} from "./entity";
import {EntityImpl} from "./entity-impl";
import {PositionComponent} from "../components/position-component";
import {AlienOneImgComponent} from "../components/aliens/alien-one-img-component";
import {AlienTwoImgComponent} from "../components/aliens/alien-two-img-component";
import {AlienThreeImgComponent} from "../components/aliens/alien-three-img-component";
import {ExtentComponent} from "../components/extent-component";

export class AlienEntities {

    name = "AlienEntities";
    entities: Entity[] = [];

    constructor(top: number, left: number) {
        this.createAlienOne(11, top, left);
        this.createAlienTwo(11, top, left);
        this.createAlienThree(11, top, left);
    }

    getEntities(): Entity[] {
        return this.entities;
    }

    private createAlienOne(quantity: number, top: number, left: number) {
        for (let i = 0; i < quantity; i++) {
            const entity = new EntityImpl();
            entity.addComponent(new ExtentComponent(0, 0, 1, 1));
            entity.addComponent(new PositionComponent({dx: left + i * 16, dy: top}));
            entity.addComponent(new AlienOneImgComponent());
            this.entities.push(entity);
        }
        for (let i = 0; i < quantity; i++) {
            const entity = new EntityImpl();
            entity.addComponent(new ExtentComponent(0, 0, 1, 1));
            entity.addComponent(new PositionComponent({dx: left + i * 16, dy: top + 16}));
            entity.addComponent(new AlienOneImgComponent());
            this.entities.push(entity);
        }
    }

    private createAlienTwo(quantity: number, top: number, left: number) {
        for (let i = 0; i < quantity; i++) {
            let entity = new EntityImpl();
            entity.addComponent(new ExtentComponent(0, 0, 1, 1));
            entity.addComponent(new PositionComponent({dx: left + i * 16, dy: top + 32}));
            entity.addComponent(new AlienTwoImgComponent());
            this.entities.push(entity);
        }
        for (let i = 0; i < quantity; i++) {
            let entity = new EntityImpl();
            entity.addComponent(new ExtentComponent(0, 0, 1, 1));
            entity.addComponent(new PositionComponent({dx: left + i * 16, dy: top + 48}));
            entity.addComponent(new AlienTwoImgComponent());
            this.entities.push(entity);
        }
    }

    private createAlienThree(quantity: number, top: number, left: number) {
        for (let i = 0; i < quantity; i++) {
            let entity = new EntityImpl();
            entity.addComponent(new ExtentComponent(0, 0, 1, 1));
            entity.addComponent(new PositionComponent({dx: left + i * 16, dy: top + 64}));
            entity.addComponent(new AlienThreeImgComponent());
            this.entities.push(entity);
        }
        for (let i = 0; i < quantity; i++) {
            let entity = new EntityImpl();
            entity.addComponent(new ExtentComponent(0, 0, 1, 1));
            entity.addComponent(new PositionComponent({dx: left + i * 16, dy: top + 80}));
            entity.addComponent(new AlienThreeImgComponent());
            this.entities.push(entity);
        }
    }
}
