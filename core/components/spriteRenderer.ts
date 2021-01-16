/// <reference path="../gameObject/component.ts"/>

namespace GE {
    export class SpriteRenderer extends Component {
        private _texture: Texture = new Texture("spritesExamples/rectangle.png", Mipmap.linear, 0);
        private _buffer: GLBuffer;
        public color: Color = new Color(255, 255, 255, 255);

        public start(): void {
            //this._texture = new Texture("spritesExamples/rectangle.png", Mipmap.linear, 0);
            let vertecies: number[] = [
                -0.5, -0.5, 0, 0,
                0.5, -0.5, 1, 0,
                -0.5, 0.5, 0, 1,

                0.5, 0.5, 1, 1,
                0.5, -0.5, 1, 0,
                -0.5, 0.5, 0, 1
            ];
            
            // ofer
            
            this._buffer = new GLBuffer(3);

            // set buffer attributes
            let positionAttribute: AttributeInfo = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 2;
            positionAttribute.stride = 4;
            this._buffer.addAttribute(positionAttribute);

            let uvAttribute: AttributeInfo = new AttributeInfo();
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
        public render(shader: Shader): void {
            this._texture.bind();

            let tintPosition: WebGLUniformLocation = shader.getUniformLocation("tint");
            gl.uniform4fv(tintPosition, this.color.toArray());

            let positionPosition: WebGLUniformLocation = shader.getUniformLocation("position");
            gl.uniform2fv(positionPosition, this.transfrom.position.toArray());

            let rotationMatPosition: WebGLUniformLocation = shader.getUniformLocation("rotation");
            gl.uniformMatrix2fv(rotationMatPosition, false, Matrix2.rotation(this.transfrom.rotation).data);

            let scalePosition: WebGLUniformLocation = shader.getUniformLocation("scale");
            gl.uniform2fv(scalePosition, this.transfrom.scale.toArray());

            gl.uniform1i(shader.getUniformLocation("texture"), 0);

            this._buffer.bind();
            this._buffer.draw();
        }

        set texture(path: string) {
            this._texture = new Texture(path, Mipmap.linear, 0);
        }
    }
}
