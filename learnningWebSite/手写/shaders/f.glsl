precision mediump float;
uniform sampler2D u_texture;
void main(){
	gl_FragColor=vec4(gl_FragCoord.x,0.0,0.0,1);
}