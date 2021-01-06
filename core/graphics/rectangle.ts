namespace GE {
    export class Rectangle {
        private _name: string;
        private _width: number;
        private _height: number;

        private _buffer: GLBuffer;

        public constructor(name: string, width: number, height: number) {
            this._name = name;
            this._width = width;
            this._height = height;
            let vertecies = [
                0, 0, 0,
                this._width, 0, 0,
                0, this._height, 0,

                this._width, 0, 0,
                this._width, this._height, 0,
                0, this._height, 0
            ];
            this._buffer = new GLBuffer(3);

            let positionAttribute: AttributeInfo = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            positionAttribute.stride = 0;
            this._buffer.addAttribute(positionAttribute);


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