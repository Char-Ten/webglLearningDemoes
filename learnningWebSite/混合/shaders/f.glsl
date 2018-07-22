precision mediump float;
uniform vec2 u_resolution;
varying vec2 v_position;
varying vec4 v_color;

float circle(vec2 _st, float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(
		_radius-(_radius*0.01),
    	_radius+(_radius*0.01),
		dot(dist,dist)*4.0
	);
}

void main(){
	vec2 st= gl_PointCoord.xy/vec2(1.0);
	float pct = distance(st,vec2(0.5))/0.5;
	float cir=circle(st,.1)*sin(st.x);
	gl_FragColor=vec4(v_color.rgb+cir,1.0-pct);
	// gl_FragColor=vec4(vec3(cir),1.0);
}