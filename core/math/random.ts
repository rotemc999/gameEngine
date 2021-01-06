namespace GE {
    export class Random {
        private constructor() {

        }
        public static randint(min: number = 0, max: number): number {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        public static randfloat(min: number = 0, max: number): number {
            return Math.random() * (max - min) + min;
        }

        public static random(): number {
            return Math.random();
        }

        public static choice(array: any[]): any {
            return array[this.randint(0, array.length)]
        }

        public static shuffle(array: any[]): void {
            array = [...array];
            for (let i = array.length - 1; i > 0; i--) {
                let j = this.randint(0, i + 1);
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
    }
}