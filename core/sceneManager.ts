namespace GE {
    export class SceneManager {
        private static _activeScene: Scene;
        private static _scenes: Scene[] = [];

        private constructor() { }

        public static createScene(scene: Scene): void {
            this._scenes.push(scene);
        }

        public static loadScene(name: string): void {
            for (let i = 0; i < this._scenes.length; i++) {
                if (this._scenes[i].name === name) {
                    if (this._activeScene !== undefined) {
                        this._activeScene.onDeactivate();
                    }
                    this._scenes[i].onActivate();
                    this._activeScene = this._scenes[i];
                    return;
                }
            }
        }

        public static start(): void {
            this._activeScene.start();
        }


        public static update(): void {
            this._activeScene.update();
        }
        public static render(shader: Shader): void {
            this._activeScene.render(shader);
        }
    }
}