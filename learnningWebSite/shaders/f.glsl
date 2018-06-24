precision mediump float;
uniform vec3 u_color;
uniform vec2 u_mouse;
varying vec4 v_pos;
void main(){
    vec3 vec3_color = vec3(u_mouse+v_pos.xy,v_pos.x);
    gl_FragColor=vec4(vec3_color,1.0);
}