namespace GE{
    export abstract class Behavior {
        private _gameObject: GameObject;
        private _transform: Transform;
        private _name: string;

        constructor(name: string, gameObject: GameObject) {
            this._gameObject = gameObject;
            this._transform = gameObject.transform;
            this._name = name;
        }

        protected get transform(): Transform {
            return this._transform;
        }

        protected get gameObject(): GameObject {
            return this._gameObject;
        }

        public start(): void {

        }
        public update(): void {

        }
    }
}