export class Window {
    #canvas;
    #width;
    #height;
    constructor() {
        this.#width = document.getElementById("body").clientWidth;
        this.#height = document.getElementById("body").clientHeight;

        this.#canvas = document.createElement("canvas");
        this.#canvas.width = this.#width;
        this.#canvas.height = this.#height;


        this.#canvas.style.background = "black"
        document.getElementById("body").appendChild(this.#canvas);

        this.#canvas.getContext('2d').translate(this.#width / 2, this.#height / 2);
    }
    get width() {
        return this.#width;
    }
    get height() {
        return this.#height;
    }

    getCanvas() {
        return this.#canvas;
    }
}