namespace GE{

    export const batchMaxQuads = 10000;
    const verteciesNumber = 6;
    const elementSize = 15;
    const quadData: number[][] = [
        [-0.5, -0.5, 0, 0],
        [ 0.5, 0.5, 1, 1],
        [0.5, -0.5, 1, 0],
        [-0.5, 0.5, 0, 1],
        [ 0.5, 0.5, 1, 1],
        [-0.5, -0.5, 0, 0]
    ];

    export interface BatchData{
        position: Vector2;
        rotation: number;
        scale: Vector2;
        sprite: Sprite;
        color: Color;
        layer: string;
        orderInLayer: number;
    }

    export interface BatchID{
        id: number;
    }


    export class Batch{
        private _vertexBuffer: GLBuffer;
        private _indeciesBuffer: GLBuffer;
        private _ids: BatchID[] = [];
        private _vertexData: number[] = [];
        private _textures: Texture[] = [];

        public constructor(shader: Shader){
            this._vertexBuffer = new GLBuffer(elementSize, gl.DYNAMIC_DRAW);
            this._vertexBuffer.bind();

            //set up all of the attributes
            // the vertex position
            let vertexPositionAttribute = new AttributeInfo();
            vertexPositionAttribute.location = shader.getAttributeLocation("vertexPosition");
            vertexPositionAttribute.offset = 0;
            vertexPositionAttribute.size = 2;
            this._vertexBuffer.addAttribute(vertexPositionAttribute);

            // the uv of the image
            let textureCorrdinatesAttribute = new AttributeInfo();
            textureCorrdinatesAttribute.location = shader.getAttributeLocation("v_uv");
            textureCorrdinatesAttribute.offset = 2;
            textureCorrdinatesAttribute.size = 2;
            this._vertexBuffer.addAttribute(textureCorrdinatesAttribute);

            // the texture number in the sampler array
            let textureIndexAttribute = new AttributeInfo();
            textureIndexAttribute.location = shader.getAttributeLocation("v_textureIndex");
            textureIndexAttribute.offset = 4;
            textureIndexAttribute.size = 1;
            this._vertexBuffer.addAttribute(textureIndexAttribute);

            // the layer the object is in
            let layerAttribute = new AttributeInfo();
            layerAttribute.location = shader.getAttributeLocation("layer");
            layerAttribute.offset = 5;
            layerAttribute.size = 1;
            this._vertexBuffer.addAttribute(layerAttribute);

            // the tint of the object
            let tintAttribute = new AttributeInfo();
            tintAttribute.location = shader.getAttributeLocation("v_tint");
            tintAttribute.offset = 6;
            tintAttribute.size = 4;
            this._vertexBuffer.addAttribute(tintAttribute);

            // the object position            
            let positionAttribute = new AttributeInfo();
            positionAttribute.location = shader.getAttributeLocation("position");
            positionAttribute.offset = 10;
            positionAttribute.size = 2;
            this._vertexBuffer.addAttribute(positionAttribute);

            // the object scale
            let scaleAttribute = new AttributeInfo();
            scaleAttribute.location = shader.getAttributeLocation("scale");
            scaleAttribute.offset = 12;
            scaleAttribute.size = 2;
            this._vertexBuffer.addAttribute(scaleAttribute);

            // the object rotation
            let rotationAttribute = new AttributeInfo();
            rotationAttribute.location = shader.getAttributeLocation("rotation");
            rotationAttribute.offset = 14;
            rotationAttribute.size = 1;
            this._vertexBuffer.addAttribute(rotationAttribute);
            

            
            
        }

        /**
         * add an object to the batch
        * @param data the batch data of an objects
        */
        public add(data: BatchData, id: BatchID){
            // chacking 
            if(this._ids.length < batchMaxQuads){
                for(let i = 0; i < this._textures.length; i++){
                    if(this._textures[i] == data.sprite.texture){
                        this._ids.push(id);
                        this._vertexData.push(...this.getQuadData(data));
                        return;
                    }
                }
                if(this._textures.length < GLUtilties.maxTextures){
                    this._textures.push(data.sprite.texture);
                    this._ids.push(id);
                    this._vertexData.push(...this.getQuadData(data));
                }
            }
        }

