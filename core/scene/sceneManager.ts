/// <reference path="../gameObject/gameObject.ts"/>

namespace GE {
    export class SceneManager {
        private static _activeScene: Scene;
        private static _scenes: Scene[] = [];

        private constructor() { }

        public static createScene(scene: Scene): void {
            this._scenes.push(scene);
        }

        public static loadSceneJson(path:string): Scene{
            let sceneData = AssetManager.getAssetData(path);

            if (sceneData.name === undefined){
                throw new Error("Scene file format exception: Scene name is not defined.");
            }
            
            let scene: Scene = new Scene(String(sceneData.name));

            if (sceneData.gameObjects !== undefined){

                for(let i = 0; i < sceneData.gameObjects.length; i++){
                    scene.addGameObject(this.loadGameObject(sceneData.gameObjects[i], scene))
                }
            }
            this._scenes.push(scene);
            return scene
        }

        private static loadGameObject(data:any, scene:Scene):GameObject{
            if (data.name === undefined){
                throw new Error("Scene file format exception: Game object name is not defined.");
            }
            let gameObject: GameObject = new GameObject(data["name"],scene);

            if (data.transform !== undefined){
                if (data.transform.position !== undefined){
                    if (data.transform.position.x === undefined){
                        throw new Error("Scene file format exception: Game object transform position is defined but the 'x' argument is not defined.");
                    }
                    if (data.transform.position.y === undefined){
                        throw new Error("Scene file format exception: Game object transform position is defined but the 'y' argument is not defined.");
                    }
                    gameObject.transform.position =  new Vector2(data.transform.position.x ,data.transform.position.y);
                }

                if (data.transform.rotation !== undefined){
                    gameObject.transform.rotation = data.transform.rotation;
                }

                if (data.transform.scale !== undefined){
                    if (data.transform.scale.x === undefined){
                        throw new Error("Scene file format exception: Game object transform scale is defined but the 'x' argument is not defined.");
                    }
                    if (data.transform.scale.y === undefined){
                        throw new Error("Scene file format exception: Game object transform scale is defined but the 'y' argument is not defined.");
                    }
                    gameObject.transform.scale =  new Vector2(data.transform.scale.x ,data.transform.scale.y);
                }
            }

            if(data.components !== undefined){
                for(let i =0; i < data.components.length; i++){
                    let componentData = data.components[i]
                    if(componentData.type === undefined){
                        throw new Error("Scene file format exception: Component type is not defined.");
                    }
                    let component = eval("new GE." + componentData.type + "('fggs', gameObject)");
                    for (let param in data.components[i]){
                        if(param === "type"){
                            continue;
                        }
                        if(!(param in component)){
                            throw new Error("Scene file format exception: Component parameter named '"+param+"' does not exist.");
                        }
                        component[param] = data.components[i][param];
                    }

                    gameObject.addComponent(component);
                }   
            }

            if (gameObject.enabled !== undefined){
                gameObject.enabled = data["enabled"];
            }
            
            

            return gameObject;
        }

        public static activateScene(name: string): void {
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

        public static get activeScene(): Scene{
            return this._activeScene;
        }
    }
}