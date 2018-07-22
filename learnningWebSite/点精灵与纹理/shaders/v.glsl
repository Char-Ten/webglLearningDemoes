precision mediump float;
attribute vec2 a_position;
uniform vec2 u_resolution;
varying vec2 v_position;
void main(){
	// 从像素坐标转换到 0.0 到 1.0
    vec2 zeroToOne = a_position / u_resolution;
 
    // 再把 0->1 转换 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
 
    // 把 0->2 转换到 -1->+1 (裁剪空间)
    vec2 clipSpace = zeroToTwo - 1.0;
	
	v_position=zeroToOne;
	
	gl_PointSize=16.0;

	gl_Position=vec4(clipSpace*vec2(1,-1),0.0,1.0);
}