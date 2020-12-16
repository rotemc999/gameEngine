export class Window {
    #canvas;
    #width;
    #height;
    #gl;
    constructor() {
        this.#width = document.getElementById("body").clientWidth;
        this.#height = document.getElementById("body").clientHeight;

        this.#canvas = document.createElement("canvas");
        this.#canvas.width = this.#width;
        this.#canvas.height = this.#height;


        document.getElementById("body").appendChild(this.#canvas);

        this.#gl = this.#canvas.getContext('webgl');
    }
    get width() {
        return this.#width;
    }
    get height() {
        return this.#height;
    }

    getCanvas() {
        return this.#canvas;
    }


    get gl() {
        return this.#gl;
    }

    start() {
        this.velocity = 0;
        let gl = this.#gl;

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // ============================================
        //       compile and link the shaders
        //=============================================

        //load and compile the vertex shader
        vertexID = gl.createShader(gl.VERTEX_SHADER);
        // pass the shader source code to the GPU
        gl.shaderSource(vertexID, vertexShaderSrc);
        gl.compileShader(vertexID);

        // check for error in the compilation proccess
        let success = gl.getShaderParameter(vertexID, gl.COMPILE_STATUS);
        if (!success) {
            console.error("vertex shader compilition faild " + gl.getShaderInfoLog(vertexID));
            return;
        }


        //load and compile the fragment shader
        fragmentID = gl.createShader(gl.FRAGMENT_SHADER);
        // pass the shader source code to the GPU
        gl.shaderSource(fragmentID, fragmentShaderSrc);
        gl.compileShader(fragmentID);

        // check for error in the compilation proccess
        success = gl.getShaderParameter(fragmentID, gl.COMPILE_STATUS);
        if (!success) {
            console.error("fragment shader compilition faild " + gl.getShaderInfoLog(fragmentID));
            return;
        }


        //link shaders
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexID);
        gl.attachShader(shaderProgram, fragmentID);

        gl.linkProgram(shaderProgram);

        // check for linking errors
        success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
        if (!success) {
            console.error("linking of shaders faild " + gl.getProgramInfoLog(shaderProgram));
            return;
        }

        //let triangleVertexBufferObject = gl.createBuffer();
        //gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
        //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);


    }

    update() {
        let gl = this.#gl;
        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        let triangleVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

        let positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'vertPosition');
        let colorAttributeLocation = gl.getAttribLocation(shaderProgram, 'vertColor');
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);



        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.enableVertexAttribArray(colorAttributeLocation);


        gl.useProgram(shaderProgram);
        gl.drawArrays(gl.TRIANGLES, 0, 3);



        let number = Math.floor(Math.random() * 2);
        if (number === 0) {
            number = -1;
        }

        this.velocity += number;

        vertexArray[0] += Math.random() / 1000 * number;

    }


}


const vertexShaderSrc = `
precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;

varying vec3 fragColor;

void main(){
    fragColor = vertColor;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}
`;

const fragmentShaderSrc = `
precision mediump float;

varying vec3 fragColor;

void main(){
    gl_FragColor = vec4(fragColor, 1.0);
}
`;

let vertexID, fragmentID, shaderProgram;

let vertexArray = [
    0.0, 0.5, 1.0, 0.0, 0.0,
    -0.5, -0.5, 0.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 1.0
];
