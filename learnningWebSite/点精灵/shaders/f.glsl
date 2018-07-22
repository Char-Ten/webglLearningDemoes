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
	vec2 st1 = gl_FragCoord.xy/u_resolution;
	float r= v_size/80.0;
	float pct = distance(st,vec2(0.5));
	if(pct>0.5){
		discard;
	}
	vec3 mask = vec3(pct);
	
	gl_FragColor=vec4(vec3(gl_PointCoord.x)-2.0*mask+vec3(st1.y,st1.x,0.0),1.0-2.0*pct);
}