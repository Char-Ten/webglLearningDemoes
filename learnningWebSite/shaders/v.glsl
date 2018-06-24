precision mediump float;
attribute vec4 a_Position;
varying vec4 v_pos;
void main(){
    v_pos=2.0*a_Position-1.0;
    gl_Position=a_Position;

}