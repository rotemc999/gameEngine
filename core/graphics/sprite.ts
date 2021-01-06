namespace GE {
    export class Sprite {
        private _name: string;
        private _scale: Vector2;
        private _texture: Texture;

        private _buffer: GLBuffer;

        public constructor(src: string, name: string, width: number, height: number) {
            this._name = name;
            this._scale = new Vector2(width, height);
            this._texture = new Texture(src, Mipmap.linear, 0);
        }

        public load(): void {
            let vertecies: number[] = [
                -0.5, -0.5, 0, 0,
                0.5, -0.5, 1, 0,
                -0.5, 0.5, 0, 1,

                0.5, 0.5, 1, 1,
                0.5, -0.5, 1, 0,
                -0.5, 0.5, 0, 1
            ];
            this._buffer = new GLBuffer(3);

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
        public draw(): void {
            this._buffer.bind();
            this._buffer.draw();
        }
    }
}