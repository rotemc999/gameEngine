namespace GE {
    /**
     * The WebGL canvas context.
     */
    export var gl: WebGLRenderingContext;
    export var canvas: HTMLCanvasElement;

    export class GLUtilties {
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
            gl.enable(gl.BLEND);
            //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            this.checkConstChanges();



        }

        private static checkConstChanges(): void {
            if (gl.LINEAR != Mipmap.linear) {
                console.log("linear mipmap number updated to: " + gl.LINEAR)
            }
            if (gl.NEAREST != Mipmap.nearest) {
                console.log("linear mipmap number updated to: " + gl.NEAREST)
            }
        }
    }


}