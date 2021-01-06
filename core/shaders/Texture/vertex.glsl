precision mediump float;

attribute vec3 position;
attribute vec2 uv;

varying fuv;

uniform mat4 projection;
uniform mat4 transformation;

void main(){
    fuv = uv;
    gl_Position = projection * transformation * vec4(position, 1);
}