precision mediump float;
uniform sampler2D u_tex1;
uniform vec2 u_resolution;
void main(){
    vec2 st = vec2(gl_FragCoord.x,u_resolution.y-gl_FragCoord.y)/u_resolution;
    vec4 color = texture2D(u_tex1,st);
    gl_FragColor=color;
    // gl_FragColor=vec4(1.0,0.0,0.0,1.0);
}