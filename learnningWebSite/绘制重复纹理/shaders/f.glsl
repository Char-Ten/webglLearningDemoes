precision mediump float;
uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform vec2 u_image_resolution;
varying vec2 v_TexCoord;

void main(){
	vec2 st = gl_FragCoord.xy*vec2(1,-1)/u_image_resolution;
	vec4 color = vec4(0.0);
	

	st *= 1.0;
	st = fract(st);
	float pct = distance (st,vec2(.5));

	color =texture2D(u_image,v_TexCoord*(sin(st.y)+sin(st.x)));
	gl_FragColor = color;
}