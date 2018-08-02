precision mediump float;
attribute vec2 a_position;
uniform vec2 u_resolution;
uniform float u_time;
varying float v_size;
varying vec2 v_wave;
void main(){
	
	vec2 st = 2.0*a_position/u_resolution-vec2(1);
	
	float wave_x=sin(u_time+4.0*st.x);

	float wave_y=sin(2.0*u_time+5.0*st.y);

	vec2 wave_offset_x=vec2(.05*wave_x,.1*wave_x);

	vec2 wave_offset_y=vec2(0,.05*wave_y);

	vec2 position = st*vec2(1,-1)+vec2(0,.7)+wave_offset_x+wave_offset_y;

	float base_size=100.0+50.0*wave_x+25.0*wave_y;

	float size = base_size*(st.y+1.0)/2.0;

	v_size=size/base_size;
	v_wave=vec2((wave_x+1.0)/2.0,(wave_y+1.0)/2.0);
	gl_PointSize=size;
	gl_Position=vec4(position,0.0,1.0-st.y);
}