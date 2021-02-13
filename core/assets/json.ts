namespace GE{
    export class Json{
        private constructor(){}

        public static load(src:string): any{
            return JSON.parse(src);
        }

        public static dump(jsonObj: any): void{
            JSON.stringify(jsonObj);
        }
    }
}