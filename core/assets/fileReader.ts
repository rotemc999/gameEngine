namespace GE {
    export class FileReader{
        private _name: string;
        private _data: string;
        private _onload: Function = (filereader:FileReader)=>{};
        
        
        public constructor(path: string, name: string) {
            this._name = name;
            let request: XMLHttpRequest = new XMLHttpRequest();   
            request.open("GET", path);
            request.timeout = 4000;
            request.send(null);
            request.addEventListener("load", (e)=>{
                this._data = request.responseText;
                this._onload(this);
            });
            
            this._onload(this);
        }

        public get name(): string{
            return this._name;
        }

        public get data():string{
            return this._data;
        }

        public set onload(func: Function){
            this._onload = func;
        }
    }
}