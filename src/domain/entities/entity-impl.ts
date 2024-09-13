import {Entity} from "./entity";
import {Component} from "../components/component";

export class EntityImpl implements Entity {

    id: string;
    components: Map<string, Component>;

    constructor() {
        this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16);
        this.components = new Map();
    }

    addComponent(component: Component): void {
        this.components.set(component.name, component);
    }

    removeComponent(component: Component): void {
        this.components.delete(component.name);
    }

    print(): void {
        console.log(JSON.stringify(this, null, 4));
    }

}
