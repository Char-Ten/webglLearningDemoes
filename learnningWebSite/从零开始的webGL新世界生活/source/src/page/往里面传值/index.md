```javascript
	/**创建顶点缓存 */
	function createRectBuffer(x,y,w,h){
		return new Float32Array([
			x,y,
			x,y+h,
			x+w,y+h,
			x+w,y+h,
			x+w,y,
			x,y
		])
	}

	// 创建顶点
	var points = createRectBuffer(0,0,100,100);

	//创建buffer
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

	//将顶点写入内存
	gl.bufferData(gl.ARRAY_BUFFER, points , gl.STATIC_DRAW);

	// 获取a_position的内存地址
	var index = gl.getAttribLocation(program,'a_position'),

	// 激活a_position
	gl.enableVertexAttribArray(index);

	// 往a_position写值（规定a_position读取buffer的规则）
	// 读两个点，float类型，不需要归一化，两次点集相隔0，从0位开始读取
	gl.vertexAttribPointer(index, 2, gl.FLOAT, false, 0, 0);

	// 传递unifrom变量
	gl.uniform2fv(
		gl.getUniformLocation(program,'u_resolution'),
		[cvs.width,cvs.height]
	)
```
