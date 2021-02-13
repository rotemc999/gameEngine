namespace GE{
    export class AudioManager{
        private constructor(){}
        private static _volume: number = 100;
        private static _audioContext: AudioContext;
        private static _adudioOutput: string;
        public static muteOnLostFocus: boolean = true;
        private static _focusMute: boolean = false;

        public static start(): void{
            this._audioContext = new AudioContext();

            window.addEventListener("focus", (e)=>{
                this._focusMute = false;
            });
            window.addEventListener("unfocus", (e)=>{
                this._focusMute = true;
            });
        }

        public static get volume(): number{
            if(this._focusMute){
                return 0;
            }
            return this._volume;
        }
        public static set volume(volume: number){
            this._volume = volume;
        }

        public static get audioContext(): AudioContext{
            return this._audioContext;
        }



    }
}