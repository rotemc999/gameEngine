

namespace GE {
    /**
     * the texture is a contaner for the image to use in the webgl
     */
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
        }

        /**
         * pass this texture to the gpu to proccess and rendering
         * @param textureSlot the texture slot to bind it to
         */
        public bind(textureSlot: number): void {
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            gl.activeTexture(gl.TEXTURE0 + textureSlot); 
        }

        /**
         * delete the texture from the gpu
         */
        public destroy(): void {
            gl.deleteTexture(this._texture);
        }
        /**
         * the size of the image
         */
        public get size(): Vector2{
            return new Vector2(this._image.width, this._image.height);
        }

        /**
         * the way the gpu resize the image
         */
        public get mipmap(): Mipmap{
            return this._mipmap;
        }

        /**
         * the way the gpu resize the image
         */
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

        /**
         * update the texture update the mipmap
         */
        public update(): void{
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, Renderer.getMipmapGlNumber(this._mipmap));
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, Renderer.getMipmapGlNumber(this._mipmap));
        }

        /**
         * the source of the image
         */
        public get src(): string{
            return this._image.src;
        }
    }
}