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

        /**
         * the start function of the input module
         */
        public static start(): void {

            window.addEventListener('keydown', (e) => {
                if (!ArrayUtil.contains(this._currentKeysDown, [e.keyCode, e.location])) {
                    this._currentKeysDown.push([e.keyCode, e.location]);
                }
                if (ArrayUtil.contains(this._currentKeysUp, [e.keyCode, e.location])) {
                    this._currentKeysUp.splice(ArrayUtil.indexof(this._currentKeysUp, [e.keyCode, e.location]), 1);
                }
                if (ArrayUtil.contains(this._keysReleasedUpdated, [e.keyCode, e.location])) {
                    this._keysReleasedUpdated.splice(ArrayUtil.indexof(this._keysReleasedUpdated, [e.keyCode, e.location]), 1);
                }
            });
            window.addEventListener('keyup', (e) => {
                this._currentKeysUp.push([e.keyCode, e.location]);
                if (ArrayUtil.contains(this._currentKeysDown, [e.keyCode, e.location])) {
                    this._currentKeysDown.splice(ArrayUtil.indexof(this._currentKeysDown, [e.keyCode, e.location]), 1);
                }

                if (ArrayUtil.contains(this._keysPressedUpdated, [e.keyCode, e.location])) {
                    this._keysPressedUpdated.splice(ArrayUtil.indexof(this._keysPressedUpdated, [e.keyCode, e.location]), 1);
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

                if (ArrayUtil.contains(this._currentMouseButtonsUp, e.button)) {
                    this._currentMouseButtonsUp.splice(ArrayUtil.indexof(this._currentMouseButtonsUp, e.button), 1);
                }
                if (ArrayUtil.contains(this._mouseButtonsReleasedUpdated, e.button)) {
                    this._mouseButtonsReleasedUpdated.splice(ArrayUtil.indexof(this._mouseButtonsReleasedUpdated, e.button), 1);
                }
            });
            window.addEventListener("mouseup", (e) => {
                this._mousePostion = new Vector2(e.x, e.y);

                this._currentMouseButtonsUp.push(e.button);

                if (ArrayUtil.contains(this._currentMouseButtonsDown, e.button)) {
                    this._currentMouseButtonsDown.splice(ArrayUtil.indexof(this._currentMouseButtonsDown, e.button), 1);
                }
                if (ArrayUtil.contains(this._mouseButtonsPressedUpdated, e.button)) {
                    this._mouseButtonsPressedUpdated.splice(ArrayUtil.indexof(this._mouseButtonsPressedUpdated, e.button), 1);
                }
            });
        }
        /**
         * the update function of the input module
         */
        public static update(): void {
            this._keysPressed = [];
            this._keysReleased = [];

            for (let i = 0; i < this._currentKeysDown.length; i++) {
                if (!ArrayUtil.contains(this._keysPressedUpdated, this._currentKeysDown[i])) {
                    this._keysPressed.push(this._currentKeysDown[i]);
                    this._keysPressedUpdated.push(this._currentKeysDown[i]);
                }
            }

            for (let i = 0; i < this._currentKeysUp.length; i++) {
                if (!ArrayUtil.contains(this._keysReleasedUpdated, this._currentKeysUp[i])) {
                    this._keysReleased.push(this._currentKeysUp[i]);
                    this._keysReleasedUpdated.push(this._currentKeysUp[i]);
                }
            }

            this._mouseButtonsPressed = [];
            this._mouseButtonsReleased = [];

            for (let i = 0; i < this._currentMouseButtonsDown.length; i++) {
                if (!ArrayUtil.contains(this._mouseButtonsPressedUpdated, this._currentMouseButtonsDown[i])) {
                    this._mouseButtonsPressed.push(this._currentMouseButtonsDown[i]);
                    this._mouseButtonsPressedUpdated.push(this._currentMouseButtonsDown[i]);
                }
            }

            for (let i = 0; i < this._currentMouseButtonsUp.length; i++) {
                if (!ArrayUtil.contains(this._mouseButtonsReleasedUpdated, this._currentMouseButtonsUp[i])) {
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

        /**
         * 
         * @param keyCode the keycode of the key for shortcut use the keyCode class
         * @returns true if the key is currently down or false if it is up
         */
        public static isKeyDown(keyCode: number[]): boolean {
            return ArrayUtil.contains(this._currentKeysDown, keyCode);
        }

        /**
         * 
         * @param keyCode the keycode of the key for shortcut use the keyCode class
         * @returns true if the key was pressed in the last frame
         */
        public static isKeyPressed(keyCode: number[]): boolean {
            return ArrayUtil.contains(this._keysPressed, keyCode);
        }
        /**
         * 
         * @param keyCode the keycode of the key for shortcut use the keyCode class
         * @returns true if the key was released in the last frame
         */
        public static isKeyReleased(keyCode: number[]): boolean {
            return ArrayUtil.contains(this._keysReleased, keyCode);
        }

        /**
         * 
         * @param button the mouse button number
         * @returns true if the button is currently down or false if it is up
         */
        public static isMouseButtonDown(button: number): boolean {
            return ArrayUtil.contains(this._currentMouseButtonsDown, button)
        }
        /**
         * 
         * @param button the mouse button number
         * @returns true if the button was pressed in the last frame
         */
        public static isMouseButtonPressed(button: number): boolean {
            return ArrayUtil.contains(this._mouseButtonsPressed, button)
        }
        /**
         * 
         * @param button the mouse button number
         * @returns true if the button was released in the last frame
         */
        public static isMouseButtonReleased(button: number): boolean {
            return ArrayUtil.contains(this._mouseButtonsReleased, button)
        }
        /**
         * 
         * @returns return the mouse wheel scrool direction in the last frame 0 for no scrolling
         */
        public static scroll(): number {
            return this._mouseWheel;
        }
        /**
         * 
         * @returns the mouse position
         */
        public static mousePosition(): Vector2 {
            return this._mousePostion;
        }
    }
}