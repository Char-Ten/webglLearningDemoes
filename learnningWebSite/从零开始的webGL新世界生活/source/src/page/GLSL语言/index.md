
```glsl
//顶点着色器
precision mediump float;
attribute vec2 a_position;
uniform vec2 u_resolution;
void main(){
	// 从像素坐标转换到 [0.0,1.0]这个区间内
    vec2 st = a_position / u_resolution;

    // 然后再把[0.0,1.0]映射到[-1.0,1.0]这个区间内，然后y轴翻转
    vec2 position = (2.0 * st - 1.0) * vec2(1,-1);

    // 确定点的位置
    gl_Position=vec4(position,0.0,1.0);
}
```
---
```glsl
//片元着色器
precision mediump float;

void main(){
	gl_FragColor=vec4(1,0,0.5,1);
}

```