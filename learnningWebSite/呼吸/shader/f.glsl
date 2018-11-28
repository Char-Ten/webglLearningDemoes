precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_image_size;
uniform float u_time;
uniform sampler2D u_tex;
varying vec2 v_pos;
const float PI = 3.14159;

float createBreastMask (vec2 coord,vec2 center,float size){
	return smoothstep(1.0-size,1.0,1.0-distance(coord,center));
}

vec2 createCenter(vec2 center,vec2 imgSize){
	return center/imgSize - center;
}

void main(){
	vec2 uv=v_pos;
	vec2 imgSize = u_image_size/u_resolution;
	vec2 dir = vec2(0.5)-vec2(0.5,0.4);
	
	float imgScale = imgSize.x/imgSize.y;
	float imgYOffset = 0.5-(imgSize.y)*0.5;
	imgSize = vec2(1.0,1.0/imgScale);
	uv=v_pos/imgSize-createCenter(vec2(0.5),imgSize);
	float dist = (uv.y-0.5)/2.0;
	float breastMask = 
	createBreastMask(
		uv,
		vec2(0.5105,0.4263),
		0.075
	) +
	createBreastMask(
		uv,
		vec2(0.4473,0.4209),
		0.078
	)+
	createBreastMask(
		uv,
		vec2(0.3806,0.3609),
		0.08
	)+
	createBreastMask(
		uv,
		vec2(0.5934,0.3609),
		0.08
	);

	vec2 offset = dir * dist*(sin(u_time*PI + dist*PI)-1.0) * breastMask;

	vec4 color = texture2D(u_tex,uv + offset);
	if(uv.x>1.0||uv.x<0.0||uv.y>1.0||uv.y<0.0){
		color.a=0.0;
	}
	float roleMask = color.a;
	vec4 darkColor = vec4(vec3(0.0),roleMask);
	
	gl_FragColor=darkColor*breastMask + color*roleMask;
}