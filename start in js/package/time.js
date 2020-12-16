export class Time {
    #delta;
    #fps = 0;
    #frames = 0;
    #nextSecond = 1000;
    #lastTime = 0

    constructor() {
    }

    get time() {
        // convert the time to seconds
        return window.performance.now() / 1000;
    }
    get delta() {
        // convert the time to seconds
        return this.#delta / 1000;
    }
    get frameRate() {
        return this.#fps;
    }


    update() {
        this.#frames++;
        if (window.performance.now() >= this.#nextSecond) {
            this.#nextSecond = window.performance.now() + 1000;
            this.#fps = this.#frames;
            this.#frames = 0;
        }
        this.#delta = window.performance.now() - this.#lastTime;
        this.#lastTime = window.performance.now();
    }
}