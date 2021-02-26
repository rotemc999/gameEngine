namespace GE {
    export class Engine {
        public run: boolean = true;
        public canvas: HTMLCanvasElement;

        private _shader: Shader;

        private _unloadedAssestsNum: number = 0;

        private _fpsLabel: HTMLHeadingElement = document.getElementById("fpsLabel") as HTMLHeadingElement;
        public constructor() {
        }

        public load(): void{
            // load the images and the spritesheet files
            let configFile: FileReader = new FileReader("config.json", "configFile");
            configFile.onload = (configFile: FileReader)=>{
                let configData = Json.load(configFile.data);

                AssetManager.putAssetData("__config__", configData);

                //loading the first scene data
                let firstSceneFile: FileReader = new FileReader(configData.firstScene, "firstSceneFile");
                this._unloadedAssestsNum++;
                firstSceneFile.onload = (firstSceneFile: FileReader)=>{
                    let firstSceneData = Json.load(firstSceneFile.data);
                    AssetManager.putAssetData(configData.firstScene, firstSceneData);
                    
                    this._unloadedAssestsNum--;
                };

                //loading renderer data
                //Renderer.mipmap = Mipmap[configData.renderer.mipmap] as Mipmap;
                //loading renderer sprite sheets data
                for(let spritePath in configData.renderer.sprites){
                    let spriteFile: FileReader = new FileReader(configData.renderer.sprites[spritePath],configData.renderer.sprites[spritePath]);
                    this._unloadedAssestsNum++;
                    spriteFile.onload = (spriteFile: FileReader)=>{
                        let spriteData = Json.load(spriteFile.data);    
                        let spriteImage = new Image();
                        spriteImage.src = spriteData.texture;
                        spriteImage.onload = ()=>{
                            AssetManager.putAssetData(spriteData.texture , spriteImage);
                            this.isFinishLoading();
                            this._unloadedAssestsNum--;
                        };
                        AssetManager.putAssetData(spriteFile.name , spriteData);
                    };
                }

                //loading audio data
                AudioManager.volume = configData.audio.volume;
                // loading audio file data
                for(let audioPath in configData.audio.audio){
                    let audio = new Audio(audioPath);
                    this._unloadedAssestsNum++;
                    audio.onload = (e)=>{
                        AssetManager.putAssetData(audio.src, audio);
                        this.isFinishLoading();
                        this._unloadedAssestsNum--;
                    };
                }

            };
        }

        private start(): void{
            console.log("start");
            GLUtilties.start();
            gl.clearColor(0, 0, 0, 1);
            this.loadTextureShaders();
            this._shader.use();

            Renderer.start();

            AssetManager.start();

            AudioManager.start();

            Input.start();

            let scene = SceneManager.loadSceneJson(AssetManager.getAssetData("__config__").firstScene);
            SceneManager.activateScene(scene.name);

            /*
            let scene = new Scene("scene");

            SceneManager.createScene(scene);
            SceneManager.activateScene("scene");

            let testGameObject = new GameObject("testing game object", scene);
            testGameObject.transform.position = new Vector2(10,0);
            scene.addGameObject(testGameObject);

            let spriteRenderer = new SSpriteRenderer("spriteRenderer", testGameObject);
            spriteRenderer.texture = "spritesExamples/circle.png";
            testGameObject.addComponent(spriteRenderer);
            */
            this.resize();

            SceneManager.start();

            requestAnimationFrame(this.update.bind(this));

            Renderer.render();
        }

        private update() {
            SceneManager.activateScene("testScene");
            this._fpsLabel.innerHTML = "fps: " + Time.frameRate;
            gl.clear(gl.COLOR_BUFFER_BIT);

            this._shader.use();

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

        private isFinishLoading(): void{
            if(this._unloadedAssestsNum <= 1){
                this.start();
            }
        }
    }
}