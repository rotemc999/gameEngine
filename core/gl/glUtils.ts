namespace GE {
    /**
     * The WebGL canvas context.
     */
    export var gl: WebGLRenderingContext;
    export var canvas: HTMLCanvasElement;

    export class GLUtilties {

        private static _maxTextures: number;
        /**
         * Initializing WebGL.
         */
        public static start() {
            canvas = document.getElementById("canvas") as HTMLCanvasElement;
            if (canvas === undefined) {
                throw new Error("Cannot find canvas");
            }
            gl = canvas.getContext("webgl") as WebGLRenderingContext;
            if (gl === undefined) {
                throw new Error("Unable to initialize WebGL");
            }
            this._maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)

            gl.enable(gl.BLEND);
            //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }

        public static get maxTextures(): number{
            return this._maxTextures;
        }
    }


}