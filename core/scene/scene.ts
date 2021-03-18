namespace GE {
    export class Scene {

        private _gameObjects: GameObject[] = [];
        private _camera: MainCamera;
        private _name: string;

        public constructor(name: string) {
            this._name = name;
            this._camera = new MainCamera("__MainCamera__", this);
        }

        public get name(): string {
            return this._name;
        }


        public addGameObject(gameObject: GameObject): void {
            this._gameObjects.push(gameObject);
        }

        public find(name: string): GameObject | undefined {
            for (let i: number = 0; i < this._gameObjects.length; i++) {
                if (this._gameObjects[i].name === name) {
                    return this._gameObjects[i];
                }
            }
            return undefined;
        }

        public removeGameObject(gameObject: GameObject): void {
            let gameObjectIndex: number = this._gameObjects.indexOf(gameObject);
            if (gameObjectIndex !== -1) {
                this._gameObjects.splice(gameObjectIndex, 1)
            }
        }


        public update(): void {
            this._camera.update();
            for (let i: number = 0; i < this._gameObjects.length; i++) {
                this._gameObjects[i].update();
            }
        }

        public start(): void {
            this._camera.start();
            for (let i: number = 0; i < this._gameObjects.length; i++) {
                this._gameObjects[i].start();
            }
        }

        public onActivate(): void {

        }
        public onDeactivate(): void {

        }

        public get camera(): MainCamera{
            return this._camera;
        }
    }
}