/// <reference path="gameObject.ts"/>

namespace GE{
    export class MainCamera extends GameObject{
        private _projection: Matrix2x2;
        
        public start():void{    
        }

        public update():void{

        }

        public resize(): void{
            this._projection = Matrix2x2.projection(0, canvas.width, 0, canvas.height);
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        public get projection():Matrix2x2{
            return this._projection;
        }
    }
}