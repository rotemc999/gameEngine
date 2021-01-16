#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

varying vec2 fuv;

uniform vec4 tint;
uniform sampler2D texture;


void main(){
    gl_FragColor = texture2D(texture, fuv) * tint;
}