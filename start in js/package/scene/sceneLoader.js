import { Vector2 } from "../math/Vector2.js";
import { RenderingManager } from "../Renderers/renderingManager.js";
import { Scene } from "./scene.js";
import { GameObject } from '../gameObject/gameObject.js';

export function loadScene(file) {
    let sceneFile = JSON.parse(file);
    let scene = new Scene();
    for (let i = 0; i < sceneFile["gameObjects"].length; i++) {
        let data = sceneFile["gameObjects"][i]
        let thisGameObject = new GameObject(data["Name"]);
        thisGameObject.tag = data["tag"];
        thisGameObject.enabled = data["Enabled"];
        thisGameObject.transform.position = new Vector2(data["Transform"]["position"]["x"], data["Transform"]["position"]["y"]);
        thisGameObject.transform.rotation = data["Transform"]["rotation"]
        thisGameObject.transform.scale = new Vector2(data["Transform"]["scale"]["x"], data["Transform"]["scale"]["y"]);

        scene.addGameObject(thisGameObject);
    }
    return scene;
}