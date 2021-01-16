namespace GE {
    export class ShaderManager {
        private static _shaders: { [name: string]: Shader } = {};
        private static _shaderSources: { [name: string]: { [name: string]: string } } = {}

        private constructor() { }

        public static getShader(name: string): Shader {
            return this._shaders[name];
        }

        public static loadShader(vertexFilePath: string, fragmentFilePath: string, name: string): void {
            fileReader(vertexFilePath, this.sourceCallback.bind(this), name + ".vertex");
            fileReader(fragmentFilePath, this.sourceCallback.bind(this), name + ".fragment");
            this._shaderSources[name] = {}
        }

        private static sourceCallback(source: string, name: string) {
            let nameSeperated: string[] = name.split(".");
            let shaderType: string = nameSeperated[nameSeperated.length - 1];
            nameSeperated.pop();
            name = nameSeperated.join(".");
            this._shaderSources[name][shaderType] = source;

            if (this._shaderSources[name].hasOwnProperty("vertex") && this._shaderSources[name].hasOwnProperty("fragment")) {
                this._shaders[name] = new Shader(name, this._shaderSources[name]["vertex"], this._shaderSources[name]["fragment"]);
                delete this._shaderSources[name];
            }
        }


    }
}