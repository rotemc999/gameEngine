namespace GE {
    export class Shader {
        private _program: WebGLProgram;
        private _name: string;

        /**
         * Creates a new shader.
         * @param name The name of the shader for error handeling.
         * @param vertexSrc The vertex shader source code.
         * @param fragmentSrc The fragment shader source code.
         */
        public constructor(name: string, vertexSrc: string, fragmentSrc: string) {
            this._name = name;

            let vertexShader: WebGLShader = this.loadShader(gl.VERTEX_SHADER, vertexSrc);
            let fragmentShader: WebGLShader = this.loadShader(gl.FRAGMENT_SHADER, fragmentSrc);

            this._program = this.loadProgram(vertexShader, fragmentShader);
        }

        private loadShader(shadertype: number, shaderSrc: string): WebGLShader {
            let shader: WebGLShader = gl.createShader(shadertype) as WebGLShader;
            gl.shaderSource(shader, shaderSrc);
            gl.compileShader(shader);

            let error = gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error("Shader compilition faild '" + this._name + "': " + error);
            }

            return shader;
        }

        private loadProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
            let program = gl.createProgram() as WebGLProgram;

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);

            gl.linkProgram(program);
            let error = gl.getProgramInfoLog(program);
            if (error !== "") {
                throw new Error("Program Linking faild '" + this._name + "': " + error);
            }

            return program;
        }

        /**
         * Use the shader.
         */
        public use(): void {
            gl.useProgram(this._program);
        }


        /**
         * The name of the shader.
         */
        public get name(): string {
            return this._name;
        }


        public setAttribute(name: string, buffer: GLBuffer,): void {
            let attributeLocation: number = gl.getAttribLocation(this._program, name);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            //gl.vertexAttribPointer();
        }

        public getAttributeLocation(name: string): number {
            let attributeLocation: number = gl.getAttribLocation(this._program, name);
            if (attributeLocation === -1) {
                throw new Error("Unable to find attribute named '" + name + "' in shader named '" + this._name + "'");
            }
            return attributeLocation;
        }

        public getUniformLocation(name: string): WebGLUniformLocation {
            let attributeLocation: WebGLUniformLocation = gl.getUniformLocation(this._program, name) as WebGLUniformLocation;
            if (attributeLocation === null) {
                throw new Error("Unable to find uniform named '" + name + "' in shader named '" + this._name + "'");
            }
            return attributeLocation;
        }

    }
}