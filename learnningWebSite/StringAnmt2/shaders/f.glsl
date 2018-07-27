precision mediump float;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
uniform vec2 u_resolution;
uniform float u_len;
varying vec2 v_position;

void main(){
	vec4 color = texture2D(u_tex1,v_position);
	vec4 px_color = texture2D(u_tex1,vec2(gl_FragCoord.x,u_resolution.y-gl_FragCoord.y)/u_resolution);
	float s = 1.0/u_len;
	float gary = (color.r+color.g+color.b)/3.0;
	float p = float(int((1.0-gary)/s)-1)*s;

	vec4 text_color = texture2D(u_tex2,vec2(gl_PointCoord.x/u_len +p,gl_PointCoord.y));

	if(text_color.a!=0.0){
		text_color=color;
	}


	gl_FragColor=text_color;
}