precision mediump float;
uniform vec2 u_resolution;
varying vec3 v_color;
varying float v_size;


float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(
		_radius-(_radius*0.01),
    	_radius+(_radius*0.01),
		dot(dist,dist)*4.0
	);
}

void main(){
	vec2 st= gl_PointCoord.xy/vec2(1.0);
	vec2 px_st = gl_FragCoord.xy/u_resolution;
	float r= v_size/100.0;
	float pct = distance(st,vec2(0.5))+.5;
	float c = circle(st,.05);
	
	gl_FragColor = vec4(v_color.rgb+vec3(0.5-px_st.y+r*.5),(1.0-pct)*r);
}