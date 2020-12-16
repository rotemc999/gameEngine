export class Component {
    #gameObject
    constructor() {

    }

    set gameObject(gameObject) {
        if (gameObject instanceof GameObject) {
            this.#gameObject = gameObject;
        }
    }

    start() {

    }

    update() {

    }
}