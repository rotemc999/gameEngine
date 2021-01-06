"use strict";
var GE;
(function (GE) {
    class Engine {
        constructor() {
            this.run = true;
        }
        start() {
            this.canvas = GE.GLUtilties.initialize();
            GE.gl.clearColor(0, 0, 0, 1);
            this._sprite = new GE.Sprite("../../image.jpg", "minecraftSprite", 2, 1);
            this._sprite.load();
            this.resize();
            this.loadTextureShaders();
            this._shader.use();
            this.update();
        }
        update() {
            GE.gl.clear(GE.gl.COLOR_BUFFER_BIT);
            let projectionPosition = this._shader.getUniformLocation("projection");
            GE.gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));
            let transformationsPosition = this._shader.getUniformLocation("transformation");
            GE.gl.uniformMatrix4fv(transformationsPosition, false, new Float32Array(GE.Matrix4.transformations(new GE.Vector2(1, -4)).data));
            let objectPositionPosition = this._shader.getUniformLocation("objectPosition");
            GE.gl.uniform2f(objectPositionPosition, 4, 3);
            GE.gl.uniform1i(this._shader.getUniformLocation("texture"), 0);
            this._sprite.draw();
            GE.Time.update();
            if (this.run) {
                requestAnimationFrame(this.update.bind(this));
            }
        }
        resize() {
            if (this.canvas !== undefined) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this._projection = GE.Matrix4.projection(0, this.canvas.width, 0, this.canvas.height);
                GE.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }
        }
        loadDefultShaders() {
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
            this._shader = new GE.Shader("basic", vertex, fragment);
        }
        loadTextureShaders() {
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
            this._shader = new GE.Shader("basic", vertex, fragment);
        }
    }
    GE.Engine = Engine;
})(GE || (GE = {}));
/// <reference path="core/engine.ts"/>
var engine = new GE.Engine();
window.onload = () => {
    engine.start();
};
window.onresize = () => {
    engine.resize();
};
var GE;
(function (GE) {
    class Input {
        constructor() {
            this.currentKeysDown = [];
            this.currentKeysUp = [];
            this.keysPressedUpdated = [];
            this.keysReleasedUpdated = [];
            this.keysPressed = [];
            this.keysReleased = [];
            this.mousePostion = new GE.Vector2(0, 0);
            this.lastScroll = 0;
            this.scrollUpdated = false;
            this.mouseWheel = 0;
            this.scrollWeight = 0;
            this.currentMouseButtonsDown = [];
            this.currentMouseButtonsUp = [];
            this.mouseButtonsPressedUpdated = [];
            this.mouseButtonsReleasedUpdated = [];
            this.mouseButtonsPressed = [];
            this.mouseButtonsReleased = [];
        }
    }
    GE.Input = Input;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Scene {
        constructor(name) {
            this._gameObjects = [];
            this._name = name;
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
                else {
                    let gameObject = this._gameObjects[i].find(name);
                    if (!gameObject === undefined) {
                        return gameObject;
                    }
                }
                return undefined;
            }
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
    }
    GE.Scene = Scene;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class SceneManager {
        constructor() { }
        static loadScene(name) {
            for (let i = 0; i < this._scenes.length; i++) {
                if (this._scenes[i].name === name) {
                    this._activeScene.onDeactivate();
                    this._scenes[i].onActivate();
                    this._activeScene = this._scenes[i];
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
    }
    GE.SceneManager = SceneManager;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Time {
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
    Time._frameRate = 0;
    Time._frames = 0;
    Time._nextSecond = 1000;
    Time._lastTime = 0;
    GE.Time = Time;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Array {
        constructor() {
        }
        static isEmpty(array) {
            return array.length < 1;
        }
    }
    GE.Array = Array;
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
    function fileReader(path) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                xhttp.responseText;
            }
        };
        xhttp.open("GET", path, true);
        xhttp.send();
    }
    GE.fileReader = fileReader;
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
    }
    GE.Component = Component;
})(GE || (GE = {}));
/// <reference path="../gameObject/component.ts"/>
var GE;
(function (GE) {
    class SpriteRenderer extends GE.Component {
        start() {
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
        draw(shader) {
            let transformationsPosition = shader.getUniformLocation("transformation");
            GE.gl.uniformMatrix4fv(transformationsPosition, false, new Float32Array(GE.Matrix4.transformations(new GE.Vector2(1, -4)).data));
            let objectPositionPosition = shader.getUniformLocation("objectPosition");
            GE.gl.uniform2f(objectPositionPosition, 4, 3);
            GE.gl.uniform1i(shader.getUniformLocation("texture"), 0);
            this._buffer.bind();
            this._buffer.draw();
        }
    }
    GE.SpriteRenderer = SpriteRenderer;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class GameObject {
        constructor(name, scene) {
            this._transform = new GE.Transform();
            this._children = [];
            this.enabled = true;
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
        addChild(child) {
            // bug: can make a child of 2 parents
            child._parent = this;
            this._children.push(child);
        }
        removeChild(child) {
            let childIndex = this._children.indexOf(child);
            if (!(childIndex === -1)) {
                child._parent = undefined;
                this._children.splice(childIndex, 1);
            }
        }
        find(name) {
            for (let i = 0; i < this._children.length; i++) {
                if (this._children[i].name === name) {
                    return this._children[i];
                }
            }
        }
        start() {
            if (!this.enabled) {
                return;
            }
            for (let i = 0; i < this._components.length; i++) {
                this._components[i].start();
            }
            for (let i = 0; i < this._children.length; i++) {
                this._children[i].start();
            }
        }
        update() {
            if (!this.enabled) {
                return;
            }
            for (let i = 0; i < this._components.length; i++) {
                this._components[i].update();
            }
            for (let i = 0; i < this._children.length; i++) {
                this._children[i].update();
            }
        }
        render(shader) {
            if (!this.enabled) {
                return;
            }
            for (let i = 0; i < this._children.length; i++) {
                this._children[i].render(shader);
            }
        }
    }
    GE.GameObject = GameObject;
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
         */
        constructor(elementSize, dataType = GE.gl.FLOAT, targetBufferType = GE.gl.ARRAY_BUFFER, mode = GE.gl.TRIANGLES) {
            this._data = [];
            this._attributes = [];
            this._elementSize = elementSize;
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
            GE.gl.bufferData(this._targetBufferType, bufferData, GE.gl.STATIC_DRAW);
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
        static initialize() {
            let canvas = document.getElementById("canvas");
            if (canvas === undefined) {
                throw new Error("Cannot find canvas");
            }
            GE.gl = canvas.getContext("webgl");
            if (GE.gl === undefined) {
                throw new Error("Unable to initialize WebGL");
            }
            this.checkConstChanges();
            return canvas;
        }
        static checkConstChanges() {
            if (GE.gl.LINEAR != GE.Mipmap.linear) {
                console.log("linear mipmap number updated to: " + GE.gl.LINEAR);
            }
            if (GE.gl.NEAREST != GE.Mipmap.nearest) {
                console.log("linear mipmap number updated to: " + GE.gl.NEAREST);
            }
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
        constructor(imageSrc, mipmap, textureSlot) {
            this._textureSlot = textureSlot;
            this._texture = GE.gl.createTexture();
            this._image = new Image();
            this._image.onload = (e) => {
                GE.gl.bindTexture(GE.gl.TEXTURE_2D, this._texture);
                GE.gl.texImage2D(GE.gl.TEXTURE_2D, 0, GE.gl.RGB, GE.gl.RGB, GE.gl.UNSIGNED_BYTE, this._image);
                GE.gl.texParameteri(GE.gl.TEXTURE_2D, GE.gl.TEXTURE_WRAP_S, GE.gl.CLAMP_TO_EDGE);
                GE.gl.texParameteri(GE.gl.TEXTURE_2D, GE.gl.TEXTURE_WRAP_T, GE.gl.CLAMP_TO_EDGE);
                GE.gl.texParameteri(GE.gl.TEXTURE_2D, GE.gl.TEXTURE_MAG_FILTER, mipmap);
                GE.gl.texParameteri(GE.gl.TEXTURE_2D, GE.gl.TEXTURE_MIN_FILTER, mipmap);
            };
            this._image.src = imageSrc;
            GE.gl.activeTexture(GE.gl.TEXTURE0 + this._textureSlot);
            GE.gl.bindTexture(GE.gl.TEXTURE_2D, this._texture);
        }
        bind() {
            GE.gl.activeTexture(GE.gl.TEXTURE0 + this._textureSlot);
            GE.gl.bindTexture(GE.gl.TEXTURE_2D, this._texture);
        }
        destroy() {
            GE.gl.deleteTexture(this._texture);
        }
    }
    GE.Texture = Texture;
    let Mipmap;
    (function (Mipmap) {
        Mipmap[Mipmap["nearest"] = 9728] = "nearest";
        Mipmap[Mipmap["linear"] = 9729] = "linear";
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
    class Rectangle {
        constructor(name, width, height) {
            this._name = name;
            this._width = width;
            this._height = height;
            let vertecies = [
                0, 0, 0,
                this._width, 0, 0,
                0, this._height, 0,
                this._width, 0, 0,
                this._width, this._height, 0,
                0, this._height, 0
            ];
            this._buffer = new GE.GLBuffer(3);
            let positionAttribute = new GE.AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            positionAttribute.stride = 0;
            this._buffer.addAttribute(positionAttribute);
            this._buffer.pushData(vertecies);
            this._buffer.upload();
            this._buffer.unbind();
        }
        /**
         * render
         */
        draw() {
            this._buffer.bind();
            this._buffer.draw();
        }
    }
    GE.Rectangle = Rectangle;
})(GE || (GE = {}));
var GE;
(function (GE) {
    class Sprite {
        constructor(src, name, width, height) {
            this._name = name;
            this._scale = new GE.Vector2(width, height);
            this._texture = new GE.Texture(src, GE.Mipmap.linear, 0);
        }
        load() {
            let vertecies = [
                -0.5, -0.5, 0, 0,
                0.5, -0.5, 1, 0,
                -0.5, 0.5, 0, 1,
                0.5, 0.5, 1, 1,
                0.5, -0.5, 1, 0,
                -0.5, 0.5, 0, 1
            ];
            this._buffer = new GE.GLBuffer(3);
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
        draw() {
            this._buffer.bind();
            this._buffer.draw();
        }
    }
    GE.Sprite = Sprite;
})(GE || (GE = {}));
var GE;
(function (GE) {
    const sizeUnit = 200;
    class Matrix2 {
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
            return new Matrix2();
        }
        static projection(left, right, bottom, top) {
            let mat = new Matrix2();
            let leftRight = 1 / (left - right);
            let bottomTop = 1 / (bottom - top);
            mat._data[0] = (-sizeUnit) * leftRight;
            mat._data[3] = (-sizeUnit) * bottomTop;
            return mat;
        }
        static transformations(position) {
            let mat = new Matrix2();
            mat._data[12] = position.x;
            mat._data[13] = position.y;
            return mat;
        }
    }
    GE.Matrix2 = Matrix2;
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
