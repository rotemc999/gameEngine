namespace GE{
    export class httpRequest{
        private _request: XMLHttpRequest;
        private _onload: Function = ()=>{};
        private _isloaded: boolean = false;

        public constructor(path: string){
            this._request = new XMLHttpRequest
            this._request.open("GET", path);
            this._request.timeout = 4000;
            this._request.send();
            this._request.addEventListener("load", (e)=>{
                console.log("hallo");
                this._isloaded = true;
                this._onload();
            });
            
        }

        private loadLoop():void{
            if(!this._isloaded){
                requestAnimationFrame(this.loadLoop.bind(this));
            }
        }
    }

}