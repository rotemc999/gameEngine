precision mediump float;

attribute vec2 vertexPosition;
attribute vec2 uv;

varying vec2 fuv;

uniform mat2 projection;

uniform vec2 position;
uniform mat2 rotation;
uniform vec2 scale;

void main(){
    fuv = uv;
    fuv.y = 1.0 - fuv.y;
    vec2 finalPosition = projection * (position + (vertexPosition  * scale * rotation));
    gl_Position = vec4(finalPosition,0, 1);
}