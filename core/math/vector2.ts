namespace GE {
    export class Vector2 {
        private x: number;
        private y: number;
        public limit: number = 0;
        public constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        public static get up(): Vector2 {
            return new Vector2(0, 1);
        }

        public static get right(): Vector2 {
            return new Vector2(1, 0);
        }

        public add(NewVector: Vector2) {
            this.x += NewVector.x;
            this.y += NewVector.y;
            this.checkLimit();
            return this;
        }
        public sub(NewVector: Vector2) {
            this.x -= NewVector.x;
            this.y -= NewVector.y;
            this.checkLimit();
            return this;
        }

        public multiply(number: number) {
            this.x *= number;
            this.y *= number;
            this.checkLimit();
            return this;
        }
        public divide(number: number) {
            this.x /= number;
            this.y /= number;
            this.checkLimit();
            return this;

        }

        public mag() {
            return Math.sqrt(this.x ** 2 + this.y ** 2);
        }
        public setMag(number: number) {
            this.normalize();
            this.multiply(number);
            this.checkLimit();
        }

        public normalize() {
            let VectorLength = this.mag();
            this.x /= VectorLength;
            this.y /= VectorLength;
            this.checkLimit();

        }

        private checkLimit() {
            if (this.limit !== 0) {
                if (this.mag() > this.limit) {
                    this.setMag(this.limit);
                }
            }
        }
    }
}