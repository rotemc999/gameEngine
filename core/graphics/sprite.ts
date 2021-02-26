namespace GE {
    export class Sprite {
        private _uv: Vector2[] = [];
        private _texture: Texture;

        public constructor(texture: Texture, uv: Vector2[]){
            this._texture = texture;
        }


        public get uv(): Vector2[]{
            return this._uv;
        }

        public get texture(): Texture{
            return this._texture;
        }
    }
}