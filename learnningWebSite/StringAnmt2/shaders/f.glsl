precision mediump float;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
uniform vec2 u_resolution;
uniform vec3 u_color;
uniform float u_len;
uniform int u_type;
varying vec2 v_position;

void main(){
	//采样点颜色
	vec4 color = texture2D(u_tex1,v_position);

	//像素映射点颜色
	vec4 px_color = texture2D(u_tex1,vec2(gl_FragCoord.x,u_resolution.y-gl_FragCoord.y)/u_resolution);

	float s = 1.0/u_len;
	float gary = (color.r+color.g+color.b)/3.0;
	float p = float(int((1.0-gary)/s))*s;

	//文字纹理
	vec4 text_color = texture2D(u_tex2,vec2(gl_PointCoord.x/u_len +p,gl_PointCoord.y));

	//文字纹理的alpha通道
	float alpha = text_color.a;

	if(u_type==1){
		text_color= (vec4(1.0)-text_color)*vec4(u_color.rgb,1.0);//  vec4(u_color.rgb,1.0);
		text_color.a=alpha;
	}

	if(u_type==2){
		text_color=vec4(color.rgb,alpha);
	}

	if(u_type==3){
		text_color=vec4(px_color.rgb,alpha);
	}


	gl_FragColor=text_color;
}