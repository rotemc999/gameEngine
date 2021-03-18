namespace GE{
    export class Objects{
        private constructor(){

        }

        /*
        example
        -----------


        {
            type: "", // the object name
            constructor: [

            ], // the constructor arguments
            properties: {

            }
        }

        
        */

        public static loadJson(source: string): Object{
            return this.load(JSON.parse(source));
        }

        public static load(source: any): Object{
            if(source.type === "String" || source.type === "Number" || source.type === "Boolean"){
                return source.value;
            }
            else if(source.type === "Array"){
                return this.loadArray(source.value);
            }
            else{
                return this.loadObject(source.value);
            }
        }

        private static loadObject(source: any): Object{
            let constructorData = this.loadArray(source.constructor);
            let object = eval(`new ${source.type}(...constructorData);`);

            for(let property in source.properties){
                if(property in object){
                    object[property] = this.load(source.properties[property]);
                }
            }

            return object;
        }



        private static loadArray(array: any[]): any[]{
            let result: any[] = [];
            for(let i = 0; i < array.length; i++){
                result.push(this.load(array[i]));
            }
            return result;
        }

        public static stringify(object: Object){
            return JSON.stringify(this.parse(object));
        }

        private static parse(property: any): any{
            console.log(property)
            if(Array.isArray(property)){
                return this.parseArray(property);
            }
            else if(typeof property === "object"){
                return this.parseObject(property)
            }
            else{
                return {
                    type: property.constructor.name,
                    value: property
                }
            }
        }


        private static parseObject(object: any){
            let properties: {[name:string]: any} = {};
            let result = {
                type: object.constructor.name,
                properties: properties
            };
            
            for(let property in object){
                properties[property] = this.parse(object[property]);
            }
            return result;
        }

        private static parseArray(array: any[]): any[]{
            let result: any[] = []
            for(let i = 0; i < array.length; i++){
                result.push(this.parse(array[i]))
            }
            return result;
        }
    }
}