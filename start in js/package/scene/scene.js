import { GameObject } from '../gameObject/gameObject.js';

export class Scene {
    #gameObjects = [];
    #settings = {};
    #window;

    #isRunning = false;
    constructor(window) {
        this.#window = window;
    }

    addGameObject(gameObject) {
        if (gameObject instanceof GameObject) {
            if (!this.#isRunning) {
                this.#gameObjects.push(gameObject);
            }
            else {
                this.#gameObjects.push(gameObject);
                gameObject.start();
            }

        }
    }

    find(name) {
        for (let i = 0; i < this.#gameObjects.length; i++) {
            if (this.#gameObjects[i].name === name) {
                return this.#gameObjects[i];
            }
        }
    }

    start() {
        for (let i = 0; i < this.#gameObjects.length; i++) {
            this.#gameObjects[i].start();
        }

        this.#isRunning = true;
    }

    update() {
        for (let i = 0; i < this.#gameObjects.length; i++) {
            this.#gameObjects[i].update();
        }
    }

    background(imgPath) {

    }
}




