import {Component} from "../components/component";

export interface Entity {
    id: string;
    components: Map<string, Component>;

    addComponent(component: Component): void;
    removeComponent(component: Component): void;
    print(): void;
}
