/// <reference path="gameObject.ts"/>

namespace GE{
    export class MainCamera extends GameObject{
        private _projection: Matrix2x2;
        private _distance: number = 0;
        
        public start():void{    
        }

        public update():void{
        }

        public resize(): void{
            this._projection = Matrix2x2.projection(0, canvas.width, 0, canvas.height, this._distance);
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        public get projection():Matrix2x2{
            return this._projection;
        }

        public get distance(): number{
            return this._distance;
        }
        public set distance(distance: number){
            this._distance = distance;
            this.resize();
        }
    }
}