        /**
         * remove the object data from the batch
         * @param data the batch data is required to identify where the object location is
         */
        public remove(id: BatchID){
            let index = this._ids.indexOf(id);
            this._ids.slice(index, 1);
            this._vertexData.slice(index * elementSize * verteciesNumber,elementSize * verteciesNumber);
        }

        private getVertexArrayPosition(batchId: BatchID): number{
            return this._ids.indexOf(batchId) * elementSize * verteciesNumber;
        }

        public modifyColor(batchId: BatchID, color: Color): void{
            let colorArray = color.toArray();
            let index = this.getVertexArrayPosition(batchId);
            for(let i = index; i < index + verteciesNumber * elementSize; i += elementSize){
                this._vertexData[i + 6] = colorArray[0];
                this._vertexData[i + 7] = colorArray[1];
                this._vertexData[i + 8] = colorArray[2];
                this._vertexData[i + 9] = colorArray[3];
            }
        }

        
        public modifyPosition(batchId: BatchID, position: Vector2): void{
            let positionArray = position.toArray();
            let index = this.getVertexArrayPosition(batchId);
            for(let i = index; i < index + verteciesNumber * elementSize; i += elementSize){
                this._vertexData[i + 10] = positionArray[0];
                this._vertexData[i + 11] = positionArray[1];
            }
        }
        
        public modifyRotation(batchId: BatchID, rotation: number): void{
            let index = this.getVertexArrayPosition(batchId);
            for(let i = index; i < index + verteciesNumber * elementSize; i += elementSize){
                this._vertexData[i + 14] = rotation;
            }
        }
        
        public modifyScale(batchId: BatchID, scale: Vector2): void{
            let scaleArray = scale.toArray();
            let index = this.getVertexArrayPosition(batchId);
            for(let i = index; i < index + verteciesNumber * elementSize; i += elementSize){
                this._vertexData[i + 12] = scaleArray[0];
                this._vertexData[i + 13] = scaleArray[1];
            }
        }
        
        public render(shader: Shader){
            /*
            for(let i = 0; i < this._ids.length; i++){
                console.log(this._ids[i].sprite.texture);
            }*/
            //this.prepareData();
            this._vertexBuffer.pushData(this._vertexData);

            this._vertexBuffer.upload();
            //this._indeciesBuffer.upload();

            let samplers: number[] = [];
            for(let i = 0; i < this._textures.length; i++){
                this._textures[i].bind(i);
                samplers.push(i);
            }
            gl.uniform1iv(shader.getUniformLocation("textures"), samplers);

            gl.uniform1i(shader.getUniformLocation("textureNumber"), samplers.length);


            this._vertexBuffer.bind();
            //this._indeciesBuffer.bind();
            
            this._vertexBuffer.draw();

            this._vertexBuffer.unbind();
            //this._indeciesBuffer.unbind();
            
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

                // triangle 2   
                elements[indexOffset + 3] = vertexOffset;
                elements[indexOffset + 4] = vertexOffset + 1;
                elements[indexOffset + 5] = vertexOffset + 3;

                
                
            }
            return elements;
        }

        private getQuadData(batchData: BatchData): number[]{
            let vertexData = [];
            for(let j = 0; j < verteciesNumber; j++){
                vertexData.push(...quadData[j]); // vertex position and uv. note: uv is temporery
                //vertexData.push(batchData.sprite)
                vertexData.push(this._textures.indexOf(batchData.sprite.texture)); // texture index
                vertexData.push(Renderer.getLayerIndex(batchData.layer, batchData.orderInLayer));
                vertexData.push(...batchData.color.toArray()); //color
                vertexData.push(...batchData.position.toArray()); // position
                vertexData.push(...batchData.scale.toArray()); //scale
                vertexData.push(batchData.rotation); //rotation
            }
            return vertexData;  
        }


        public removeData(): void{
            this._ids = [];
            this._vertexData = [];
        }

        
        public hasQuadRoom(): boolean{
            return this._ids.length < batchMaxQuads;
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
    }
}