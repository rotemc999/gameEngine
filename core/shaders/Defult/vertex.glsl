attribute vec3 position;

uniform mat4 projection;
uniform mat4 transformations;


void main(){
    gl_Position =  projection * transformations * vec4(position, 1.0);
}