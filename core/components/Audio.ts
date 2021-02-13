/// <reference path="../gameObject/component.ts"/>

namespace GE{
    export class AudioPlayer extends Component{
        private _audio: HTMLAudioElement = new Audio();
        private _volume: number = 100;
        private _playOnStart: boolean = true;
        private _loop: boolean = true;
        private _isPlaying: boolean = false;
        private _muted: boolean = false;

        public start(): void{
            this._audio.volume = this._volume / 100 * (AudioManager.volume / 100);
            this._audio.muted = this._muted;
            this._audio.loop = this._loop;
            if(this._playOnStart){
                this._isPlaying = true;
                this._audio.play();
            }
        }

        public update(): void{
            if(this._audio.ended){
                this._isPlaying = false;
            }
        }

        public get volume(): number{
            return this._volume;
        }
        public set volume(volume: number){
            this._volume = volume;
            this._audio.volume = volume / 100 * (AudioManager.volume / 100);
        }

        public get playOnStart(): boolean{
            return this._playOnStart;
        }
        public set playOnStart(state: boolean){
            this._playOnStart = state;
        }

        
        public set src(src: string){
            this._audio.src = src;
        }

        public get loop(): boolean{
            return this._loop;
        }
        public set loop(state: boolean){
            this._loop = state;
            this._audio.loop = state;
        }

        public get isPlaying(): boolean{
            return this._isPlaying;
        }


        public play(): void{
            this._audio.play();
        }

        public stop(){
            this._audio.pause();
        }
    }
}