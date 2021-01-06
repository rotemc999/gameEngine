namespace GE {
    export class Array {
        private constructor() {

        }

        public static isEmpty(array: any[]): boolean {
            return array.length < 1;
        }
    }


}