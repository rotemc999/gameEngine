namespace GE {
    const sizeUnit = 200;
    export class Matrix2x2 {
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


        public static identity(): Matrix2x2 {
            return new Matrix2x2();
        }

        public static projection(left: number, right: number, bottom: number, top: number, distance: number): Matrix2x2 {
            let mat: Matrix2x2 = new Matrix2x2();
            let leftRight: number = 1 / (left - right);
            let bottomTop: number = 1 / (bottom - top);
            if(distance > 1){
                distance = 1;
            }
        
            mat._data[0] = (-sizeUnit) * leftRight+(-sizeUnit) * leftRight * -distance;
            mat._data[3] = (-sizeUnit) * bottomTop + (-sizeUnit) * bottomTop * -distance;

            return mat;
        }

        public static rotation(angle: number): Matrix2x2 {
            let mat: Matrix2x2 = new Matrix2x2();
            let cos = Math.cos(angle);
            let sin = Math.sin(angle);
            mat._data = [
                cos, -sin,
                sin, cos
            ];

            return mat;
        }

        // not working
        public static multiply(matrix1: Matrix2x2, matrix2: Matrix2x2): Matrix2x2{
            let result: Matrix2x2 = new Matrix2x2();

            result._data[0] = matrix1._data[0] * matrix2._data[0] + matrix1._data[1] * matrix2._data[2];

            result._data[1] = matrix1._data[0] * matrix2._data[0] + matrix1._data[1] * matrix2._data[2];

            result._data[2] = matrix1._data[0] * matrix2._data[0] + matrix1._data[1] * matrix2._data[2];

            result._data[3] = matrix1._data[0] * matrix2._data[0] + matrix1._data[1] * matrix2._data[2];

            return result;
        }
    }
} 