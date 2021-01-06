

namespace GE {
    export class Texture {
        private _texture: WebGLTexture;
        private _image: HTMLImageElement;
        private _textureSlot: number;
        public constructor(imageSrc: string, mipmap: Mipmap, textureSlot: number) {
            this._textureSlot = textureSlot;
            this._texture = gl.createTexture() as WebGLTexture;
            this._image = new Image();

            this._image.onload = (e) => {
                gl.bindTexture(gl.TEXTURE_2D, this._texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this._image);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mipmap);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipmap);

            };

            this._image.src = imageSrc;

            gl.activeTexture(gl.TEXTURE0 + this._textureSlot);
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
        }


        public bind(): void {
            gl.activeTexture(gl.TEXTURE0 + this._textureSlot);
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
        }

        public destroy(): void {
            gl.deleteTexture(this._texture);
        }
    }

    export enum Mipmap {
        nearest = 9728,
        linear = 9729,

    };
}