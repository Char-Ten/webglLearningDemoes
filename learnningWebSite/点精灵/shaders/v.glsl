precision mediump float;
attribute vec2 a_position;
attribute vec3 a_color;
attribute float a_size;
uniform vec2 u_resolution;
varying vec3 v_color;
varying float v_size;
void main(){
	// 从像素坐标转换到 0.0 到 1.0
    vec2 zeroToOne = a_position.xy / u_resolution;
 
    // 再把 0->1 转换 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
 
    // 把 0->2 转换到 -1->+1 (裁剪空间)
    vec2 clipSpace = zeroToTwo - 1.0;
	v_color=a_color;

	gl_PointSize=a_size;

	v_size=a_size;
	
	gl_Position=vec4(clipSpace*vec2(1,-1),0.0,1.0);
}