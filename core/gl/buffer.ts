namespace GE {
    export class GLBuffer {
        private _elementSize: number;
        private _stride: number;
        private _dataType: number;
        private _buffer: WebGLBuffer;
        private _targetBufferType: number;
        private _mode: number;
        private _typeSize: number;

        private _data: number[] = [];
        private _attributes: AttributeInfo[] = [];

        /**
         * Create a new GL buffer.
         * @param elementSize the size of each element in this buffer.
         * @param dataType the type of each element in this buffer
         * @param targetBufferType the type of the buffer
         * @param mode the drawing mode of the buffer
         */
        public constructor(elementSize: number, dataType: number = gl.FLOAT, targetBufferType: number = gl.ARRAY_BUFFER, mode: number = gl.TRIANGLES) {
            this._elementSize = elementSize;
            this._dataType = dataType;
            this._targetBufferType = targetBufferType;
            this._mode = mode;

            //Determine byte size
            switch (this._dataType) {
                case gl.FLOAT:
                case gl.INT:
                case gl.UNSIGNED_INT:
                    this._typeSize = 4;
                    break;
                case gl.SHORT:
                case gl.UNSIGNED_SHORT:
                    this._typeSize = 2;
                    break;
                case gl.BYTE:
                case gl.UNSIGNED_BYTE:
                    this._typeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognized data type: " + dataType.toString());
            }
            //this._stride = this._elementSize * this._typeSize;

            this._buffer = gl.createBuffer() as WebGLBuffer;
        }

        /**
         * Delete the buffer.
         */
        public destroy(): void {
            gl.deleteBuffer(this._buffer);
        }

        /**
         * Binds the buffer;
         * @param normalized Specifiy if the data should be normalized.
         */
        public bind(normalized: boolean = false): void {
            gl.bindBuffer(this._targetBufferType, this._buffer);

            for (let attribute of this._attributes) {
                gl.vertexAttribPointer(attribute.location, attribute.size, this._dataType, normalized, attribute.stride, attribute.offset * this._typeSize);
                gl.enableVertexAttribArray(attribute.location);
            }
        }

        /**
         * Unbinds this buffer.
         */
        public unbind(): void {
            for (let attribute of this._attributes) {
                gl.disableVertexAttribArray(attribute.location);
            }
            gl.bindBuffer(this._targetBufferType, null);
        }

        public addAttribute(attribute: AttributeInfo): void {
            this._attributes.push(attribute);
        }

        public pushData(data: number[]): void {
            for (let d of data) {
                this._data.push(d);
            }
        }

        public upload(): void {
            gl.bindBuffer(this._targetBufferType, this._buffer);

            let bufferData: ArrayBuffer = new Float32Array(this._data);
            switch (this._dataType) {
                case gl.FLOAT:
                    bufferData = new Float32Array(this._data);
                    break;
                case gl.INT:
                    bufferData = new Int32Array(this._data);
                    break;
                case gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this._data);
                    break;
                case gl.SHORT:
                    bufferData = new Int16Array(this._data);
                    break;
                case gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this._data);
                    break;
                case gl.BYTE:
                    bufferData = new Int8Array(this._data);
                    break;
                case gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this._data);
                    break;
            }

            gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW);
        }

        public draw(): void {
            if (this._targetBufferType === gl.ARRAY_BUFFER) {
                gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
            }
            else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
                gl.drawElements(this._mode, this._data.length, this._dataType, 0);
            }
        }
    }

    /**
     * The info for attributes in the buffer
     */
    export class AttributeInfo {
        /**
         * The location of the attribute.
         */
        public location: number;
        /**
         * The number of elements in this attribute.
         */
        public size: number;
        /**
         * The number of elements from the begining of the buffer.
         */
        public offset: number;
        /**
         * The number of elements between every start of the attribute.
         */
        public stride: number;
    }
}