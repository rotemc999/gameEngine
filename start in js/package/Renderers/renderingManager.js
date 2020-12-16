export class RenderingManager {
    #canvas;
    #scene;
    #renderers = [];
    constructor(canvas, scene) {
        this.#canvas = canvas;
        this.#scene = scene;
    }

    addToRenderer(renderer) {
        //this.#renderers.push(renderer);
        for (let i = 0; i < this.#renderers.length; i++) {
            if (this.#renderers[i].layer === renderer.layer) {
                this.#renderers[i].renderers.push(renderer);
                return
            }
        }
        this.#renderers.push({
            layer: renderer.layer,
            renderers: [renderer]
        });

        this.#renderers.sort();

    }

    draw() {

    }


    #sort() {

    }
}