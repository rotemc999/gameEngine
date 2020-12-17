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
            this.loadShaders();
            this._shader.use();
            this.createBuffer();
            this.resize();
            this.update();
        }
        update() {
            GE.gl.clear(GE.gl.COLOR_BUFFER_BIT);
            this._buffer.bind();
            this._buffer.draw();
            GE.Time.update();
            if (this.run) {
                requestAnimationFrame(this.update.bind(this));
            }
        }
        resize() {
            if (this.canvas !== undefined) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                GE.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
            }
        }
        createBuffer() {
            let vertecies = [
                -0.5, -0.5, 0,
                0.5, -0.5, 0,
                -0.5, 0.5, 0,
                0.5, -0.5, 0,
                0.5, 0.5, 0,
                -0.5, 0.5, 0
            ];
            this._buffer = new GE.GLBuffer(3);
            let positionAttribute = new GE.AttributeInfo();
            positionAttribute.location = this._shader.getAttributeLocation("position");
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            positionAttribute.stride = 0;
            this._buffer.addAttribute(positionAttribute);
            let colorUniformLocation = this._shader.getUniformLocation("color");
            GE.gl.uniform4f(colorUniformLocation, 0, 1, 0, 1);
            this._buffer.pushData(vertecies);
            this._buffer.upload();
            this._buffer.unbind();
        }
        loadShaders() {
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
                GE.gl.vertexAttribPointer(attribute.location, attribute.size, this._dataType, normalized, attribute.stride, attribute.offset * this._typeSize);
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
            return canvas;
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
    class Vector2 {
        constructor(x, y) {
            this.limit = 0;
            this.x = x;
            this.y = y;
        }
        static get up() {
            return new Vector2(0, 1);
        }
        static get right() {
            return new Vector2(1, 0);
        }
        add(NewVector) {
            this.x += NewVector.x;
            this.y += NewVector.y;
            this.checkLimit();
            return this;
        }
        sub(NewVector) {
            this.x -= NewVector.x;
            this.y -= NewVector.y;
            this.checkLimit();
            return this;
        }
        multiply(number) {
            this.x *= number;
            this.y *= number;
            this.checkLimit();
            return this;
        }
        divide(number) {
            this.x /= number;
            this.y /= number;
            this.checkLimit();
            return this;
        }
        mag() {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        }
        setMag(number) {
            this.normalize();
            this.multiply(number);
            this.checkLimit();
        }
        normalize() {
            let VectorLength = this.mag();
            this.x /= VectorLength;
            this.y /= VectorLength;
            this.checkLimit();
        }
        checkLimit() {
            if (this.limit !== 0) {
                if (this.mag() > this.limit) {
                    this.setMag(this.limit);
                }
            }
        }
    }
    GE.Vector2 = Vector2;
})(GE || (GE = {}));
