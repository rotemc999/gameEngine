namespace GE{



    export class Renderer{
        private static _batches: Batch[];
        public static mipmap: Mipmap;
        private static _textures: {[path: string]:Texture} = {};
        private static _sprites: {[path: string]:Sprite} = {};
        private static _quads: number = 0;
        private constructor(){}



        public static start(): void{
            this._batches = [new Batch()];
        }

        public static add(spritePath: string, gameObject: GameObject, color: Color): BatchData{
            for(let i = 0; i < this._batches.length; i++){
                if(this._batches[i].hasQuadRoom() && this._batches[i].canRenderSprite(this._sprites[spritePath])){
                    let id = i * batchMaxQuads + this._batches[i].numberOfQuads;
                    let data = {
                        sprite: this.getSprite(spritePath),
                        gameObject: gameObject,
                        color: color,
                        id: id
                    };
                    this._batches[i].add(data);
                    return data;
                }
            }
            this._batches.push(new Batch());
            let id = (this._batches.length-1) * batchMaxQuads + this._batches[-1].numberOfQuads;
            let data = {
                sprite: this._sprites[spritePath],
                gameObject: gameObject,
                color: color,
                id: id
            };
            this._batches[-1].add(data);
            this._quads++;
            return data;
        }

        public static remove(id: number): void{
            this._batches[Math.floor(id / batchMaxQuads)].remove(id % batchMaxQuads);
            this._quads--;
        }

        public static render(): void{
            console.log(this._sprites)
            console.log(this._batches);
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
            let uv = [
                new Vector2(0,0),
                new Vector2(1,1)
            ];
            if(spriteData.texture in this._textures){
                let sprite = new Sprite(this._textures[spriteData.texture], uv);
                this._sprites[path] = sprite;
                return sprite;
            }
            else{
                let textureImg = AssetManager.getAssetData(spriteData.texture);
                if(!(textureImg === undefined)){
                    let texture = new Texture(textureImg);
                    this._textures[spriteData.texture] = texture;
                    let sprite = new Sprite(texture, uv);
                    this._sprites[path] = sprite;
                    return sprite;
                }
                throw new Error("the sprite sheet's image '"+spriteData.texture+"' was not found in the imported files")
            }
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

        public static modify(id: number, data: any): void{
            this._batches[Math.floor(id / batchMaxQuads)].modify(id % batchMaxQuads, data);
        }
    }

    export enum Mipmap {
        nearest,
        linear,
        auto
    };
}