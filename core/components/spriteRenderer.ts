namespace GE{
    export class SpriteRenderer extends Component{
        private _sprite: string;
        private _batchDataId: number;
        private _color: Color = Color.white();

        public start(){

        }

        public update(): void{

        }


        public set sprite(path: string){
            this._sprite = path;
            if(!this._batchDataId === undefined){
                Renderer.remove(this._batchDataId);
            }
            let data = Renderer.add(path, this.gameObject, this._color);
            this._batchDataId = data.id;
        }
    
        public get sprite(): string{
            return this._sprite;
        }
        
    }
}