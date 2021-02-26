namespace GE{

    export const batchMaxQuads = 10000;

    export interface BatchData{
        gameObject: GameObject; 
        sprite: Sprite;
        color: Color;
        id: number;
    }


    export class Batch{
        private _vertexBuffer: GLBuffer;
        private _indeciesBuffer: GLBuffer;
        private _data: BatchData[] = [];
        private _textures: Texture[] = [];
        public constructor(){
            this._vertexBuffer = new GLBuffer(12, gl.DYNAMIC_DRAW);
            this._vertexBuffer.bind();

            this._indeciesBuffer = new GLBuffer(4, gl.STATIC_DRAW, gl.UNSIGNED_INT, gl.ELEMENT_ARRAY_BUFFER);
            this._indeciesBuffer.pushData(this.generateIndecies());
        }

        public add(data: BatchData){
            if(this._data.length < batchMaxQuads){
                for(let i = 0; i < this._textures.length; i++){
                    if(this._textures[i] == data.sprite.texture){
                        this._data.push(data);
                        return;
                    }
                }
                if(this._textures.length < GLUtilties.maxTextures){
                    this._textures.push(data.sprite.texture);
                    this._data.push(data);
                }
            }
        }

        public remove(id: number){
            this._data.slice(id, 1);
        }

        public modify(id: number, color: Color): void{
            this._data[id].color = color;
        }


        private generateIndecies(): number[]{
            let elements: number[] = new Array(batchMaxQuads * 6);
            

            for(let i = 0; i < batchMaxQuads; i++){
                // 6 cause in 1 quad there are 6 indecies
                let indexOffset: number = i * 6;
                // 4 cause in 1 quad there are 4 vertecies 
                let vertexOffset: number = i * 4;
                
                // triangle 1
                elements[indexOffset] = vertexOffset + 3;
                elements[indexOffset + 1] = vertexOffset + 2;
                elements[indexOffset + 2] = vertexOffset;

                // triangle 3
                elements[indexOffset + 3] = vertexOffset + 2;
                elements[indexOffset + 4] = vertexOffset;
                elements[indexOffset + 5] = vertexOffset + 1;
            }

            return elements;
        }   

        public render(){
            
        }


        
        public hasQuadRoom(): boolean{
            return this._data.length < batchMaxQuads;
        }

        public canRenderSprite(sprite: Sprite): boolean{
            for(let i = 0; i < this._textures.length; i++){
                if(this._textures[i] == sprite.texture){
                    return true;
                }
            }
            if(this._textures.length < GLUtilties.maxTextures){
                return true;
            }
            return false;
        }

        public get numberOfQuads(): number{
            return this._data.length;
        }
    }
}