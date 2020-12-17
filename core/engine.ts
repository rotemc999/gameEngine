namespace GE {
    export class Engine {
        public run: boolean = true;
        public canvas: HTMLCanvasElement;

        private _shader: Shader;
        private _buffer: GLBuffer;
        public constructor() {

        }

        public start(): void {
            this.canvas = GLUtilties.initialize() as HTMLCanvasElement;
            gl.clearColor(0, 0, 0, 1);


            this.loadShaders();
            this._shader.use();

            this.createBuffer();

            this.resize();
            this.update();
        }

        private update() {
            gl.clear(gl.COLOR_BUFFER_BIT);
            this._buffer.bind();
            this._buffer.draw();

            GE.Time.update();
            if (this.run) {
                requestAnimationFrame(this.update.bind(this));
            }
        }

        public resize() {
            if (this.canvas !== undefined) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                gl.viewport(0, 0, window.innerWidth, window.innerHeight);
            }

        }

        private createBuffer(): void {
            let vertecies: number[] = [
                -0.5, -0.5, 0,
                0.5, -0.5, 0,
                -0.5, 0.5, 0,

                0.5, -0.5, 0,
                0.5, 0.5, 0,
                -0.5, 0.5, 0
            ];
            this._buffer = new GLBuffer(3);

            let positionAttribute: AttributeInfo = new AttributeInfo();
            positionAttribute.location = this._shader.getAttributeLocation("position");
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            positionAttribute.stride = 0;
            this._buffer.addAttribute(positionAttribute);

            let colorUniformLocation: WebGLUniformLocation = this._shader.getUniformLocation("color");
            gl.uniform4f(colorUniformLocation, 0, 1, 0, 1);

            this._buffer.pushData(vertecies);
            this._buffer.upload();

            this._buffer.unbind();
        }

        private loadShaders(): void {
            let vertex = `
                attribute vec3 position;

                void main(){
                    gl_Position = vec4(position, 1.0);
                }
            `;
            let fragment = `
            precision mediump float;
            uniform vec4 color;
            void main(){
                gl_FragColor = color;
            }
            `;

            this._shader = new Shader("basic", vertex, fragment);
        }
    }
}