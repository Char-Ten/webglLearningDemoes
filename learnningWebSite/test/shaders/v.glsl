precision mediump float;
attribute vec4 a_Position;
attribute vec4 a_PointColor;
varying vec4 v_pos;
varying vec4 v_color;
void main(){
	v_color=a_PointColor;
    gl_Position=a_Position;

}