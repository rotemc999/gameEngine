namespace GE {
    const sizeUnit = 200;
    export class Matrix2 {
        private _data: number[] = [];
        private constructor() {
            this._data = [
                1, 0,
                0, 1,
            ];
        }

        public get data(): number[] {
            return this._data;
        }


        public static identity(): Matrix2 {
            return new Matrix2();
        }

        public static projection(left: number, right: number, bottom: number, top: number): Matrix2 {
            let mat: Matrix2 = new Matrix2();
            let leftRight: number = 1 / (left - right);
            let bottomTop: number = 1 / (bottom - top);

            mat._data[0] = (-sizeUnit) * leftRight;
            mat._data[3] = (-sizeUnit) * bottomTop;

            return mat;
        }

        public static rotation(angle: number): Matrix2 {
            let mat: Matrix2 = new Matrix2();
            let cos = Math.cos(angle);
            let sin = Math.sin(angle);
            mat._data = [
                cos, -sin,
                sin, cos
            ];

            return mat;
        }
    }
} 