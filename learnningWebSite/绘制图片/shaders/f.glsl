precision mediump float;
uniform sampler2D u_image;
uniform vec2 u_resolution;
varying vec2 v_TexCoord;
void main(){
	// gl_FragColor=texture2D(u_image,vec2(0.047,0.23));
	// gl_FragColor=texture2D(u_image,v_TexCoord)+vec4(v_TexCoord/2.0,0.0,1.0);
	gl_FragColor=texture2D(u_image,v_TexCoord).brga;
}