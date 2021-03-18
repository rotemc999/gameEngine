namespace GE {
    export class Engine {
        public run: boolean = true;
        public canvas: HTMLCanvasElement;

        private _shader: Shader;

        private _unloadedAssestsNum: number = 0;
        private _gameObjects: GameObject[] = [];
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
                if(configData.renderer.mipmap === "nearest"){
                    Renderer.mipmap = Mipmap.nearest;
                }
                else if(configData.renderer.mipmap === "linear"){
                    Renderer.mipmap = Mipmap.linear;
                }
                else if(configData.renderer.mipmap === "auto"){
                    Renderer.mipmap = Mipmap.auto;
                }
                else{
                    throw new Error("unknown mipmap type '"+ configData.renderer.mipmap +"'");
                }
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
                // load layers
                for(let i = 0; i < configData.renderer.layers.length; i++){
                    Renderer.addLayer(configData.renderer.layers[i], i);
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
            
            this.loadTextureShaders();
            //this._shader.use();

            Renderer.start(this._shader);

            AssetManager.start();

            AudioManager.start();

            Input.start();

            let scene = SceneManager.loadSceneJson(AssetManager.getAssetData("__config__").firstScene);
            SceneManager.activateScene(scene.name);
            this.resize();
           /*
            for(let i = 0; i < 10000; i++){
                let gameObject = new GameObject("go", scene);
                gameObject.transform.position.x = i;
                let spriteRenderer = new SpriteRenderer("sr", gameObject);
                spriteRenderer.sprite = "assets/dirt.json";
                gameObject.addComponent(spriteRenderer);
                scene.addGameObject(gameObject);
            }
            */
            SceneManager.start();
            
            
            
            requestAnimationFrame(this.update.bind(this));
        }

        private update() {
            this._fpsLabel.innerHTML = "fps: " + Time.frameRate;
            let quadLabel = document.querySelector(".quadsLabel") as HTMLHeadingElement;
            quadLabel.innerHTML = "quads: " + Renderer.quads;

            let go = SceneManager.activeScene.find("controled") as GameObject;
            let component: SpriteRenderer = go.getComponent("SpriteRenderer") as SpriteRenderer;
            component.color = Color.yellow();
            go.transform.rotation +=degRad(1);
            //go.transform.scale.add(new Vector2(1 * Time.deltaTime, 1 * Time.deltaTime));

            SceneManager.update();
            Renderer.render();


            let camera = SceneManager.activeScene.camera;
            let movingSpeed = 5;
            let zoomSpeed = .2;
            let rotationSpeed = .5;
            if(Input.isKeyDown(keyCodes.W)){
                camera.transform.position.add(new Vector2(0,1).multiply(-movingSpeed * Time.deltaTime));          
            }
            if(Input.isKeyDown(keyCodes.S)){
                camera.transform.position.add(new Vector2(0,1).multiply(movingSpeed * Time.deltaTime));          
            }
            if(Input.isKeyDown(keyCodes.A)){
                camera.transform.position.add(new Vector2(1,0).multiply(movingSpeed * Time.deltaTime));          
            }
            if(Input.isKeyDown(keyCodes.D)){
                camera.transform.position.add(new Vector2(1,0).multiply(-movingSpeed * Time.deltaTime));          
            }

            if(Input.isKeyDown(keyCodes.RIGHT_ARROW)){
                camera.transform.rotation += -rotationSpeed * Time.deltaTime;
            }
            
            if(Input.isKeyDown(keyCodes.LEFT_ARROW)){
                camera.transform.rotation += rotationSpeed * Time.deltaTime;
            }

            if(Input.isKeyDown(keyCodes.UP_ARROW)){
                camera.distance += -zoomSpeed * Time.deltaTime;
            }
            
            if(Input.isKeyDown(keyCodes.DOWN_ARROW)){
                camera.distance += zoomSpeed * Time.deltaTime;
            }


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
            
            attribute vec2 v_uv;
            attribute float v_textureIndex;

            attribute float layer;

            attribute vec4 v_tint;
            
            attribute vec2 position;
            
            attribute vec2 scale;
            attribute float rotation;
            

            varying vec2 fuv;
            varying float textureIndex;
            varying vec4 tint;
            
            uniform mat2 projection;
            uniform vec2 cameraPosition;
            uniform float cameraRotation;

            mat2 rotationZ(float rotation){
                return mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
            }
            
            void main(){
                fuv = v_uv;
                fuv.y = 1.0 - fuv.y;
                tint = v_tint;
                textureIndex = v_textureIndex;
                gl_Position = vec4(projection * (cameraPosition + (position + (vertexPosition * scale * rotationZ(rotation))) * rotationZ(cameraRotation)), -layer, 1);
            }
            `;
            let fragment = `
            #define numTextures 8
            #ifdef GL_FRAGMENT_PRECISION_HIGH
                precision highp float;
            #else
                precision mediump float;
            #endif

            varying vec2 fuv;
            varying float textureIndex;
            varying vec4 tint;


            uniform sampler2D textures[numTextures];
            uniform int textureNumber;

                void main(){
                
                int texIndex = int(textureIndex);  
                if(texIndex == 0){
                    texIndex = textureNumber -1;
                }
                else{
                    texIndex = texIndex -1;
                }
                for (int i = 0; i< numTextures; i++) {
                    if (i == texIndex) {
                        gl_FragColor = texture2D(textures[i], fuv) * tint;
                        break;
                    } 
                } 
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