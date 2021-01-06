namespace GE {
    export class Engine {
        public run: boolean = true;
        public canvas: HTMLCanvasElement;

        private _shader: Shader;
        private _sprite: Sprite;
        private _projection: Matrix4;
        public constructor() {

        }

        public start(): void {
            this.canvas = GLUtilties.initialize() as HTMLCanvasElement;
            gl.clearColor(0, 0, 0, 1);

            this._sprite = new Sprite("../../image.jpg", "minecraftSprite", 2, 1);
            this._sprite.load();
            this.resize();

            this.loadTextureShaders();
            this._shader.use();


            this.update();
        }

        private update() {
            gl.clear(gl.COLOR_BUFFER_BIT);



            let projectionPosition: WebGLUniformLocation = this._shader.getUniformLocation("projection");
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

            let transformationsPosition: WebGLUniformLocation = this._shader.getUniformLocation("transformation");
            gl.uniformMatrix4fv(transformationsPosition, false, new Float32Array(Matrix4.transformations(new Vector2(1, -4)).data));

            let objectPositionPosition: WebGLUniformLocation = this._shader.getUniformLocation("objectPosition");
            gl.uniform2f(objectPositionPosition, 4, 3);

            gl.uniform1i(this._shader.getUniformLocation("texture"), 0)

            this._sprite.draw();
            GE.Time.update();
            if (this.run) {
                requestAnimationFrame(this.update.bind(this));
            }
        }

        public resize() {
            if (this.canvas !== undefined) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;

                this._projection = Matrix4.projection(0, this.canvas.width, 0, this.canvas.height);
                gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }

        }

        private loadDefultShaders(): void {
            let vertex = `
                attribute vec3 position;

                uniform mat4 projection;
                uniform mat4 transformation;
                

                void main(){
                    gl_Position =  projection * transformation * vec4(position, 1.0);
                    //gl_Position = vec4(position, 1.0);
                }
            `;
            let fragment = `
            precision mediump float;
            void main(){
                gl_FragColor = vec4(0.0,1.0,1.0,1.0);
            }
            `;

            this._shader = new Shader("basic", vertex, fragment);
        }

        private loadTextureShaders(): void {
            let vertex = `
                precision mediump float;

                attribute vec2 position;
                attribute vec2 uv;
                
                varying vec2 fuv;
                
                uniform mat4 projection;
                uniform mat4 transformation;

                uniform vec2 objectPosition;
                
                void main(){
                    fuv = uv;
                    fuv.y = 1.0 - fuv.y;
                    transformation;
                    objectPosition;
                    gl_Position = projection * transformation * vec4(position,1, 1);
                }
            `;
            let fragment = `
            #ifdef GL_FRAGMENT_PRECISION_HIGH
                precision highp float;
            #else
                precision mediump float;
            #endif

                varying vec2 fuv;
                uniform sampler2D texture;


                void main(){
                    gl_FragColor = texture2D(texture, fuv); 
                }
            `;

            this._shader = new Shader("basic", vertex, fragment);
        }
    }
}