/// <reference path="../gameObject/component.ts"/>

namespace GE{

    // https://mdn.github.io/webaudio-examples/panner-node/
    /*
    export class pointAudio extends Component{
        
        private _audioPanner: PannerNode;
        private _audio: AudioBufferSourceNode;

        private _src: string;

        public maxDistance: number = 100;
        private _volume: number = 100;
        private _playOnStart: boolean = true;
        private _loop: boolean = true;
        private _isPlaying: boolean = false;
        private _muted: boolean = false;

        public start(): void{
            this._audioPanner = AudioManager.audioContext.createPanner();
            this._audioPanner.panningModel = 'HRTF';
            this._audioPanner.distanceModel = 'inverse';
            this._audioPanner.refDistance = 1;
            this._audioPanner.maxDistance = this.maxDistance;
            this._audioPanner.rolloffFactor = 1;
            this._audioPanner.coneInnerAngle = 360;
            this._audioPanner.coneOuterAngle = 0;
            this._audioPanner.coneOuterGain = 0;
            this._audioPanner.setPosition(this.transfrom.position.x, this.transfrom.position.y, 0);

            if(this._playOnStart){
                this._audio.start(0);
            }
        }

        public update(): void{
            this._audioPanner.setPosition(this.transfrom.position.x, this.transfrom.position.y, 0);
        }

        public get src(): string{
            return this._src;
        }

        public set src(src: string){
            AudioLoader.load(src, (buffer: AudioBuffer)=>{
                this._audio = AudioManager.audioContext.createBufferSource();
                this._audio.buffer = buffer;

                this._audio.connect(this._audioPanner);
                this._audioPanner.connect(AudioManager.audioContext.destination);
            });
        }


        public play(): void{
            this._audio.start(0);
        }

        public stop(): void{
            this._audio.stop(0);
        }
    }
    */
}