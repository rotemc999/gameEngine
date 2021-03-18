namespace GE{



    export class Renderer{
        private static _batches: Batch[];
        public static mipmap: Mipmap;
        private static _textures: {[path: string]:Texture} = {};
        private static _sprites: {[path: string]:Sprite} = {};
        private static _layers: {[name: string]: number} = {};
        private static _quads: number = 0;
        private static _shader: Shader;
        private constructor(){}



        public static start(shader: Shader): void{
            gl.clearColor(0, 0, 0, 1);
            this._shader = shader;
            this._batches = [new Batch(this._shader)];
        }

        public static add(batchData: BatchData): BatchID{
            this._quads++;
            for(let i = 0; i < this._batches.length; i++){
                if(this._batches[i].hasQuadRoom() && this._batches[i].canRenderSprite(batchData.sprite)){
                    let batchId = {
                        id: i
                    }
                    this._batches[i].add(batchData, batchId);
                    return batchId; 
                }
            }
            this._batches.push(new Batch(this._shader));
            let batchId = {
                id: this._batches.length-1
            };
            this._batches[this._batches.length -1].add(batchData, batchId);
            return batchId;
        }

        public static remove(batchId: BatchID): void{
            this._batches[batchId.id].remove(batchId);
            this._quads--;
        }

        public static render(): void{
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            //gl.clear(gl.DEPTH_BUFFER_BIT);
            this._shader.use();

            let projectionPosition: WebGLUniformLocation = this._shader.getUniformLocation("projection");
            gl.uniformMatrix2fv(projectionPosition, false, new Float32Array(SceneManager.activeScene.camera.projection.data));

            let cameraPositionPosition: WebGLUniformLocation = this._shader.getUniformLocation("cameraPosition");
            gl.uniform2fv(cameraPositionPosition, new Float32Array(SceneManager.activeScene.camera.transform.position.toArray()));

            let cameraRotationPosition: WebGLUniformLocation = this._shader.getUniformLocation("cameraRotation");
            gl.uniform1f(cameraRotationPosition, SceneManager.activeScene.camera.transform.rotation);

            for(let texture in this._textures){
                this._textures[texture].update();
            }

            this._batches.forEach(batch => {
                batch.render(this._shader);
            });
        }

        public static getSprite(path: string): Sprite{
            // getting already loaded sprite
            if(path in this._sprites){
                return this._sprites[path];
            }
            // if the sprite doesnt exits it will try to create a new one from the assets data
            let spriteData = AssetManager.getAssetData(path);
            if(spriteData === undefined){
                throw new Error("the sprite sheet '"+path+"' was not found in the imported files");
            }

            let texture;
            if(spriteData.texture in this._textures){
                texture = this._textures[spriteData.texture];
            }
            else{
                let textureImg = AssetManager.getAssetData(spriteData.texture);
                if(!(textureImg === undefined)){
                    texture = new Texture(textureImg);
                }
                else{
                    throw new Error("the sprite sheet's image '"+spriteData.texture+"' was not found in the imported files");
                }
            }

            let uv = {
                "position": new Vector2(0,0),
                "size": texture.size
            };
            if("uv" in spriteData){
                if("position" in spriteData.uv){
                    if("x" in spriteData.uv.position && "y" in spriteData.uv.position){
                        uv.position = new Vector2(spriteData.uv.position.x, spriteData.uv.position.y);
                    }
                    else{
                        throw new Error("Error in the sprite sheet's uv position.");
                    }
                }
                if("size" in spriteData.uv){
                    if("x" in spriteData.uv.size && "y" in spriteData.uv.size){
                        uv.size = new Vector2(spriteData.uv.size.x, spriteData.uv.size.y);
                    }
                    else{
                        throw new Error("Error in the sprite sheet's uv size.");
                    }
                }
            }

            
            let sprite = new Sprite(texture, uv.position, uv.size);
            this._sprites[path] = sprite;
            return sprite;
        }

        public static getMipmapGlNumber(mipmap: Mipmap): number{
            if(mipmap === Mipmap.linear){
                return gl.LINEAR;
            }
            else if(mipmap === Mipmap.nearest){
                return gl.NEAREST;
            }
            else{
                // if it no one of the other that mean it is auto
                if(this.mipmap === Mipmap.linear){
                    return gl.LINEAR;
                }
                else if(this.mipmap === Mipmap.nearest){
                    return gl.NEAREST;
                }
                else{
                    if(Time.frameRate > 55){
                        return gl.LINEAR;
                    }
                    else{
                        return gl.NEAREST;
                    }
                }
            }
        }

        public static modifyColor(batchId: BatchID, color: Color): void{
            this._batches[batchId.id].modifyColor(batchId, color);
        }

        public static modifyPosition(batchId: BatchID, position: Vector2): void{
            this._batches[batchId.id].modifyPosition(batchId, position);
        }

        public static modifyRotation(batchId: BatchID, rotation: number): void{
            this._batches[batchId.id].modifyRotation(batchId, rotation);
        }

        public static modifyScale(batchId: BatchID, scale: Vector2): void{
            this._batches[batchId.id].modifyScale(batchId, scale);
        }

        public static addLayer(name: string, index: number): void{
            this._layers[name] = index;
        }

        public static getLayerIndex(layer: string, orderInLayer: number): number{
            return (this._layers[layer] + orderInLayer / maxLayerOrderNumber) / (Object.keys(this._layers).length.toString().length * 10);
        }

        public static get quads(): number{
            return this._quads;
        }
    }

    export enum Mipmap {
        nearest,
        linear,
        auto
    };

    export const maxLayerOrderNumber: number = 10000;
}