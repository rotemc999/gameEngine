import { Window } from './package/window.js';
import { Time } from './package/time.js';
import { Input } from './package/Input/Input.js';
import * as keyCode from './package/Input/keycode.js';
import { loadScene } from './package/scene/sceneLoader.js';
import { open } from './package/fileOpen.js';

let updates = [];

const win = new Window();
export const input = new Input();
export const time = new Time();
export const gl = win.gl;


let isRunning = true;

let currentScene = loadScene(open("./sceneTest.json"));

function start() {
    win.start();
    currentScene.start();

    requestAnimationFrame(frame);
}

function frame() {
    win.update();
    currentScene.update();
    input.update();
    time.update();
    if (isRunning) {
        requestAnimationFrame(frame);
    }
}




start()


