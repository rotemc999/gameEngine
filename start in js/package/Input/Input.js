import { contains, indexof } from '../Array.js'
import { Vector2 } from '../math/Vector2.js';



export class Input {
    #currentKeysDown = [];
    #currentKeysUp = [];

    #keysPressedUpdated = [];
    #keysReleasedUpdated = [];

    #keysPressed = [];
    #keysReleased = [];


    #mousePostion = new Vector2(0, 0);

    #lastScroll = 0;
    #scrollUpdated = false;
    #mouseWheel = 0;
    #scrollWeight = 0;

    #currentMouseButtonsDown = [];
    #currentMouseButtonsUp = [];

    #mouseButtonsPressedUpdated = [];
    #mouseButtonsReleasedUpdated = [];

    #mouseButtonsPressed = [];
    #mouseButtonsReleased = [];


    constructor(update) {

        window.addEventListener('keydown', (e) => {
            if (!contains(this.#currentKeysDown, [e.keyCode, e.location])) {
                this.#currentKeysDown.push([e.keyCode, e.location]);
            }
            if (contains(this.#currentKeysUp, [e.keyCode, e.location])) {
                this.#currentKeysUp.splice(indexof(this.#currentKeysUp, [e.keyCode, e.location]), 1);
            }
            if (contains(this.#keysReleasedUpdated, [e.keyCode, e.location])) {
                this.#keysReleasedUpdated.splice(indexof(this.#keysReleasedUpdated, [e.keyCode, e.location]), 1);
            }
        });
        window.addEventListener('keyup', (e) => {
            //if (!contains(this.#currentKeysUp, [e.keyCode, e.location])) {
            //    this.#currentKeysUp.push([e.keyCode, e.location]);
            //}
            this.#currentKeysUp.push([e.keyCode, e.location]);
            if (contains(this.#currentKeysDown, [e.keyCode, e.location])) {
                this.#currentKeysDown.splice(indexof(this.#currentKeysDown, [e.keyCode, e.location]), 1);
            }

            if (contains(this.#keysPressedUpdated, [e.keyCode, e.location])) {
                this.#keysPressedUpdated.splice(indexof(this.#keysPressedUpdated, [e.keyCode, e.location]), 1);
            }
        });


        window.addEventListener("wheel", (e) => {
            this.#mousePostion = new Vector2(e.x, e.y);
            this.#scrollUpdated = false;
            this.#scrollWeight = e.deltaY > 0 ? e.deltaY : -e.deltaY;
            this.#lastScroll = e.deltaY > 0 ? 1 : -1;
        });
        window.addEventListener("mousemove", (e) => {
            this.#mousePostion = new Vector2(e.x, e.y);
        });
        window.addEventListener("mousedown", (e) => {
            this.#mousePostion = new Vector2(e.x, e.y);
            this.#currentMouseButtonsDown.push(e.button);

            if (contains(this.#currentMouseButtonsUp, e.button)) {
                this.#currentMouseButtonsUp.splice(indexof(this.#currentMouseButtonsUp, e.button), 1);
            }
            if (contains(this.#mouseButtonsReleasedUpdated, e.button)) {
                this.#mouseButtonsReleasedUpdated.splice(indexof(this.#mouseButtonsReleasedUpdated, e.button), 1);
            }
        });
        window.addEventListener("mouseup", (e) => {
            this.#mousePostion = new Vector2(e.x, e.y);

            this.#currentMouseButtonsUp.push(e.button);

            if (contains(this.#currentMouseButtonsDown, e.button)) {
                this.#currentMouseButtonsDown.splice(indexof(this.#currentMouseButtonsDown, e.button), 1);
            }
            if (contains(this.#mouseButtonsPressedUpdated, e.button)) {
                this.#mouseButtonsPressedUpdated.splice(indexof(this.#mouseButtonsPressedUpdated, e.button), 1);
            }
        });
    }
    update() {
        this.#keysPressed = [];
        this.#keysReleased = [];

        for (let i = 0; i < this.#currentKeysDown.length; i++) {
            if (!contains(this.#keysPressedUpdated, this.#currentKeysDown[i])) {
                this.#keysPressed.push(this.#currentKeysDown[i]);
                this.#keysPressedUpdated.push(this.#currentKeysDown[i]);
            }
        }

        for (let i = 0; i < this.#currentKeysUp.length; i++) {
            if (!contains(this.#keysReleasedUpdated, this.#currentKeysUp[i])) {
                this.#keysReleased.push(this.#currentKeysUp[i]);
                this.#keysReleasedUpdated.push(this.#currentKeysUp[i]);
            }
        }

        this.#mouseButtonsPressed = [];
        this.#mouseButtonsReleased = [];

        for (let i = 0; i < this.#currentMouseButtonsDown.length; i++) {
            if (!contains(this.#mouseButtonsPressedUpdated, this.#currentMouseButtonsDown[i])) {
                this.#mouseButtonsPressed.push(this.#currentMouseButtonsDown[i]);
                this.#mouseButtonsPressedUpdated.push(this.#currentMouseButtonsDown[i]);
            }
        }

        for (let i = 0; i < this.#currentMouseButtonsUp.length; i++) {
            if (!contains(this.#mouseButtonsReleasedUpdated, this.#currentMouseButtonsUp[i])) {
                this.#mouseButtonsReleased.push(this.#currentMouseButtonsUp[i]);
                this.#mouseButtonsReleasedUpdated.push(this.#currentMouseButtonsUp[i]);
            }
        }

        this.#mouseWheel = 0;
        if (!this.#scrollUpdated) {
            this.#mouseWheel = this.#lastScroll;
            this.#scrollUpdated = true;
        }
    }

    isKeyDown(keyCode) {
        return contains(this.#currentKeysDown, keyCode);
    }

    isKeyPressed(keyCode) {
        return contains(this.#keysPressed, keyCode);
    }
    isKeyReleased(keyCode) {
        return contains(this.#keysReleased, keyCode);
    }


    isMouseButtonDown(button) {
        return contains(this.#currentMouseButtonsDown, button)
    }
    isMouseButtonPressed(button) {
        return contains(this.#mouseButtonsPressed, button)
    }
    isMouseButtonReleased(button) {
        return contains(this.#mouseButtonsReleased, button)
    }
    get scrollWeight() {
        return this.#scrollWeight;
    }
    scroll() {
        return this.#mouseWheel;
    }
    mousePosition() {
        return this.#mousePostion;
    }
    mousePositionInScene() {

    }
}

