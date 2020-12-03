import { Window } from './package/window.js';
import { Time } from './package/time.js';
import { Input } from './package/Input/Input.js';
import * as keyCode from './package/Input/keycode.js';

let updates = [];

const win = new Window();
export const input = new Input(addToUpdates);
export const time = new Time(addToUpdates);

let isRunning = true;

function start() {

    requestAnimationFrame(frame);
}

function frame() {
    if (input.scroll() != 0) {
        console.log(input.scroll())
    }

    if (input.isMouseButtonReleased(0)) {
        console.log(time.frameRate);
    }
    if (input.isKeyPressed(keyCode.KEY_C)) {
        console.clear()
    }

    for (let i = 0; i < updates.length; i++) {
        updates[i]();
    }
    if (isRunning) {
        requestAnimationFrame(frame);
    }
}

function addToUpdates(func) {
    updates.push(func);
}

start()


