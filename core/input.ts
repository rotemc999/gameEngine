namespace GE {
    export class Input {
        private currentKeysDown: number[][] = [];
        private currentKeysUp: number[][] = [];

        private keysPressedUpdated: number[][] = [];
        private keysReleasedUpdated: number[][] = [];

        private keysPressed: number[][] = [];
        private keysReleased: number[][] = [];


        private mousePostion: Vector2 = new Vector2(0, 0);

        private lastScroll: number = 0;
        private scrollUpdated: boolean = false;
        private mouseWheel: number = 0;
        private scrollWeight: number = 0;

        private currentMouseButtonsDown: number[] = [];
        private currentMouseButtonsUp: number[] = [];

        private mouseButtonsPressedUpdated: number[] = [];
        private mouseButtonsReleasedUpdated: number[] = [];

        private mouseButtonsPressed: number[] = [];
        private mouseButtonsReleased: number[] = [];
    }
}