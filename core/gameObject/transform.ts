namespace GE {
    export class Transform {
        private _position: Vector2;
        private _rotation: number;
        private _scale: Vector2;
        public constructor(position?: Vector2, rotation?: number, scale?: Vector2) {
            this._position = position && position || new Vector2(0, 0);
            this._rotation = rotation && rotation || 0;
            this._scale = scale && scale || new Vector2(1, 1);
        }

        get position(): Vector2 {
            return this._position;
        }
        set position(position: Vector2) {
            this._position = position;
        }

        get rotation(): number {
            return this._rotation;
        }
        set rotation(rotation: number) {
            this._rotation = rotation;
        }

        public get scale(): Vector2 {
            return this._scale;
        }
        public set scale(scale: Vector2) {
            this._scale = scale;
        }
    }
}   
