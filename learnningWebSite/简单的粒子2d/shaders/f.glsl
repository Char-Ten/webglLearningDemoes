precision mediump float;
uniform vec2 u_resolution;
varying vec2 v_position;
varying vec4 v_color;
void main(){
	vec2 st = v_position.xy/u_resolution;
	float pct = 0.0;
	pct = distance(st,vec2(0.5));
	vec3 color = vec3(pct);
	gl_FragColor=vec4(color,1.0)+v_color;
}