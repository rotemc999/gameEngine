import { Transform } from "./gameObject/transform.js";
import { Vector2 } from "./math/Vector2.js";

export class Camera {
    #transform;
    constructor() {
        this.#transform = new Transform(new Vector2(0, 0, 0), 0, new Vector2(0, 0, 0));
    }

    get transform() {
        return this.#transform;
    }
}