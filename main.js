"use strict";
var GE;
(function (GE) {
    class Engine {
        constructor() {
            this.run = true;
            this._unloadedAssestsNum = 0;
            this._fpsLabel = document.getElementById("fpsLabel");
        }
        load() {
            // load the images and the spritesheet files
            let configFile = new GE.FileReader("config.json", "configFile");
            configFile.onload = (configFile) => {
                let configData = GE.Json.load(configFile.data);
                GE.AssetManager.putAssetData("__config__", configData);
                //loading the first scene data
                let firstSceneFile = new GE.FileReader(configData.firstScene, "firstSceneFile");
                this._unloadedAssestsNum++;
                firstSceneFile.onload = (firstSceneFile) => {
                    let firstSceneData = GE.Json.load(firstSceneFile.data);
                    GE.AssetManager.putAssetData(configData.firstScene, firstSceneData);
                    this._unloadedAssestsNum--;
                };
                //loading renderer data
                //Renderer.mipmap = Mipmap[configData.renderer.mipmap] as Mipmap;
                //loading renderer sprite sheets data
                for (let spritePath in configData.renderer.sprites) {
                    let spriteFile = new GE.FileReader(configData.renderer.sprites[spritePath], configData.renderer.sprites[spritePath]);
                    this._unloadedAssestsNum++;
                    spriteFile.onload = (spriteFile) => {
                        let spriteData = GE.Json.load(spriteFile.data);
                        let spriteImage = new Image();
                        spriteImage.src = spriteData.texture;
                        spriteImage.onload = () => {
                            GE.AssetManager.putAssetData(spriteData.texture, spriteImage);
                            this.isFinishLoading();
                            this._unloadedAssestsNum--;
                        };
                        GE.AssetManager.putAssetData(spriteFile.name, spriteData);
                    };
                }
                //loading audio data
                GE.AudioManager.volume = configData.audio.volume;
                // loading audio file data
                for (let audioPath in configData.audio.audio) {
                    let audio = new Audio(audioPath);
                    this._unloadedAssestsNum++;
                    audio.onload = (e) => {
                        GE.AssetManager.putAssetData(audio.src, audio);
                        this.isFinishLoading();
                        this._unloadedAssestsNum--;
                    };
                }
            };
        }
        start() {
            console.log("start");
            GE.GLUtilties.start();
            GE.gl.clearColor(0, 0, 0, 1);
            this.loadTextureShaders();
            this._shader.use();
            GE.Renderer.start();
            GE.AssetManager.start();
            GE.AudioManager.start();
            GE.Input.start();
            let scene = GE.SceneManager.loadSceneJson(GE.AssetManager.getAssetData("__config__").firstScene);
            GE.SceneManager.activateScene(scene.name);
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
            GE.SceneManager.start();
            requestAnimationFrame(this.update.bind(this));
            GE.Renderer.render();
        }
        update() {
            GE.SceneManager.activateScene("testScene");
            this._fpsLabel.innerHTML = "fps: " + GE.Time.frameRate;
            GE.gl.clear(GE.gl.COLOR_BUFFER_BIT);
            this._shader.use();
            let projectionPosition = this._shader.getUniformLocation("projection");
            GE.gl.uniformMatrix2fv(projectionPosition, false, new Float32Array(GE.SceneManager.activeScene.camera.projection.data));
            GE.SceneManager.update();
            GE.SceneManager.render(this._shader);
            GE.Input.update();
            GE.Time.update();
            if (this.run) {
                requestAnimationFrame(this.update.bind(this));
            }
        }
        resize() {
            if (GE.canvas !== undefined) {
                GE.canvas.width = window.innerWidth;
                GE.canvas.height = window.innerHeight;
                GE.SceneManager.activeScene.camera.resize();
            }
        }
        loadTextureShaders() {
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
            this._shader = new GE.Shader("basic", vertex, fragment);
        }
        isFinishLoading() {
            if (this._unloadedAssestsNum <= 1) {
                this.start();
            }
        }
    }
    GE.Engine = Engine;
})(GE || (GE = {}));
/// <reference path="core/engine.ts"/>
var engine;
window.onload = () => {
    engine = new GE.Engine();
    engine.load();
    //engine.start();
};
window.onresize = () => {
    engine.resize();
};
var GE;
(function (GE) {
    class AudioManager {
        constructor() { }
        static start() {
            this._audioContext = new AudioContext();
            window.addEventListener("focus", (e) => {
                this._focusMute = false;
            });
            window.addEventListener("unfocus", (e) => {
                this._focusMute = true;
            });
        }
        static get volume() {
            if (this._focusMute) {
                return 0;
            }
            return this._volume;
        }
        static set volume(volume) {
            this._volume = volume;
        }
        static get audioContext() {
            return this._audioContext;
        }
    }
    AudioManager._volume = 100;
    AudioManager.muteOnLostFocus = true;
    AudioManager._focusMute = false;
    GE.AudioManager = AudioManager;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class httpRequest {
        constructor(path) {
            this._onload = () => { };
            this._isloaded = false;
            this._request = new XMLHttpRequest;
            this._request.open("GET", path);
            this._request.timeout = 4000;
            this._request.send();
            this._request.addEventListener("load", (e) => {
                console.log("hallo");
                this._isloaded = true;
                this._onload();
            });
        }
        loadLoop() {
            if (!this._isloaded) {
                requestAnimationFrame(this.loadLoop.bind(this));
            }
        }
    }
    GE.httpRequest = httpRequest;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Time {
        constructor() { }
        /**
         * update the time class every frame
         */
        static update() {
            this._frames++;
            if (window.performance.now() >= this._nextSecond) {
                this._nextSecond = window.performance.now() + 1000;
                this._frameRate = this._frames;
                this._frames = 0;
            }
            this._deltaTime = window.performance.now() - this._lastTime;
            this._lastTime = window.performance.now();
        }
        /**
         * return the time in seconds passed from the start of the window
         */
        static get currentTime() {
            // convert the time to seconds
            return window.performance.now() / 1000;
        }
        /**
         * return the time passed between the last two frame
         */
        static get deltaTime() {
            // convert the time to seconds
            return this._deltaTime / 1000;
        }
        /**
         * return the frame rate of the page the frame per seconds
         */
        static get frameRate() {
            return this._frameRate;
        }
    }
    Time._deltaTime = 0;
    Time._frameRate = 0;
    Time._frames = 0;
    Time._nextSecond = 1000;
    Time._lastTime = 0;
    GE.Time = Time;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class ArrayUtil {
        constructor() {
        }
        static isEmpty(array) {
            return array.length < 1;
        }
    }
    GE.ArrayUtil = ArrayUtil;
    class Array extends window.Array {
        constructor(length) {
            super(length);
        }
        isEmpty() {
            return super.length < 1;
        }
        remove(index) {
            console.log(index);
            console.log(super.slice(index, index + 1));
            console.log(super.toString());
        }
        removeEmptyStrings() {
            let i = 0;
            while (super.length > i) {
                if (super[i] === "") {
                    this.remove(i);
                }
                else {
                    i++;
                }
            }
        }
    }
    GE.Array = Array;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class AudioLoader {
        constructor() { }
        static load(src, callbackFunc) {
            let request = new XMLHttpRequest();
            request.responseType = "arraybuffer";
            request = new XMLHttpRequest();
            request.open('GET', 'viper.ogg', true);
            request.responseType = 'arraybuffer';
            request.onload = function () {
                let audioData = request.response;
                GE.AudioManager.audioContext.decodeAudioData(audioData, (buffer) => {
                    callbackFunc(buffer);
                }, (e) => {
                    throw new Error("Error with decoding audio data" + e);
                });
            };
        }
    }
    GE.AudioLoader = AudioLoader;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class ImageLoader {
        constructor() {
        }
        static load(path, onloadFunc) {
            let img = new Image();
            img.src = path;
            img.onload = () => {
                onloadFunc(img);
            };
        }
    }
    GE.ImageLoader = ImageLoader;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class AssetManager {
        constructor() { }
        static start() {
        }
        static update() { }
        static putAssetData(path, data) {
            this._assets[path] = data;
        }
        static getAssetData(name) {
            return this._assets[name];
        }
    }
    AssetManager._assets = {};
    GE.AssetManager = AssetManager;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class FileReader {
        constructor(path, name) {
            this._onload = (filereader) => { };
            this._name = name;
            let request = new XMLHttpRequest();
            request.open("GET", path);
            request.timeout = 4000;
            request.send(null);
            request.addEventListener("load", (e) => {
                this._data = request.responseText;
                this._onload(this);
            });
            this._onload(this);
        }
        get name() {
            return this._name;
        }
        get data() {
            return this._data;
        }
        set onload(func) {
            this._onload = func;
        }
    }
    GE.FileReader = FileReader;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Json {
        constructor() { }
        static load(src) {
            return JSON.parse(src);
        }
        static dump(jsonObj) {
            JSON.stringify(jsonObj);
        }
    }
    GE.Json = Json;
})(GE || (GE = {}));
/*
export class BasicMovement extends GE.Behavior{
    public speed: number;

    public start():void{

    }

    public update():void{
        if (GE.Input.isKeyDown(GE.keyCodes.W)) {
            this.transform.position.add(GE.Vector2.up.multiply(this.speed * GE.Time.deltaTime));
        }
        if (GE.Input.isKeyDown(GE.keyCodes.S)) {
            this.transform.position.add(GE.Vector2.down.multiply(this.speed * GE.Time.deltaTime));
        }
        if (GE.Input.isKeyDown(GE.keyCodes.A)) {
            this.transform.position.add(GE.Vector2.left.multiply(this.speed * GE.Time.deltaTime));
        }
        if (GE.Input.isKeyDown(GE.keyCodes.D)) {
            this.transform.position.add(GE.Vector2.right.multiply(this.speed * GE.Time.deltaTime));
        }
    }
}*/ 
var GE;
(function (GE) {
    class Behavior {
        constructor(name, gameObject) {
            this._gameObject = gameObject;
            this._transform = gameObject.transform;
            this._name = name;
        }
        get transform() {
            return this._transform;
        }
        get gameObject() {
            return this._gameObject;
        }
        start() {
        }
        update() {
        }
    }
    GE.Behavior = Behavior;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Component {
        constructor(name, gameObject) {
            this._gameObject = gameObject;
            this._transform = gameObject.transform;
            this._name = name;
        }
        get transfrom() {
            return this._transform;
        }
        get gameObject() {
            return this._gameObject;
        }
        start() {
        }
        update() {
        }
        render(shader) {
        }
    }
    GE.Component = Component;
})(GE || (GE = {}));
/// <reference path="../gameObject/component.ts"/>
var GE;
(function (GE) {
    class AudioPlayer extends GE.Component {
        constructor() {
            super(...arguments);
            this._audio = new Audio();
            this._volume = 100;
            this._playOnStart = true;
            this._loop = true;
            this._isPlaying = false;
            this._muted = false;
        }
        start() {
            this._audio.volume = this._volume / 100 * (GE.AudioManager.volume / 100);
            this._audio.muted = this._muted;
            this._audio.loop = this._loop;
            if (this._playOnStart) {
                this._isPlaying = true;
                this._audio.play();
            }
        }
        update() {
            if (this._audio.ended) {
                this._isPlaying = false;
            }
        }
        get volume() {
            return this._volume;
        }
        set volume(volume) {
            this._volume = volume;
            this._audio.volume = volume / 100 * (GE.AudioManager.volume / 100);
        }
        get playOnStart() {
            return this._playOnStart;
        }
        set playOnStart(state) {
            this._playOnStart = state;
        }
        set src(src) {
            this._audio.src = src;
        }
        get loop() {
            return this._loop;
        }
        set loop(state) {
            this._loop = state;
            this._audio.loop = state;
        }
        get isPlaying() {
            return this._isPlaying;
        }
        play() {
            this._audio.play();
        }
        stop() {
            this._audio.pause();
        }
    }
    GE.AudioPlayer = AudioPlayer;
})(GE || (GE = {}));
/// <reference path="../gameObject/component.ts"/>
/// <reference path="../gameObject/component.ts"/>
var GE;
(function (GE) {
    class SSpriteRenderer extends GE.Component {
        constructor() {
            super(...arguments);
            this._texture = new GE.Texture("spritesExamples/rectangle.png");
            this.color = GE.Color.white();
        }
        start() {
            //this._texture = new Texture("spritesExamples/rectangle.png", Mipmap.linear, 0);
            let vertecies = [
                -0.5, -0.5, 0, 0,
                0.5, -0.5, 1, 0,
                -0.5, 0.5, 0, 1,
                0.5, 0.5, 1, 1,
                0.5, -0.5, 1, 0,
                -0.5, 0.5, 0, 1
            ];
            this._buffer = new GE.GLBuffer(3);
            // set buffer attributes
            let positionAttribute = new GE.AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 2;
            positionAttribute.stride = 4;
            this._buffer.addAttribute(positionAttribute);
            let uvAttribute = new GE.AttributeInfo();
            uvAttribute.location = 1;
            uvAttribute.offset = 2;
            uvAttribute.size = 2;
            uvAttribute.stride = 4;
            this._buffer.addAttribute(uvAttribute);
            this._buffer.pushData(vertecies);
            this._buffer.upload();
            this._buffer.unbind();
        }
        /**
         * render
         */
        render(shader) {
            this._buffer.bind();
            this._texture.bind(0);
            //this._buffer.bind();
            let tintPosition = shader.getUniformLocation("tint");
            GE.gl.uniform4fv(tintPosition, this.color.toArray());
            let positionPosition = shader.getUniformLocation("position");
            GE.gl.uniform2fv(positionPosition, this.transfrom.position.toArray());
            let rotationMatPosition = shader.getUniformLocation("rotation");
            GE.gl.uniformMatrix2fv(rotationMatPosition, false, GE.Matrix2x2.rotation(this.transfrom.rotation).data);
            let scalePosition = shader.getUniformLocation("scale");
            GE.gl.uniform2fv(scalePosition, this.transfrom.scale.toArray());
            //console.log(this.transfrom.scale.toArray());
            GE.gl.uniform1i(shader.getUniformLocation("texture"), 0);
            //this._buffer.bind();
            this._buffer.draw();
        }
        set texture(path) {
            this._texture = new GE.Texture(path);
        }
    }
    GE.SSpriteRenderer = SSpriteRenderer;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class SpriteRenderer extends GE.Component {
        constructor() {
            super(...arguments);
            this._color = GE.Color.white();
        }
        start() {
        }
        update() {
        }
        set sprite(path) {
            this._sprite = path;
            if (!this._batchDataId === undefined) {
                GE.Renderer.remove(this._batchDataId);
            }
            let data = GE.Renderer.add(path, this.gameObject, this._color);
            this._batchDataId = data.id;
        }
        get sprite() {
            return this._sprite;
        }
    }
    GE.SpriteRenderer = SpriteRenderer;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class GameObject {
        constructor(name, scene) {
            this._transform = new GE.Transform();
            this._components = [];
            this.enabled = true;
            this._transform = new GE.Transform();
            this._name = name;
            this._scene = scene;
        }
        get transform() {
            return this._transform;
        }
        get name() {
            return this._name;
        }
        get parent() {
            return this._parent;
        }
        get scene() {
            return this._scene;
        }
        addComponent(component) {
            this._components.push(component);
        }
        start() {
            if (!this.enabled) {
                return;
            }
            for (let i = 0; i < this._components.length; i++) {
                this._components[i].start();
            }
        }
        update() {
            if (!this.enabled) {
                return;
            }
            for (let i = 0; i < this._components.length; i++) {
                this._components[i].update();
            }
        }
        render(shader) {
            if (!this.enabled) {
                return;
            }
            this._components[0].render(shader);
        }
    }
    GE.GameObject = GameObject;
})(GE || (GE = {}));
/// <reference path="gameObject.ts"/>
var GE;
(function (GE) {
    class MainCamera extends GE.GameObject {
        start() {
        }
        update() {
        }
        resize() {
            this._projection = GE.Matrix2x2.projection(0, GE.canvas.width, 0, GE.canvas.height);
            GE.gl.viewport(0, 0, GE.canvas.width, GE.canvas.height);
        }
        get projection() {
            return this._projection;
        }
    }
    GE.MainCamera = MainCamera;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Transform {
        constructor(position, rotation, scale) {
            this._position = position && position || new GE.Vector2(0, 0);
            this._rotation = rotation && rotation || 0;
            this._scale = scale && scale || new GE.Vector2(1, 1);
        }
        get position() {
            return this._position;
        }
        set position(position) {
            this._position = position;
        }
        get rotation() {
            return this._rotation;
        }
        set rotation(rotation) {
            this._rotation = rotation;
        }
        get scale() {
            return this._scale;
        }
        set scale(scale) {
            this._scale = scale;
        }
    }
    GE.Transform = Transform;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class GLBuffer {
        /**
         * Create a new GL buffer.
         * @param elementSize the size of each element in this buffer.
         * @param dataType the type of each element in this buffer
         * @param targetBufferType the type of the buffer
         * @param mode the drawing mode of the buffer
         * @param dataIncome the data income frequency.
         */
        constructor(elementSize, dataIncome = GE.gl.STATIC_DRAW, dataType = GE.gl.FLOAT, targetBufferType = GE.gl.ARRAY_BUFFER, mode = GE.gl.TRIANGLES) {
            this._data = [];
            this._attributes = [];
            this._elementSize = elementSize;
            this._dataIncome = dataIncome;
            this._dataType = dataType;
            this._targetBufferType = targetBufferType;
            this._mode = mode;
            //Determine byte size
            switch (this._dataType) {
                case GE.gl.FLOAT:
                case GE.gl.INT:
                case GE.gl.UNSIGNED_INT:
                    this._typeSize = 4;
                    break;
                case GE.gl.SHORT:
                case GE.gl.UNSIGNED_SHORT:
                    this._typeSize = 2;
                    break;
                case GE.gl.BYTE:
                case GE.gl.UNSIGNED_BYTE:
                    this._typeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognized data type: " + dataType.toString());
            }
            //this._stride = this._elementSize * this._typeSize;
            this._buffer = GE.gl.createBuffer();
        }
        /**
         * Delete the buffer.
         */
        destroy() {
            GE.gl.deleteBuffer(this._buffer);
        }
        /**
         * Binds the buffer;
         * @param normalized Specifiy if the data should be normalized.
         */
        bind(normalized = false) {
            GE.gl.bindBuffer(this._targetBufferType, this._buffer);
            for (let attribute of this._attributes) {
                GE.gl.vertexAttribPointer(attribute.location, attribute.size, this._dataType, normalized, attribute.stride * this._typeSize, attribute.offset * this._typeSize);
                GE.gl.enableVertexAttribArray(attribute.location);
            }
        }
        /**
         * Unbinds this buffer.
         */
        unbind() {
            for (let attribute of this._attributes) {
                GE.gl.disableVertexAttribArray(attribute.location);
            }
            GE.gl.bindBuffer(this._targetBufferType, null);
        }
        addAttribute(attribute) {
            this._attributes.push(attribute);
        }
        pushData(data) {
            for (let d of data) {
                this._data.push(d);
            }
        }
        upload() {
            GE.gl.bindBuffer(this._targetBufferType, this._buffer);
            let bufferData = new Float32Array(this._data);
            switch (this._dataType) {
                case GE.gl.FLOAT:
                    bufferData = new Float32Array(this._data);
                    break;
                case GE.gl.INT:
                    bufferData = new Int32Array(this._data);
                    break;
                case GE.gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this._data);
                    break;
                case GE.gl.SHORT:
                    bufferData = new Int16Array(this._data);
                    break;
                case GE.gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this._data);
                    break;
                case GE.gl.BYTE:
                    bufferData = new Int8Array(this._data);
                    break;
                case GE.gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this._data);
                    break;
            }
            GE.gl.bufferData(this._targetBufferType, bufferData, this._dataIncome);
        }
        draw() {
            if (this._targetBufferType === GE.gl.ARRAY_BUFFER) {
                GE.gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
            }
            else if (this._targetBufferType === GE.gl.ELEMENT_ARRAY_BUFFER) {
                GE.gl.drawElements(this._mode, this._data.length, this._dataType, 0);
            }
        }
    }
    GE.GLBuffer = GLBuffer;
    /**
     * The info for attributes in the buffer
     */
    class AttributeInfo {
    }
    GE.AttributeInfo = AttributeInfo;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class GLUtilties {
        /**
         * Initializing WebGL.
         */
        static start() {
            GE.canvas = document.getElementById("canvas");
            if (GE.canvas === undefined) {
                throw new Error("Cannot find canvas");
            }
            GE.gl = GE.canvas.getContext("webgl");
            if (GE.gl === undefined) {
                throw new Error("Unable to initialize WebGL");
            }
            this._maxTextures = GE.gl.getParameter(GE.gl.MAX_TEXTURE_IMAGE_UNITS);
            GE.gl.enable(GE.gl.BLEND);
            //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
            GE.gl.blendFunc(GE.gl.SRC_ALPHA, GE.gl.ONE_MINUS_SRC_ALPHA);
        }
        static get maxTextures() {
            return this._maxTextures;
        }
    }
    GE.GLUtilties = GLUtilties;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Shader {
        /**
         * Creates a new shader.
         * @param name The name of the shader for error handeling.
         * @param vertexSrc The vertex shader source code.
         * @param fragmentSrc The fragment shader source code.
         */
        constructor(name, vertexSrc, fragmentSrc) {
            this._name = name;
            let vertexShader = this.loadShader(GE.gl.VERTEX_SHADER, vertexSrc);
            let fragmentShader = this.loadShader(GE.gl.FRAGMENT_SHADER, fragmentSrc);
            this._program = this.loadProgram(vertexShader, fragmentShader);
        }
        loadShader(shadertype, shaderSrc) {
            let shader = GE.gl.createShader(shadertype);
            GE.gl.shaderSource(shader, shaderSrc);
            GE.gl.compileShader(shader);
            let error = GE.gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error("Shader compilition faild '" + this._name + "': " + error);
            }
            return shader;
        }
        loadProgram(vertexShader, fragmentShader) {
            let program = GE.gl.createProgram();
            GE.gl.attachShader(program, vertexShader);
            GE.gl.attachShader(program, fragmentShader);
            GE.gl.linkProgram(program);
            let error = GE.gl.getProgramInfoLog(program);
            if (error !== "") {
                throw new Error("Program Linking faild '" + this._name + "': " + error);
            }
            return program;
        }
        /**
         * Use the shader.
         */
        use() {
            GE.gl.useProgram(this._program);
        }
        /**
         * The name of the shader.
         */
        get name() {
            return this._name;
        }
        setAttribute(name, buffer) {
            let attributeLocation = GE.gl.getAttribLocation(this._program, name);
            GE.gl.bindBuffer(GE.gl.ARRAY_BUFFER, buffer);
            //gl.vertexAttribPointer();
        }
        getAttributeLocation(name) {
            let attributeLocation = GE.gl.getAttribLocation(this._program, name);
            if (attributeLocation === -1) {
                throw new Error("Unable to find attribute named '" + name + "' in shader named '" + this._name + "'");
            }
            return attributeLocation;
        }
        getUniformLocation(name) {
            let attributeLocation = GE.gl.getUniformLocation(this._program, name);
            if (attributeLocation === null) {
                throw new Error("Unable to find uniform named '" + name + "' in shader named '" + this._name + "'");
            }
            return attributeLocation;
        }
    }
    GE.Shader = Shader;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Texture {
        constructor(image, mipmap = GE.Mipmap.auto) {
            this._mipmap = mipmap;
            this._texture = GE.gl.createTexture();
            if (typeof image === "string") {
                this._image = new Image();
                this._image.onload = (e) => {
                    this.setup();
                };
                this._image.src = image;
            }
            else {
                this._image = image;
                this.setup();
            }
            //gl.activeTexture(gl.TEXTURE0 + this._textureSlot);
            //gl.bindTexture(gl.TEXTURE_2D, this._texture);
        }
        bind(textureSlot) {
            GE.gl.bindTexture(GE.gl.TEXTURE_2D, this._texture);
            GE.gl.texParameteri(GE.gl.TEXTURE_2D, GE.gl.TEXTURE_MAG_FILTER, GE.Renderer.getMipmapGlNumber(this._mipmap));
            GE.gl.texParameteri(GE.gl.TEXTURE_2D, GE.gl.TEXTURE_MIN_FILTER, GE.Renderer.getMipmapGlNumber(this._mipmap));
            GE.gl.activeTexture(GE.gl.TEXTURE0 + textureSlot);
        }
        destroy() {
            GE.gl.deleteTexture(this._texture);
        }
        size() {
            return new GE.Vector2(this._image.width, this._image.height);
        }
        get mipmap() {
            return this._mipmap;
        }
        set mipmap(mipmap) {
            this._mipmap = mipmap;
        }
        setup() {
            GE.gl.bindTexture(GE.gl.TEXTURE_2D, this._texture);
            GE.gl.texImage2D(GE.gl.TEXTURE_2D, 0, GE.gl.RGBA, GE.gl.RGBA, GE.gl.UNSIGNED_BYTE, this._image);
            GE.gl.texParameteri(GE.gl.TEXTURE_2D, GE.gl.TEXTURE_WRAP_S, GE.gl.CLAMP_TO_EDGE);
            GE.gl.texParameteri(GE.gl.TEXTURE_2D, GE.gl.TEXTURE_WRAP_T, GE.gl.CLAMP_TO_EDGE);
            GE.gl.texParameteri(GE.gl.TEXTURE_2D, GE.gl.TEXTURE_MAG_FILTER, GE.Renderer.getMipmapGlNumber(this._mipmap));
            GE.gl.texParameteri(GE.gl.TEXTURE_2D, GE.gl.TEXTURE_MIN_FILTER, GE.Renderer.getMipmapGlNumber(this._mipmap));
        }
    }
    GE.Texture = Texture;
})(GE || (GE = {}));
var GE;
(function (GE) {
    GE.batchMaxQuads = 10000;
    class Batch {
        constructor() {
            this._data = [];
            this._textures = [];
            this._vertexBuffer = new GE.GLBuffer(12, GE.gl.DYNAMIC_DRAW);
            this._vertexBuffer.bind();
            this._indeciesBuffer = new GE.GLBuffer(4, GE.gl.STATIC_DRAW, GE.gl.UNSIGNED_INT, GE.gl.ELEMENT_ARRAY_BUFFER);
            this._indeciesBuffer.pushData(this.generateIndecies());
        }
        add(data) {
            if (this._data.length < GE.batchMaxQuads) {
                for (let i = 0; i < this._textures.length; i++) {
                    if (this._textures[i] == data.sprite.texture) {
                        this._data.push(data);
                        return;
                    }
                }
                if (this._textures.length < GE.GLUtilties.maxTextures) {
                    this._textures.push(data.sprite.texture);
                    this._data.push(data);
                }
            }
        }
        remove(id) {
            this._data.slice(id, 1);
        }
        modify(id, color) {
            this._data[id].color = color;
        }
        generateIndecies() {
            let elements = new GE.Array(GE.batchMaxQuads * 6);
            for (let i = 0; i < GE.batchMaxQuads; i++) {
                // 6 cause in 1 quad there are 6 indecies
                let indexOffset = i * 6;
                // 4 cause in 1 quad there are 4 vertecies 
                let vertexOffset = i * 4;
                // triangle 1
                elements[indexOffset] = vertexOffset + 3;
                elements[indexOffset + 1] = vertexOffset + 2;
                elements[indexOffset + 2] = vertexOffset;
                // triangle 3
                elements[indexOffset + 3] = vertexOffset + 2;
                elements[indexOffset + 4] = vertexOffset;
                elements[indexOffset + 5] = vertexOffset + 1;
            }
            return elements;
        }
        render() {
        }
        hasQuadRoom() {
            return this._data.length < GE.batchMaxQuads;
        }
        canRenderSprite(sprite) {
            for (let i = 0; i < this._textures.length; i++) {
                if (this._textures[i] == sprite.texture) {
                    return true;
                }
            }
            if (this._textures.length < GE.GLUtilties.maxTextures) {
                return true;
            }
            return false;
        }
        get numberOfQuads() {
            return this._data.length;
        }
    }
    GE.Batch = Batch;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Renderer {
        constructor() { }
        static start() {
            this._batches = [new GE.Batch()];
        }
        static add(spritePath, gameObject, color) {
            for (let i = 0; i < this._batches.length; i++) {
                if (this._batches[i].hasQuadRoom() && this._batches[i].canRenderSprite(this._sprites[spritePath])) {
                    let id = i * GE.batchMaxQuads + this._batches[i].numberOfQuads;
                    let data = {
                        sprite: this.getSprite(spritePath),
                        gameObject: gameObject,
                        color: color,
                        id: id
                    };
                    this._batches[i].add(data);
                    return data;
                }
            }
            this._batches.push(new GE.Batch());
            let id = (this._batches.length - 1) * GE.batchMaxQuads + this._batches[-1].numberOfQuads;
            let data = {
                sprite: this._sprites[spritePath],
                gameObject: gameObject,
                color: color,
                id: id
            };
            this._batches[-1].add(data);
            this._quads++;
            return data;
        }
        static remove(id) {
            this._batches[Math.floor(id / GE.batchMaxQuads)].remove(id % GE.batchMaxQuads);
            this._quads--;
        }
        static render() {
            console.log(this._sprites);
            console.log(this._batches);
        }
        static getSprite(path) {
            // getting already loaded sprite
            if (path in this._sprites) {
                return this._sprites[path];
            }
            // if the sprite doesnt exits it will try to create a new one from the assets data
            let spriteData = GE.AssetManager.getAssetData(path);
            if (spriteData === undefined) {
                throw new Error("the sprite sheet '" + path + "' was not found in the imported files");
            }
            let uv = [
                new GE.Vector2(0, 0),
                new GE.Vector2(1, 1)
            ];
            if (spriteData.texture in this._textures) {
                let sprite = new GE.Sprite(this._textures[spriteData.texture], uv);
                this._sprites[path] = sprite;
                return sprite;
            }
            else {
                let textureImg = GE.AssetManager.getAssetData(spriteData.texture);
                if (!(textureImg === undefined)) {
                    let texture = new GE.Texture(textureImg);
                    this._textures[spriteData.texture] = texture;
                    let sprite = new GE.Sprite(texture, uv);
                    this._sprites[path] = sprite;
                    return sprite;
                }
                throw new Error("the sprite sheet's image '" + spriteData.texture + "' was not found in the imported files");
            }
        }
        static getMipmapGlNumber(mipmap) {
            if (mipmap === Mipmap.linear) {
                return GE.gl.LINEAR;
            }
            else if (mipmap === Mipmap.nearest) {
                return GE.gl.NEAREST;
            }
            else {
                // if it no one of the other that mean it is auto
                if (this.mipmap === Mipmap.linear) {
                    return GE.gl.LINEAR;
                }
                else if (this.mipmap === Mipmap.nearest) {
                    return GE.gl.NEAREST;
                }
                else {
                    if (GE.Time.frameRate > 55) {
                        return GE.gl.LINEAR;
                    }
                    else {
                        return GE.gl.NEAREST;
                    }
                }
            }
        }
        static modify(id, data) {
            this._batches[Math.floor(id / GE.batchMaxQuads)].modify(id % GE.batchMaxQuads, data);
        }
    }
    Renderer._textures = {};
    Renderer._sprites = {};
    Renderer._quads = 0;
    GE.Renderer = Renderer;
    let Mipmap;
    (function (Mipmap) {
        Mipmap[Mipmap["nearest"] = 0] = "nearest";
        Mipmap[Mipmap["linear"] = 1] = "linear";
        Mipmap[Mipmap["auto"] = 2] = "auto";
    })(Mipmap = GE.Mipmap || (GE.Mipmap = {}));
    ;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Color {
        constructor(r, g, b, a) {
            this._r = r;
            this._g = g;
            this._b = b;
            this._a = a;
        }
        get r() {
            return this._r;
        }
        set r(value) {
            this._r = value;
        }
        get g() {
            return this._g;
        }
        set g(value) {
            this._g = value;
        }
        get b() {
            return this._b;
        }
        set b(value) {
            this._b = value;
        }
        get a() {
            return this._a;
        }
        set a(value) {
            this._a = value;
        }
        toArray() {
            let wieght = 1 / 255;
            return [wieght * this._r, wieght * this._g, wieght * this._b, wieght * this._a];
        }
        static black() {
            return new Color(0, 0, 0, 255);
        }
        static white() {
            return new Color(255, 255, 255, 255);
        }
        static red() {
            return new Color(255, 0, 0, 255);
        }
        static orange() {
            return new Color(255, 165, 0, 255);
        }
        static yellow() {
            return new Color(255, 255, 0, 255);
        }
        static green() {
            return new Color(0, 150, 0, 255);
        }
        static lime() {
            return new Color(191, 255, 0, 255);
        }
        static blue() {
            return new Color(0, 0, 255, 255);
        }
        static lightBlue() {
            return new Color(0, 210, 255, 255);
        }
        static purple() {
            return new Color(132, 0, 255, 255);
        }
        static pink() {
            return new Color(255, 153, 204, 255);
        }
        static brown() {
            return new Color(150, 75, 0, 255);
        }
        static magenta() {
            return new Color(255, 0, 255, 255);
        }
        static tan() {
            return new Color(210, 180, 255, 255);
        }
        static cyan() {
            return new Color(0, 255, 255, 255);
        }
        static olive() {
            return new Color(128, 128, 0, 255);
        }
        static maroon() {
            return new Color(128, 0, 0, 255);
        }
        static navy() {
            return new Color(0, 0, 128, 255);
        }
        static aquamarine() {
            return new Color(127, 255, 212, 255);
        }
        static turquoise() {
            return new Color(64, 224, 208, 255);
        }
        static silver() {
            return new Color(192, 192, 192, 255);
        }
        static teal() {
            return new Color(0, 128, 128, 255);
        }
        static indigo() {
            return new Color(111, 0, 255, 255);
        }
    }
    GE.Color = Color;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Sprite {
        constructor(texture, uv) {
            this._uv = [];
            this._texture = texture;
        }
        get uv() {
            return this._uv;
        }
        get texture() {
            return this._texture;
        }
    }
    GE.Sprite = Sprite;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Vector2 {
        constructor(x, y) {
            this._x = x;
            this._y = y;
        }
        static get up() {
            return new Vector2(0, 1);
        }
        static get down() {
            return new Vector2(0, -1);
        }
        static get right() {
            return new Vector2(1, 0);
        }
        static get left() {
            return new Vector2(-1, 0);
        }
        get x() {
            return this._x;
        }
        set x(x) {
            this._x = x;
        }
        get y() {
            return this._y;
        }
        set y(y) {
            this._y = y;
        }
        add(NewVector) {
            this._x += NewVector.x;
            this._y += NewVector.y;
            return this;
        }
        sub(NewVector) {
            this._x -= NewVector.x;
            this._y -= NewVector.y;
            return this;
        }
        multiply(number) {
            this._x *= number;
            this._y *= number;
            return this;
        }
        /*
        public multiply(vector: Vector2) {
            this._x *= vector.x;
            this._y *= vector.y;
            return this;
        }*/
        divide(number) {
            this._x /= number;
            this._y /= number;
            return this;
        }
        mag() {
            return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2));
        }
        setMag(number) {
            this.normalize();
            this.multiply(number);
        }
        normalize() {
            let VectorLength = this.mag();
            this._x /= VectorLength;
            this._y /= VectorLength;
        }
        toArray() {
            return [this._x, this._y];
        }
    }
    GE.Vector2 = Vector2;
})(GE || (GE = {}));
/// <reference path="../math/vector2.ts"/>
var GE;
(function (GE) {
    class Input {
        constructor() { }
        static start() {
            window.addEventListener('keydown', (e) => {
                if (!GE.contains(this._currentKeysDown, [e.keyCode, e.location])) {
                    this._currentKeysDown.push([e.keyCode, e.location]);
                }
                if (GE.contains(this._currentKeysUp, [e.keyCode, e.location])) {
                    this._currentKeysUp.splice(GE.indexof(this._currentKeysUp, [e.keyCode, e.location]), 1);
                }
                if (GE.contains(this._keysReleasedUpdated, [e.keyCode, e.location])) {
                    this._keysReleasedUpdated.splice(GE.indexof(this._keysReleasedUpdated, [e.keyCode, e.location]), 1);
                }
            });
            window.addEventListener('keyup', (e) => {
                //if (!contains(this._currentKeysUp, [e.keyCode, e.location])) {
                //    this._currentKeysUp.push([e.keyCode, e.location]);
                //}
                this._currentKeysUp.push([e.keyCode, e.location]);
                if (GE.contains(this._currentKeysDown, [e.keyCode, e.location])) {
                    this._currentKeysDown.splice(GE.indexof(this._currentKeysDown, [e.keyCode, e.location]), 1);
                }
                if (GE.contains(this._keysPressedUpdated, [e.keyCode, e.location])) {
                    this._keysPressedUpdated.splice(GE.indexof(this._keysPressedUpdated, [e.keyCode, e.location]), 1);
                }
            });
            window.addEventListener("wheel", (e) => {
                this._mousePostion = new GE.Vector2(e.x, e.y);
                this._scrollUpdated = false;
                this._lastScroll = e.deltaY > 0 ? 1 : -1;
            });
            window.addEventListener("mousemove", (e) => {
                this._mousePostion = new GE.Vector2(e.x, e.y);
            });
            window.addEventListener("mousedown", (e) => {
                this._mousePostion = new GE.Vector2(e.x, e.y);
                this._currentMouseButtonsDown.push(e.button);
                if (GE.contains(this._currentMouseButtonsUp, e.button)) {
                    this._currentMouseButtonsUp.splice(GE.indexof(this._currentMouseButtonsUp, e.button), 1);
                }
                if (GE.contains(this._mouseButtonsReleasedUpdated, e.button)) {
                    this._mouseButtonsReleasedUpdated.splice(GE.indexof(this._mouseButtonsReleasedUpdated, e.button), 1);
                }
            });
            window.addEventListener("mouseup", (e) => {
                this._mousePostion = new GE.Vector2(e.x, e.y);
                this._currentMouseButtonsUp.push(e.button);
                if (GE.contains(this._currentMouseButtonsDown, e.button)) {
                    this._currentMouseButtonsDown.splice(GE.indexof(this._currentMouseButtonsDown, e.button), 1);
                }
                if (GE.contains(this._mouseButtonsPressedUpdated, e.button)) {
                    this._mouseButtonsPressedUpdated.splice(GE.indexof(this._mouseButtonsPressedUpdated, e.button), 1);
                }
            });
        }
        static update() {
            this._keysPressed = [];
            this._keysReleased = [];
            for (let i = 0; i < this._currentKeysDown.length; i++) {
                if (!GE.contains(this._keysPressedUpdated, this._currentKeysDown[i])) {
                    this._keysPressed.push(this._currentKeysDown[i]);
                    this._keysPressedUpdated.push(this._currentKeysDown[i]);
                }
            }
            for (let i = 0; i < this._currentKeysUp.length; i++) {
                if (!GE.contains(this._keysReleasedUpdated, this._currentKeysUp[i])) {
                    this._keysReleased.push(this._currentKeysUp[i]);
                    this._keysReleasedUpdated.push(this._currentKeysUp[i]);
                }
            }
            this._mouseButtonsPressed = [];
            this._mouseButtonsReleased = [];
            for (let i = 0; i < this._currentMouseButtonsDown.length; i++) {
                if (!GE.contains(this._mouseButtonsPressedUpdated, this._currentMouseButtonsDown[i])) {
                    this._mouseButtonsPressed.push(this._currentMouseButtonsDown[i]);
                    this._mouseButtonsPressedUpdated.push(this._currentMouseButtonsDown[i]);
                }
            }
            for (let i = 0; i < this._currentMouseButtonsUp.length; i++) {
                if (!GE.contains(this._mouseButtonsReleasedUpdated, this._currentMouseButtonsUp[i])) {
                    this._mouseButtonsReleased.push(this._currentMouseButtonsUp[i]);
                    this._mouseButtonsReleasedUpdated.push(this._currentMouseButtonsUp[i]);
                }
            }
            this._mouseWheel = 0;
            if (!this._scrollUpdated) {
                this._mouseWheel = this._lastScroll;
                this._scrollUpdated = true;
            }
        }
        static isKeyDown(keyCode) {
            return GE.contains(this._currentKeysDown, keyCode);
        }
        static isKeyPressed(keyCode) {
            return GE.contains(this._keysPressed, keyCode);
        }
        static isKeyReleased(keyCode) {
            return GE.contains(this._keysReleased, keyCode);
        }
        static isMouseButtonDown(button) {
            return GE.contains(this._currentMouseButtonsDown, button);
        }
        static isMouseButtonPressed(button) {
            return GE.contains(this._mouseButtonsPressed, button);
        }
        static isMouseButtonReleased(button) {
            return GE.contains(this._mouseButtonsReleased, button);
        }
        static scroll() {
            return this._mouseWheel;
        }
        static mousePosition() {
            return this._mousePostion;
        }
    }
    Input._currentKeysDown = [];
    Input._currentKeysUp = [];
    Input._keysPressedUpdated = [];
    Input._keysReleasedUpdated = [];
    Input._keysPressed = [];
    Input._keysReleased = [];
    Input._mousePostion = new GE.Vector2(0, 0);
    Input._lastScroll = 0;
    Input._scrollUpdated = false;
    Input._mouseWheel = 0;
    Input._currentMouseButtonsDown = [];
    Input._currentMouseButtonsUp = [];
    Input._mouseButtonsPressedUpdated = [];
    Input._mouseButtonsReleasedUpdated = [];
    Input._mouseButtonsPressed = [];
    Input._mouseButtonsReleased = [];
    GE.Input = Input;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class keyCodes {
        constructor() { }
    }
    keyCodes.ESCAPE = [27, 0];
    keyCodes.F1 = [112, 0];
    keyCodes.F2 = [113, 0];
    keyCodes.F3 = [114, 0];
    keyCodes.F4 = [115, 0];
    keyCodes.F5 = [116, 0];
    keyCodes.F6 = [117, 0];
    keyCodes.F7 = [118, 0];
    keyCodes.F8 = [119, 0];
    keyCodes.F9 = [120, 0];
    keyCodes.F10 = [121, 0];
    keyCodes.F11 = [122, 0];
    keyCodes.F12 = [123, 0];
    keyCodes.BACK_QUOTE = [192, 0];
    keyCodes.ZERO = [48, 0];
    keyCodes.ONE = [49, 0];
    keyCodes.TWO = [50, 0];
    keyCodes.THREE = [51, 0];
    keyCodes.FOUR = [52, 0];
    keyCodes.FIVE = [53, 0];
    keyCodes.SIX = [54, 0];
    keyCodes.SEVEN = [55, 0];
    keyCodes.EIGHT = [56, 0];
    keyCodes.NINE = [57, 0];
    keyCodes.MINUS = [189, 0];
    keyCodes.EQUALS = [187, 0];
    keyCodes.BACK = [8, 0];
    keyCodes.TAB = [9, 0];
    keyCodes.Q = [81, 0];
    keyCodes.W = [87, 0];
    keyCodes.E = [69, 0];
    keyCodes.R = [82, 0];
    keyCodes.T = [84, 0];
    keyCodes.Y = [89, 0];
    keyCodes.U = [85, 0];
    keyCodes.I = [73, 0];
    keyCodes.O = [79, 0];
    keyCodes.P = [80, 0];
    keyCodes.LEFT_BRACKET = [219, 0];
    keyCodes.RIGHT_BRACKET = [221, 0];
    keyCodes.ENTER = [13, 0];
    keyCodes.CAPSLOCK = [20, 0];
    keyCodes.A = [65, 0];
    keyCodes.S = [83, 0];
    keyCodes.D = [68, 0];
    keyCodes.F = [70, 0];
    keyCodes.G = [71, 0];
    keyCodes.H = [72, 0];
    keyCodes.J = [74, 0];
    keyCodes.K = [75, 0];
    keyCodes.L = [76, 0];
    keyCodes.SEMICOLON = [186, 0];
    keyCodes.QUOTE = [222, 0];
    keyCodes.BACK_SLASH = [220, 0];
    keyCodes.LEFT_SHIFT = [16, 1];
    keyCodes.INTL_BACK_SLASH = [226, 0];
    keyCodes.Z = [90, 0];
    keyCodes.X = [88, 0];
    keyCodes.C = [67, 0];
    keyCodes.V = [86, 0];
    keyCodes.B = [66, 0];
    keyCodes.N = [78, 0];
    keyCodes.M = [77, 0];
    keyCodes.COMMA = [188, 0];
    keyCodes.PERIOD = [190, 0];
    keyCodes.SLASH = [191, 0];
    keyCodes.RIGHT_SHIFT = [16, 2];
    keyCodes.CONTROL_LEFT = [17, 1];
    keyCodes.META_LEFT = [91, 1];
    keyCodes.LEFT_ALT = [18, 1];
    keyCodes.SPACE = [32, 0];
    keyCodes.RIGHT_ALT = [18, 2];
    keyCodes.CONTEXT_MENU = [93, 0];
    keyCodes.CONTROL_RIGHT = [17, 2];
    GE.keyCodes = keyCodes;
})(GE || (GE = {}));
const keyCodes = {
    "Escape": 27,
    "F1": 112,
    "F2": 113,
    "F3": 114,
    "F4": 115,
    "F5": 116,
    "F6": 117,
    "F7": 118,
    "F8": 119,
    "F9": 120,
    "F10": 121,
    "F11": 122,
    "F12": 123,
    "`": 192,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "-": 189,
    "=": 187,
    "Backspace": 8,
    "Tab": 9,
    "q": 81,
    "w": 87,
    "e": 69,
    "r": 82,
    "t": 84,
    "y": 89,
    "u": 85,
    "i": 73,
    "o": 79,
    "p": 80,
    "[": 219,
    "]": 221,
    "Enter": 13,
    "CapsLock": 20,
    "a": 65,
    "s": 83,
    "d": 68,
    "f": 70,
    "g": 71,
    "h": 72,
    "j": 74,
    "k": 75,
    "l": 76,
    ";": 186,
    "'": 222,
    "\\": 220,
    "Shift": 16,
    "Intl\\": 226,
    "z": 90,
    "x": 88,
    "c": 67,
    "v": 86,
    "b": 66,
    "n": 78,
    "m": 77,
    ",": 188,
    ".": 190,
    "/": 191,
    "Control": 17,
    "Alt": 18,
    " ": 32,
    "ContextMenu": 93,
};
var GE;
(function (GE) {
    function degRad(angle) {
        return angle * Math.PI / 180;
    }
    GE.degRad = degRad;
    function radDeg(angle) {
        return angle * 180 / Math.PI;
    }
    GE.radDeg = radDeg;
    function distance(position1, position2) {
        return position1.mag() - position2.mag();
    }
    GE.distance = distance;
})(GE || (GE = {}));
var GE;
(function (GE) {
    const sizeUnit = 200;
    class Matrix2x2 {
        constructor() {
            this._data = [];
            this._data = [
                1, 0,
                0, 1,
            ];
        }
        get data() {
            return this._data;
        }
        static identity() {
            return new Matrix2x2();
        }
        static projection(left, right, bottom, top) {
            let mat = new Matrix2x2();
            let leftRight = 1 / (left - right);
            let bottomTop = 1 / (bottom - top);
            mat._data[0] = (-sizeUnit) * leftRight;
            mat._data[3] = (-sizeUnit) * bottomTop;
            return mat;
        }
        static rotation(angle) {
            let mat = new Matrix2x2();
            let cos = Math.cos(angle);
            let sin = Math.sin(angle);
            mat._data = [
                cos, -sin,
                sin, cos
            ];
            return mat;
        }
        // not working
        static multiply(matrix1, matrix2) {
            let result = new Matrix2x2();
            result._data[0] = matrix1._data[0] * matrix2._data[0] + matrix1._data[1] * matrix2._data[2];
            result._data[1] = matrix1._data[0] * matrix2._data[0] + matrix1._data[1] * matrix2._data[2];
            result._data[2] = matrix1._data[0] * matrix2._data[0] + matrix1._data[1] * matrix2._data[2];
            result._data[3] = matrix1._data[0] * matrix2._data[0] + matrix1._data[1] * matrix2._data[2];
            return result;
        }
    }
    GE.Matrix2x2 = Matrix2x2;
})(GE || (GE = {}));
var GE;
(function (GE) {
    const sizeUnit = 200;
    class Matrix4 {
        constructor() {
            this._data = [];
            this._data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }
        get data() {
            return this._data;
        }
        static identity() {
            return new Matrix4();
        }
        static projection(left, right, bottom, top) {
            let mat = new Matrix4();
            let leftRight = 1 / (left - right);
            let bottomTop = 1 / (bottom - top);
            mat._data[0] = (-sizeUnit) * leftRight;
            mat._data[5] = (-sizeUnit) * bottomTop;
            return mat;
        }
        static transformations(position) {
            let mat = new Matrix4();
            mat._data[12] = position.x;
            mat._data[13] = position.y;
            return mat;
        }
    }
    GE.Matrix4 = Matrix4;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Random {
        constructor() {
        }
        static randint(min = 0, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        static randfloat(min = 0, max) {
            return Math.random() * (max - min) + min;
        }
        static random() {
            return Math.random();
        }
        static choice(array) {
            return array[this.randint(0, array.length)];
        }
        static shuffle(array) {
            array = [...array];
            for (let i = array.length - 1; i > 0; i--) {
                let j = this.randint(0, i + 1);
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
    }
    GE.Random = Random;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Scene {
        constructor(name) {
            this._gameObjects = [];
            this._name = name;
            this._camera = new GE.MainCamera("__MainCamera__", this);
        }
        get name() {
            return this._name;
        }
        addGameObject(gameObject) {
            this._gameObjects.push(gameObject);
        }
        find(name) {
            for (let i = 0; i < this._gameObjects.length; i++) {
                if (this._gameObjects[i].name === name) {
                    return this._gameObjects[i];
                }
            }
            return undefined;
        }
        removeGameObject(gameObject) {
            let gameObjectIndex = this._gameObjects.indexOf(gameObject);
            if (gameObjectIndex !== -1) {
                this._gameObjects.splice(gameObjectIndex, 1);
            }
        }
        update() {
            for (let i = 0; i < this._gameObjects.length; i++) {
                this._gameObjects[i].update();
            }
        }
        start() {
            for (let i = 0; i < this._gameObjects.length; i++) {
                this._gameObjects[i].start();
            }
        }
        render(shader) {
            for (let i = 0; i < this._gameObjects.length; i++) {
                this._gameObjects[i].render(shader);
            }
        }
        onActivate() {
        }
        onDeactivate() {
        }
        get camera() {
            return this._camera;
        }
    }
    GE.Scene = Scene;
})(GE || (GE = {}));
/// <reference path="../gameObject/gameObject.ts"/>
var GE;
(function (GE) {
    class SceneManager {
        constructor() { }
        static createScene(scene) {
            this._scenes.push(scene);
        }
        static loadSceneJson(path) {
            let sceneData = GE.AssetManager.getAssetData(path);
            if (sceneData.name === undefined) {
                throw new Error("Scene file format exception: Scene name is not defined.");
            }
            let scene = new GE.Scene(String(sceneData.name));
            if (sceneData.gameObjects !== undefined) {
                for (let i = 0; i < sceneData.gameObjects.length; i++) {
                    scene.addGameObject(this.loadGameObject(sceneData.gameObjects[i], scene));
                }
            }
            this._scenes.push(scene);
            return scene;
        }
        static loadGameObject(data, scene) {
            if (data.name === undefined) {
                throw new Error("Scene file format exception: Game object name is not defined.");
            }
            let gameObject = new GE.GameObject(data["name"], scene);
            if (data.transform !== undefined) {
                if (data.transform.position !== undefined) {
                    if (data.transform.position.x === undefined) {
                        throw new Error("Scene file format exception: Game object transform position is defined but the 'x' argument is not defined.");
                    }
                    if (data.transform.position.y === undefined) {
                        throw new Error("Scene file format exception: Game object transform position is defined but the 'y' argument is not defined.");
                    }
                    gameObject.transform.position = new GE.Vector2(data.transform.position.x, data.transform.position.y);
                }
                if (data.transform.rotation !== undefined) {
                    gameObject.transform.rotation = data.transform.rotation;
                }
                if (data.transform.scale !== undefined) {
                    if (data.transform.scale.x === undefined) {
                        throw new Error("Scene file format exception: Game object transform scale is defined but the 'x' argument is not defined.");
                    }
                    if (data.transform.scale.y === undefined) {
                        throw new Error("Scene file format exception: Game object transform scale is defined but the 'y' argument is not defined.");
                    }
                    gameObject.transform.scale = new GE.Vector2(data.transform.scale.x, data.transform.scale.y);
                }
            }
            if (data.components !== undefined) {
                for (let i = 0; i < data.components.length; i++) {
                    let componentData = data.components[i];
                    if (componentData.type === undefined) {
                        throw new Error("Scene file format exception: Component type is not defined.");
                    }
                    let component = eval("new GE." + componentData.type + "('fggs', gameObject)");
                    for (let param in data.components[i]) {
                        if (param === "type") {
                            continue;
                        }
                        if (!(param in component)) {
                            throw new Error("Scene file format exception: Component parameter named '" + param + "' does not exist.");
                        }
                        component[param] = data.components[i][param];
                    }
                    gameObject.addComponent(component);
                }
            }
            if (gameObject.enabled !== undefined) {
                gameObject.enabled = data["enabled"];
            }
            return gameObject;
        }
        static activateScene(name) {
            for (let i = 0; i < this._scenes.length; i++) {
                if (this._scenes[i].name === name) {
                    if (this._activeScene !== undefined) {
                        this._activeScene.onDeactivate();
                    }
                    this._scenes[i].onActivate();
                    this._activeScene = this._scenes[i];
                    return;
                }
            }
        }
        static start() {
            this._activeScene.start();
        }
        static update() {
            this._activeScene.update();
        }
        static render(shader) {
            this._activeScene.render(shader);
        }
        static get activeScene() {
            return this._activeScene;
        }
    }
    SceneManager._scenes = [];
    GE.SceneManager = SceneManager;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class ShaderManager {
        constructor() { }
        static getShader(name) {
            return this._shaders[name];
        }
        static loadShader(vertexFilePath, fragmentFilePath, name) {
            //fileReader(vertexFilePath, this.sourceCallback.bind(this), name + ".vertex");
            //fileReader(fragmentFilePath, this.sourceCallback.bind(this), name + ".fragment");
            this._shaderSources[name] = {};
        }
        static sourceCallback(source, name) {
            let nameSeperated = name.split(".");
            let shaderType = nameSeperated[nameSeperated.length - 1];
            nameSeperated.pop();
            name = nameSeperated.join(".");
            this._shaderSources[name][shaderType] = source;
            if (this._shaderSources[name].hasOwnProperty("vertex") && this._shaderSources[name].hasOwnProperty("fragment")) {
                this._shaders[name] = new GE.Shader(name, this._shaderSources[name]["vertex"], this._shaderSources[name]["fragment"]);
                delete this._shaderSources[name];
            }
        }
    }
    ShaderManager._shaders = {};
    ShaderManager._shaderSources = {};
    GE.ShaderManager = ShaderManager;
})(GE || (GE = {}));
var GE;
(function (GE) {
    function removeEmptyStrings(stringArray) {
        let result = [];
        for (let i = 0; i < stringArray.length; i++) {
            if (!(stringArray[i] === "")) {
                result.push(stringArray[i]);
            }
        }
        return result;
    }
    GE.removeEmptyStrings = removeEmptyStrings;
    function contains(array, item) {
        return array.some(elem => {
            return JSON.stringify(elem) === JSON.stringify(item);
        });
    }
    GE.contains = contains;
    function indexof(array, item) {
        return array.findIndex(x => JSON.stringify(x) === JSON.stringify(item));
    }
    GE.indexof = indexof;
})(GE || (GE = {}));
