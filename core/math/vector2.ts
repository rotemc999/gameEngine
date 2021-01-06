namespace GE {
    export class Vector2 {
        private _x: number;
        private _y: number;
        public constructor(x: number, y: number) {
            this._x = x;
            this._y = y;
        }

        public static get up(): Vector2 {
            return new Vector2(0, 1);
        }
        public static get down(): Vector2 {
            return new Vector2(0, -1);
        }

        public static get right(): Vector2 {
            return new Vector2(1, 0);
        }
        public static get left(): Vector2 {
            return new Vector2(-1, 0);
        }


        public get x(): number {
            return this._x;
        }
        public set x(x: number) {
            this._x = x;
        }
        public get y(): number {
            return this._y;
        }
        public set y(y: number) {
            this._y = y;
        }


        public add(NewVector: Vector2) {
            this._x += NewVector.x;
            this._y += NewVector.y;
            return this;
        }
        public sub(NewVector: Vector2) {
            this._x -= NewVector.x;
            this._y -= NewVector.y;
            return this;
        }

        public multiply(number: number) {
            this._x *= number;
            this._y *= number;
            return this;
        }
        /*
        public multiply(vector: Vector2) {
            this._x *= vector.x;
            this._y *= vector.y;
            return this;
        }*/
        public divide(number: number) {
            this._x /= number;
            this._y /= number;
            return this;

        }

        public mag(): number {
            return Math.sqrt(this._x ** 2 + this._y ** 2);
        }
        public setMag(number: number): void {
            this.normalize();
            this.multiply(number);
        }

        public normalize() {
            let VectorLength = this.mag();
            this._x /= VectorLength;
            this._y /= VectorLength;

        }

        public toArray(): number[] {
            return [this._x, this._y];
        }
    }
}