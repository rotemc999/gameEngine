import { Transform } from './transform.js';
import { Vector2 } from '../math/Vector2.js';

export class GameObject {
    #name;
    #Transform = new Transform(new Vector2(0, 0, 0), 0, new Vector2(1, 1, 1));
    #Tag;
    #enabled = true;
    #components = [];
    #scripts = [];
    #childs = [];
    constructor(name) {
        if (typeof name === 'string') {
            this.#name = name;
        }
        else {
            throw new Error("the name given is not a string type");
        }
    }

    start() {
        for (let i = 0; i < this.#components.length; i++) {
            this.#components[i].start();
        }
    }

    update() {
        for (let i = 0; i < this.#components.length; i++) {
            this.#components[i].update();
        }
    }

    set name(newName) {
        if (typeof name === 'string') {
            this.#name = name;
        }
        else {
            throw new Error("the name given is not a string type");
        }
    }
    get name() {
        return this.#name;
    }

    get transform() {
        return this.#Transform;
    }

    set tag(newTag) {
        if (typeof name === 'string') {
            this.#Tag = newTag;
        }
        else {
            throw new Error("the tag given is not a string type");
        }
    }
    get tag() {
        return this.#Tag;
    }

    set enabled(status) {
        if (status === true || status === false) {
            this.#enabled = status;
        }
        else {
            throw new Error("the enabled status given is not a boolian type");
        }
    }
    get enabled() {
        return this.#enabled;
    }

    getComponent(Component) {
        for (let i = 0; i < this.#components.length; i++) {
            if (this.#components[i] instanceof Component) {
                return this.#components[i];
            }
        }
    }

    addComponent(component) {
        if (component.prototype instanceof Component) {
            this.#components.push(component)
        }
    }

    removeComponent(Component) {
        for (let i = 0; i < this.#components.length; i++) {
            if (this.#components[i] instanceof Component) {
                this.#components.splice(i, 1)
            }
        }

    }
}