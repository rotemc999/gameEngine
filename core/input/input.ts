/// <reference path="../math/vector2.ts"/>
namespace GE {
    export class Input {
        private static _currentKeysDown: number[][] = [];
        private static _currentKeysUp: number[][] = [];

        private static _keysPressedUpdated: number[][] = [];
        private static _keysReleasedUpdated: number[][] = [];

        private static _keysPressed: number[][] = [];
        private static _keysReleased: number[][] = [];


        private static _mousePostion: Vector2 = new Vector2(0, 0);

        private static _lastScroll: number = 0;
        private static _scrollUpdated: boolean = false;
        private static _mouseWheel: number = 0;

        private static _currentMouseButtonsDown: number[] = [];
        private static _currentMouseButtonsUp: number[] = [];

        private static _mouseButtonsPressedUpdated: number[] = [];
        private static _mouseButtonsReleasedUpdated: number[] = [];

        private static _mouseButtonsPressed: number[] = [];
        private static _mouseButtonsReleased: number[] = [];

        private constructor() { }


        public static start(): void {

            window.addEventListener('keydown', (e) => {
                if (!contains(this._currentKeysDown, [e.keyCode, e.location])) {
                    this._currentKeysDown.push([e.keyCode, e.location]);
                }
                if (contains(this._currentKeysUp, [e.keyCode, e.location])) {
                    this._currentKeysUp.splice(indexof(this._currentKeysUp, [e.keyCode, e.location]), 1);
                }
                if (contains(this._keysReleasedUpdated, [e.keyCode, e.location])) {
                    this._keysReleasedUpdated.splice(indexof(this._keysReleasedUpdated, [e.keyCode, e.location]), 1);
                }
            });
            window.addEventListener('keyup', (e) => {
                //if (!contains(this._currentKeysUp, [e.keyCode, e.location])) {
                //    this._currentKeysUp.push([e.keyCode, e.location]);
                //}
                this._currentKeysUp.push([e.keyCode, e.location]);
                if (contains(this._currentKeysDown, [e.keyCode, e.location])) {
                    this._currentKeysDown.splice(indexof(this._currentKeysDown, [e.keyCode, e.location]), 1);
                }

                if (contains(this._keysPressedUpdated, [e.keyCode, e.location])) {
                    this._keysPressedUpdated.splice(indexof(this._keysPressedUpdated, [e.keyCode, e.location]), 1);
                }
            });


            window.addEventListener("wheel", (e) => {
                this._mousePostion = new Vector2(e.x, e.y);
                this._scrollUpdated = false;
                this._lastScroll = e.deltaY > 0 ? 1 : -1;
            });
            window.addEventListener("mousemove", (e) => {
                this._mousePostion = new Vector2(e.x, e.y);
            });
            window.addEventListener("mousedown", (e) => {
                this._mousePostion = new Vector2(e.x, e.y);
                this._currentMouseButtonsDown.push(e.button);

                if (contains(this._currentMouseButtonsUp, e.button)) {
                    this._currentMouseButtonsUp.splice(indexof(this._currentMouseButtonsUp, e.button), 1);
                }
                if (contains(this._mouseButtonsReleasedUpdated, e.button)) {
                    this._mouseButtonsReleasedUpdated.splice(indexof(this._mouseButtonsReleasedUpdated, e.button), 1);
                }
            });
            window.addEventListener("mouseup", (e) => {
                this._mousePostion = new Vector2(e.x, e.y);

                this._currentMouseButtonsUp.push(e.button);

                if (contains(this._currentMouseButtonsDown, e.button)) {
                    this._currentMouseButtonsDown.splice(indexof(this._currentMouseButtonsDown, e.button), 1);
                }
                if (contains(this._mouseButtonsPressedUpdated, e.button)) {
                    this._mouseButtonsPressedUpdated.splice(indexof(this._mouseButtonsPressedUpdated, e.button), 1);
                }
            });
        }
        public static update(): void {
            this._keysPressed = [];
            this._keysReleased = [];

            for (let i = 0; i < this._currentKeysDown.length; i++) {
                if (!contains(this._keysPressedUpdated, this._currentKeysDown[i])) {
                    this._keysPressed.push(this._currentKeysDown[i]);
                    this._keysPressedUpdated.push(this._currentKeysDown[i]);
                }
            }

            for (let i = 0; i < this._currentKeysUp.length; i++) {
                if (!contains(this._keysReleasedUpdated, this._currentKeysUp[i])) {
                    this._keysReleased.push(this._currentKeysUp[i]);
                    this._keysReleasedUpdated.push(this._currentKeysUp[i]);
                }
            }

            this._mouseButtonsPressed = [];
            this._mouseButtonsReleased = [];

            for (let i = 0; i < this._currentMouseButtonsDown.length; i++) {
                if (!contains(this._mouseButtonsPressedUpdated, this._currentMouseButtonsDown[i])) {
                    this._mouseButtonsPressed.push(this._currentMouseButtonsDown[i]);
                    this._mouseButtonsPressedUpdated.push(this._currentMouseButtonsDown[i]);
                }
            }

            for (let i = 0; i < this._currentMouseButtonsUp.length; i++) {
                if (!contains(this._mouseButtonsReleasedUpdated, this._currentMouseButtonsUp[i])) {
                    this._mouseButtonsReleased.push(this._currentMouseButtonsUp[i]);
                    this._mouseButtonsReleasedUpdated.push(this._currentMouseButtonsUp[i]);
                }
            }

            this._mouseWheel = 0;
            if (!this._scrollUpdated) {
                this._mouseWheel = this._lastScroll;
                this._scrollUpdated = true;
            }
        }

        public static isKeyDown(keyCode: number[]): boolean {
            return contains(this._currentKeysDown, keyCode);
        }

        public static isKeyPressed(keyCode: number[]): boolean {
            return contains(this._keysPressed, keyCode);
        }
        public static isKeyReleased(keyCode: number[]): boolean {
            return contains(this._keysReleased, keyCode);
        }


        public static isMouseButtonDown(button: number): boolean {
            return contains(this._currentMouseButtonsDown, button)
        }
        public static isMouseButtonPressed(button: number): boolean {
            return contains(this._mouseButtonsPressed, button)
        }
        public static isMouseButtonReleased(button: number): boolean {
            return contains(this._mouseButtonsReleased, button)
        }
        public static scroll(): number {
            return this._mouseWheel;
        }
        public static mousePosition(): Vector2 {
            return this._mousePostion;
        }
    }
}