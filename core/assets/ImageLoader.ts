namespace GE {
    export class ImageLoader {
        private constructor() {

        }

        public static load(path: string, onloadFunc: Function): void {

            let img = new Image();
            img.src = path;

            img.onload = () => {
                onloadFunc(img)
            };
        }

    }
}