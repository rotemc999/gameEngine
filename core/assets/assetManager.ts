namespace GE{
    export class AssetManager{
        private static _assets: {[path: string]: any} = {};

        private constructor(){}

        public static start(): void{
            
        }
        public static update(): void{}

        public static putAssetData(path: string, data: any): void{
            this._assets[path] = data;
        }

        public static getAssetData(name: string): any{
            return this._assets[name];
        }

    }
}