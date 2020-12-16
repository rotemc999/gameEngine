import { Vector2 } from '../math/Vector2.js';

export class Transform {
    #position = new Vector2(0, 0);
    #rotation = 0;
    #scale = new Vector2(1, 1);


    constructor(position, rotation, scale) {
        // position
        if (position instanceof Vector2) {
            this.#position = position;
        }
        else {
            let objectType = position.constructor.name;
            console.error('expected Vector2 type got ' + objectType);
        }

        // rotation
        if (typeof rotation === 'number') {
            this.#rotation = rotation;
        }
        else {
            let objectType = rotation.constructor.name;
            console.error('expected number type got ' + objectType);
        }

        // scale
        if (scale instanceof Vector2) {
            this.#scale = scale;
        }
        else {
            let objectType = scale.constructor.name;
            console.error('expected Vector2 type got ' + objectType);
        }
    }



    get position() {
        return this.#position;
    }
    set position(position) {
        if (position instanceof Vector2) {
            this.#position = position;
        }
        else {
            let objectType = position.constructor.name;
            console.error('expected Vector2 type got ' + objectType);
        }
    }

    get rotation() {
        return this.#rotation;
    }
    set rotation(rotation) {
        if (typeof rotation === 'number') {
            this.#rotation = rotation;
        }
        else {
            let objectType = rotation.constructor.name;
            console.error('expected number type got ' + objectType);
        }
    }

    get scale() {
        return this.#scale;
    }
    set scale(scale) {
        if (scale instanceof Vector2) {
            this.#scale = scale;
        }
        else {
            let objectType = scale.constructor.name;
            console.error('expected Vector2 type got ' + objectType);
        }
    }

    translate(vector2) {
        if (scale instanceof Vector2) {
            this.#position.add(vector2);
        }
        else {
            let objectType = scale.constructor.name;
            console.error('expected Vector2 type got ' + objectType);
        }
    }
}