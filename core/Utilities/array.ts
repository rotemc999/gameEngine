namespace GE {
    export class ArrayUtil {
        private constructor() {

        }

        public static isEmpty(array: any[]): boolean {
            return array.length < 1;
        }
    }


    export class Array extends window.Array{
        public constructor(length?: number){
            super(length);
        }

        public isEmpty(): boolean{
            return super.length < 1;
        }

        public remove(index: number): void{
            console.log(index);
            console.log(super.slice(index, index + 1));
            console.log(super.toString());
        }

        public removeEmptyStrings(): void{
            let i = 0;
            while (super.length > i){
                if(super[i] === ""){
                    this.remove(i);
                }
                else{
                    i++;
                }
            }
        }
    }


}