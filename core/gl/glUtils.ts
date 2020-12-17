namespace GE {
    /**
     * The WebGL canvas context.
     */
    export var gl: WebGLRenderingContext;
    export class GLUtilties {
        /**
         * Initializing WebGL.
         */
        public static initialize(): HTMLCanvasElement {
            let canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
            if (canvas === undefined) {
                throw new Error("Cannot find canvas");
            }
            gl = canvas.getContext("webgl") as WebGLRenderingContext;
            if (gl === undefined) {
                throw new Error("Unable to initialize WebGL");
            }

            return canvas;

        }
    }
}