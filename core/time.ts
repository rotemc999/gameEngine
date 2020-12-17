namespace GE {
    export class Time {
        private static _deltaTime: number;
        private static _frameRate: number = 0;
        private static _frames: number = 0;
        private static _nextSecond: number = 1000;
        private static _lastTime: number = 0;

        /**
         * update the time class every frame
         */
        public static update(): void {
            this._frames++;
            if (window.performance.now() >= this._nextSecond) {
                this._nextSecond = window.performance.now() + 1000;
                this._frameRate = this._frames;
                this._frames = 0;
            }
            this._deltaTime = window.performance.now() - this._lastTime;
            this._lastTime = window.performance.now();
        }

        /**
         * return the time in seconds passed from the start of the window
         */
        public static get currentTime(): number {
            // convert the time to seconds
            return window.performance.now() / 1000;
        }

        /**
         * return the time passed between the last two frame
         */
        public static get deltaTime(): number {
            // convert the time to seconds
            return this._deltaTime / 1000;
        }

        /**
         * return the frame rate of the page the frame per seconds
         */
        public static get frameRate(): number {
            return this._frameRate;
        }
    }
}