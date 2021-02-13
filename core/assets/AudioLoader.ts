namespace GE{
    export class AudioLoader{
        private constructor(){}

        public static load(src: string, callbackFunc: Function){
            let request = new XMLHttpRequest();
            request.responseType = "arraybuffer";
            request = new XMLHttpRequest();

            request.open('GET', 'viper.ogg', true);

            request.responseType = 'arraybuffer';


            request.onload = function() {
                let audioData = request.response;

                AudioManager.audioContext.decodeAudioData(audioData, (buffer) => {
                    callbackFunc(buffer);
                    },
                    (e) => {
                    throw new Error("Error with decoding audio data" + e);
                    }
                );
            }
        }
    }
}