precision mediump float;

varying vec2 fuv;
uniform sampler2D texture;


void main(){
    gl_FragColor = texture2D(texture, fuv); 
}