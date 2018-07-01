precision mediump float;
attribute vec2 a_position;
attribute vec2 a_TexCoord;

uniform vec2 u_resolution;
varying vec2 v_TexCoord;

vec2 clipSpace(vec2 position,bool isTrun){
	vec2 res=position*2.0/u_resolution-1.0;
	if(isTrun){
		return res*vec2(1,-1);
	}
	return position*2.0/u_resolution-1.0;
}

void main(){
	v_TexCoord=a_TexCoord;
	gl_Position=vec4(clipSpace(a_position,true),0.0,1.0);
}