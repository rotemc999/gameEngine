namespace GE {
    export class Sprite {
        private _uv: Vector2[] = [];
        private _texture: Texture;

        public constructor(texture: Texture, uvPosition: Vector2, uvSize: Vector2){
            this._texture = texture;

            this._uv.push(uvPosition);
            this._uv.push(uvPosition.add(uvSize));
            let lo = 
            this._uv.push()

        }


        public get uv(): Vector2[]{
            return this._uv;
        }

        public get texture(): Texture{
            return this._texture;
        }
    }
}