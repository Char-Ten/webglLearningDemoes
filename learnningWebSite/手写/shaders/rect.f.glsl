precision mediump float;
uniform sampler2D u_texture;
void main(){
	gl_FragColor=texture2D(u_texture,gl_FragCoord.xy);
}