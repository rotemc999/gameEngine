import { Vector2 } from "./Vector3.js";

export class Transform {
    #position;
    #rotation;
    #scale;
    constructor(position, rotation, scale) {
        if (position instanceof Vector2) {
            this.#position = position;
        }
        if (rotation instanceof Vector2) {
            this.#rotation = rotation;
        }
        if (scale instanceof Vector2) {
            this.#scale = scale;
        }
    }

    get position() {
        return this.#position;
    }
    set position(position) {
        if (position instanceof Vector2) {
            this.#position = position;
        }
    }

    get rotation() {
        return this.#rotation;
    }
    set rotation(rotation) {
        if (rotation instanceof Vector2) {
            this.#rotation = rotation;
        }
    }

    get scale() {
        return this.#scale;
    }
    set scale(scale) {
        if (scale instanceof Vector2) {
            this.#scale = scale;
        }
    }
}