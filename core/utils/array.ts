namespace GE {
    export function removeEmptyStrings(stringArray: string[]): string[] {
        let result: string[] = [];
        for (let i = 0; i < stringArray.length; i++) {
            if (!(stringArray[i] === "")) {
                result.push(stringArray[i]);
            }
        }
        return result;
    }

    export function contains(array: any[], item: any): boolean {
        return array.some(elem => {
            return JSON.stringify(elem) === JSON.stringify(item);
        });
    }

    export function indexof(array: any[], item: any): number {
        return array.findIndex(x => JSON.stringify(x) === JSON.stringify(item))
    }
}