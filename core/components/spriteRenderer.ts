/// <reference path="../gameObject/component.ts"/>

namespace GE {
    export class SpriteRenderer extends Component {
        private _texture: Texture;
        private _buffer: GLBuffer;

        public start(): void {
            let vertecies: number[] = [
                -0.5, -0.5, 0, 0,
                0.5, -0.5, 1, 0,
                -0.5, 0.5, 0, 1,

                0.5, 0.5, 1, 1,
                0.5, -0.5, 1, 0,
                -0.5, 0.5, 0, 1
            ];
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
        public draw(shader: Shader): void {
            let transformationsPosition: WebGLUniformLocation = shader.getUniformLocation("transformation");
            gl.uniformMatrix4fv(transformationsPosition, false, new Float32Array(Matrix4.transformations(new Vector2(1, -4)).data));

            let objectPositionPosition: WebGLUniformLocation = shader.getUniformLocation("objectPosition");
            gl.uniform2f(objectPositionPosition, 4, 3);

            gl.uniform1i(shader.getUniformLocation("texture"), 0);


            this._buffer.bind();
            this._buffer.draw();
        }
    }
}