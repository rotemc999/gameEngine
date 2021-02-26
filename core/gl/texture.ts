

namespace GE {
    export class Texture {
        private _texture: WebGLTexture;
        private _image: HTMLImageElement;
        private _textureSlot: number;
        private _mipmap: Mipmap;
        public constructor(image: string | HTMLImageElement, mipmap: Mipmap = Mipmap.auto) {
            this._mipmap = mipmap;
            this._texture = gl.createTexture() as WebGLTexture;

            if(typeof image === "string"){
                this._image = new Image();
                this._image.onload = (e) => {
                    this.setup();
                };
                this._image.src = image;
            }
            else{
                this._image = image;
                this.setup();
            }
            

            //gl.activeTexture(gl.TEXTURE0 + this._textureSlot);
            //gl.bindTexture(gl.TEXTURE_2D, this._texture);
        }


        public bind(textureSlot: number): void {
            gl.bindTexture(gl.TEXTURE_2D, this._texture);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, Renderer.getMipmapGlNumber(this._mipmap));
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, Renderer.getMipmapGlNumber(this._mipmap));

            gl.activeTexture(gl.TEXTURE0 + textureSlot);
            
            
        }

        public destroy(): void {
            gl.deleteTexture(this._texture);
        }

        public size(): Vector2{
            return new Vector2(this._image.width, this._image.height);
        }

        public get mipmap(): Mipmap{
            return this._mipmap;
        }

        public set mipmap(mipmap: Mipmap){
            this._mipmap = mipmap;
        }

        private setup(): void{
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, Renderer.getMipmapGlNumber(this._mipmap));
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, Renderer.getMipmapGlNumber(this._mipmap));
        }
    }
}