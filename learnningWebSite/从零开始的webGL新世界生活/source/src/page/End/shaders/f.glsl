precision mediump float;
uniform vec2 u_resolution;
varying float v_size;
varying vec2 v_wave;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(
		_radius-(_radius*0.01),
    	_radius+(_radius*0.01),
		dot(dist,dist)*4.0
	);
}

void main(){
	vec2 st = gl_PointCoord.xy;

	float c = circle(st,.1);
	float pct = distance(st,vec2(.5));

	vec3 color = vec3(1.0,.5,pct*v_wave.y) + vec3(c)*v_wave.y*v_wave.x;
	

	gl_FragColor=vec4(color,(v_size+.5)*(1.0-pct-.5));
}