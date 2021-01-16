namespace GE {
    export class Engine {
        public run: boolean = true;
        public canvas: HTMLCanvasElement;

        private _shader: Shader;
        private _sprite: Sprite;
        private _gameObjects: GameObject[] = [];
        private _projection: Matrix2;

        private _fpsLabel: HTMLHeadingElement = document.getElementById("fpsLabel") as HTMLHeadingElement;
        public constructor() {

        }

        public start(): void {
            this.canvas = GLUtilties.initialize() as HTMLCanvasElement;
            gl.clearColor(0, 0, 0, 1);

            ShaderManager.loadShader("core/shaders/Texture/vertex.glsl", "core/shaders/Texture/fragment.glsl", "basic2");

            //this._sprite = new Sprite("spritesExamples/rectangle.png", "minecraftSprite", 2, 1);
            //this._sprite.load();
            let testScene: Scene = new Scene("testScene");

            let gridSize: number = 50;
            let offset: number = -10;
            let scale: number = 1;

            for (let x = offset; x < gridSize; x++) {
                for (let y = offset; y < gridSize; y++) {
                    let object: GameObject = new GameObject("testGameObject");
                    this._gameObjects.push(object);
                    object.transform.position = new Vector2(x, y);
                    object.transform.scale = new Vector2(scale, scale);

                    let spriteRenderer: SpriteRenderer = new SpriteRenderer("test sprite", object);
                    spriteRenderer.color = new Color(Random.randint(0, 255), Random.randint(0, 255), Random.randint(0, 255), 255);

                    spriteRenderer.texture = "image.jpg";
                    object.addComponent(spriteRenderer);

                    testScene.addGameObject(object);
                }
            }


            let object: GameObject = new GameObject("testGameObject");
            this._gameObjects.push(object);
            object.transform.position = new Vector2(0, 0);
            object.transform.scale = new Vector2(scale, scale);

            let spriteRenderer: SpriteRenderer = new SpriteRenderer("test sprite", object);
            spriteRenderer.color = new Color(Random.randint(0, 255), Random.randint(0, 255), Random.randint(0, 255), 255);

            spriteRenderer.texture = "spritesExamples/rectangle.png";
            object.addComponent(spriteRenderer);

            testScene.addGameObject(object);

            SceneManager.createScene(testScene);
            SceneManager.loadScene("testScene");
            SceneManager.start();

            this.resize();

            this.loadTextureShaders();
            this._shader.use();

            Input.start();


            requestAnimationFrame(this.update.bind(this));
        }

        private update() {
            this._fpsLabel.innerHTML = "fps: " + Time.frameRate;
            gl.clear(gl.COLOR_BUFFER_BIT);

            //this._shader = ShaderManager.getShader("basic2");
            this._shader.use();


            /*for (let i = 0; i < this._gameObjects.length; i++) {
                this._gameObjects[i].transform.rotation += degRad(-180 * Time.deltaTime);
            }*/
            let speed: number = 5;
            let rotationSpeed: number = 210;

            let projectionPosition: WebGLUniformLocation = this._shader.getUniformLocation("projection");
            gl.uniformMatrix2fv(projectionPosition, false, new Float32Array(this._projection.data));



            if (Input.isKeyDown([87, 0])) {
                console.log("frame");
                this._gameObjects[0].transform.position.add(Vector2.up.multiply(speed * Time.deltaTime));
            }
            if (Input.isKeyDown([83, 0])) {
                this._gameObjects[0].transform.position.add(Vector2.down.multiply(speed * Time.deltaTime));
            }
            if (Input.isKeyDown([65, 0])) {
                this._gameObjects[0].transform.position.add(Vector2.left.multiply(speed * Time.deltaTime));
                this._gameObjects[0].transform.rotation += degRad(rotationSpeed * Time.deltaTime);
            }
            if (Input.isKeyDown([68, 0])) {
                this._gameObjects[0].transform.position.add(Vector2.right.multiply(speed * Time.deltaTime));
                this._gameObjects[0].transform.rotation += degRad(-rotationSpeed * Time.deltaTime);
            }

            SceneManager.update();
            SceneManager.render(this._shader);

            Input.update()
            Time.update();
            if (this.run) {
                requestAnimationFrame(this.update.bind(this));
            }

        }

        public resize() {
            if (this.canvas !== undefined) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;

                this._projection = Matrix2.projection(0, this.canvas.width, 0, this.canvas.height);
                gl.viewport(0, 0, this.canvas.width, this.canvas.height);
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