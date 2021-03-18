namespace GE{
    export class SpriteRenderer extends Component{
        private _sprite: string;
        private _batchID: BatchID | null;
        private _color: Color = Color.white();
        private _layer: string = "background";
        private _orderInLayer: number = 0;

        public start(){

        }

        public update(): void{
            Renderer.modifyPosition(this._batchID as BatchID, this.transfrom.position);
            Renderer.modifyRotation(this._batchID as BatchID, this.transfrom.rotation);
            Renderer.modifyScale(this._batchID as BatchID, this.transfrom.scale);
        }

        public onEnable(): void{
            if(this.gameObject.enabled === true && (this._batchID === undefined || this._batchID === null)){
                this._batchID = Renderer.add(this.getBatchData());
            }
            else if(!(this._batchID === undefined || this._batchID === null)){
                Renderer.remove(this._batchID);
                this._batchID = null;
            }
        }


        public set sprite(path: string){
            this._sprite = path;
            if(this.gameObject.enabled === true){
                if(!(this._batchID === undefined || this._batchID === null)){
                    Renderer.remove(this._batchID);
                }

                this._batchID = Renderer.add(this.getBatchData());
            }
        }
    
        public get sprite(): string{
            return this._sprite;
        }

        public get color(): Color{
            return this._color;
        }

        public set color(color: Color){
            this._color = color;
            if(!(this._batchID === undefined || this._batchID === null)){
                Renderer.modifyColor(this._batchID as BatchID, color);
            }
        }

        private getBatchData(): BatchData{
            return {
                position: this.gameObject.transform.position,
                rotation: this.gameObject.transform.rotation,
                scale: this.gameObject.transform.scale,
                sprite: Renderer.getSprite(this._sprite),
                color: this.color,
                layer: this.layer,
                orderInLayer: this.orderInLayer
            };
        }


        public get layer(): string{
            return this._layer;
        }
        public set layer(layer: string){
            this._layer = layer;
        }

        public get orderInLayer(): number{
            return this._orderInLayer;
        }
        public set orderInLayer(orderInLayer: number){
            if(orderInLayer >= maxLayerOrderNumber || orderInLayer < 0){
                throw new Error("Range Error: order in layer is outside the range.");
            }
            this._orderInLayer = orderInLayer;
        }
        
    }
}