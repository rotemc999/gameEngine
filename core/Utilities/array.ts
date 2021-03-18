namespace GE {
    export class ArrayUtil {
        private constructor() {

        }

        public static isEmpty(array: any[]): boolean {
            return array.length < 1;
        }
        public static removeEmptyStrings(stringArray: string[]): string[] {
            let result: string[] = [];
            for (let i = 0; i < stringArray.length; i++) {
                if (!(stringArray[i] === "")) {
                    result.push(stringArray[i]);
                }
            }
            return result;
        }
    
        public static contains(array: any[], item: any): boolean {
            return array.some(elem => {
                return JSON.stringify(elem) === JSON.stringify(item);
            });
        }
    
        public static indexof(array: any[], item: any): number {
            return array.findIndex(x => JSON.stringify(x) === JSON.stringify(item))
        }
    }
}