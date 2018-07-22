precision mediump float;
uniform sampler2D u_tex1;
uniform vec2 u_resolution;
varying vec2 v_position;

void main(){
	vec4 color = texture2D(u_tex1,v_position);

	gl_FragColor=color;
}