namespace GE {
    export class Engine {
        public run: boolean = true;
        public canvas: HTMLCanvasElement;

        private _shader: Shader;
        private _gameObjects: GameObject[] = [];
        private _projection: Matrix2x2;

        private _fpsLabel: HTMLHeadingElement = document.getElementById("fpsLabel") as HTMLHeadingElement;
        public constructor() {
        }

        public start(): void {
            GLUtilties.start();
            gl.clearColor(0, 0, 0, 1);
            this.loadTextureShaders();
            this._shader.use();

            AudioManager.start();

            Input.start();

            let scene = new Scene("scene");

            SceneManager.createScene(scene);
            SceneManager.activateScene("scene");

            let testGameObject = new GameObject("testing game object", scene);
            testGameObject.transform.position = new Vector2(10,0);
            scene.addGameObject(testGameObject);

            let spriteRenderer = new SpriteRenderer("spriteRenderer", testGameObject);
            spriteRenderer.texture = "spritesExamples/circle.png";
            testGameObject.addComponent(spriteRenderer);

            this.resize();


            SceneManager.start();

            requestAnimationFrame(this.update.bind(this));
        }

        private update() {
            SceneManager.activateScene("testScene");
            this._fpsLabel.innerHTML = "fps: " + Time.frameRate;
            gl.clear(gl.COLOR_BUFFER_BIT);

            
            this._shader.use();

            let speed: number = 5;
            let rotationSpeed: number = 210;

            

            let projectionPosition: WebGLUniformLocation = this._shader.getUniformLocation("projection");
            gl.uniformMatrix2fv(projectionPosition, false, new Float32Array(SceneManager.activeScene.camera.projection.data));

            SceneManager.update();
            SceneManager.render(this._shader);

            Input.update()
            Time.update();
            if (this.run) {
                requestAnimationFrame(this.update.bind(this));
            }
        }

        public resize() {
            if (canvas !== undefined) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                SceneManager.activeScene.camera.resize();
            }

        }
        private loadTextureShaders(): void {
            let vertex = `
            precision mediump float;

            attribute vec2 vertexPosition;
            attribute vec2 uv;
            
            varying vec2 fuv;
            
            uniform mat2 projection;
            
            uniform vec2 position;
            uniform mat2 rotation;
            uniform vec2 scale;
            
            void main(){
                fuv = uv;
                fuv.y = 1.0 - fuv.y;
                vec2 finalPosition = projection * (position + (vertexPosition  * scale * rotation));
                gl_Position = vec4(finalPosition,0, 1);
            }
            `;
            let fragment = `
            #ifdef GL_FRAGMENT_PRECISION_HIGH
                precision highp float;
            #else
                precision mediump float;
            #endif

            varying vec2 fuv;

            uniform vec4 tint;
            uniform sampler2D texture;


            void main(){
                gl_FragColor = texture2D(texture, fuv) * tint;
            }
            `;

            this._shader = new Shader("basic", vertex, fragment);
        }
    }
}