namespace GE {
    export class Color {
        private _r: number;
        private _g: number;
        private _b: number;
        private _a: number;

        public constructor(r: number, g: number, b: number, a: number) {
            this._r = r;
            this._g = g;
            this._b = b;
            this._a = a;
        }

        public get r(): number {
            return this._r;
        }
        public set r(value: number) {
            this._r = value;
        }

        public get g(): number {
            return this._g;
        }
        public set g(value: number) {
            this._g = value;
        }

        public get b(): number {
            return this._b;
        }
        public set b(value: number) {
            this._b = value;
        }

        public get a(): number {
            return this._a;
        }
        public set a(value: number) {
            this._a = value;
        }


        public static black(): Color {
            return new Color(0, 0, 0, 255);
        }
        public static white(): Color {
            return new Color(255, 255, 255, 255);
        }
        public static red(): Color {
            return new Color(255, 0, 0, 255);
        }
        public static orange(): Color {
            return new Color(255, 165, 0, 255);
        }
        public static yellow(): Color {
            return new Color(255, 255, 0, 255);
        }
        public static green(): Color {
            return new Color(0, 150, 0, 255);
        }
        public static lime(): Color {
            return new Color(191, 255, 0, 255);
        }
        public static blue(): Color {
            return new Color(0, 0, 255, 255);
        }
        public static lightBlue(): Color {
            return new Color(0, 210, 255, 255);
        }
        public static purple(): Color {
            return new Color(132, 0, 255, 255);
        }
        public static pink(): Color {
            return new Color(255, 153, 204, 255);
        }
        public static brown(): Color {
            return new Color(150, 75, 0, 255);
        }
        public static magenta(): Color {
            return new Color(255, 0, 255, 255);
        }
        public static tan(): Color {
            return new Color(210, 180, 255, 255);
        }
        public static cyan(): Color {
            return new Color(0, 255, 255, 255);
        }
        public static olive(): Color {
            return new Color(128, 128, 0, 255);
        }
        public static maroon(): Color {
            return new Color(128, 0, 0, 255);
        }
        public static navy(): Color {
            return new Color(0, 0, 128, 255);
        }
        public static aquamarine(): Color {
            return new Color(127, 255, 212, 255);
        }
        public static turquoise(): Color {
            return new Color(64, 224, 208, 255);
        }
        public static silver(): Color {
            return new Color(192, 192, 192, 255);
        }
        public static teal(): Color {
            return new Color(0, 128, 128, 255);
        }
        public static indigo(): Color {
            return new Color(111, 0, 255, 255);
        }


    }
}