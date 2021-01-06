namespace GE {
    const sizeUnit = 200;
    export class Matrix4 {
        private _data: number[] = [];
        private constructor() {
            this._data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }

        public get data(): number[] {
            return this._data;
        }


        public static identity(): Matrix4 {
            return new Matrix4();
        }

        public static projection(left: number, right: number, bottom: number, top: number): Matrix4 {
            let mat: Matrix4 = new Matrix4();

            let leftRight: number = 1 / (left - right);
            let bottomTop: number = 1 / (bottom - top);



            mat._data[0] = (-sizeUnit) * leftRight;
            mat._data[5] = (-sizeUnit) * bottomTop;



            return mat;
        }


        public static transformations(position: Vector2): Matrix4 {
            let mat = new Matrix4();

            mat._data[12] = position.x;
            mat._data[13] = position.y;

            return mat;
        }
    }
}