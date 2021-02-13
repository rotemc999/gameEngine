namespace GE{

    const maxQuads = 10000;

    interface batchData{
        gameObject: GameObject; 
        vertexPositions: Vector2[];
        uvCoordinates: Vector2[];
        color: Color;
    }


    export class Batch{
        private _vertexBuffer: GLBuffer;
        private _indeciesBuffer: GLBuffer;
        private _data: batchData[] = [];
        //vertex: vertexPosition(x,y), u,v, position(x,y), rotation, scale(x,y), color(r,g,b,a), textureIndex
        public constructor(){

        }

        public start(){
            this._vertexBuffer = new GLBuffer(12, gl.DYNAMIC_DRAW);
            this._vertexBuffer.bind();

            this._indeciesBuffer = new GLBuffer(4, gl.STATIC_DRAW, gl.UNSIGNED_INT, gl.ELEMENT_ARRAY_BUFFER);
            this._indeciesBuffer.pushData(this.generateIndecies());

            
        }

        private generateIndecies(): number[]{
            let elements: number[] = new Array(maxQuads * 6);
            

            for(let i = 0; i < maxQuads; i++){
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
    }
}