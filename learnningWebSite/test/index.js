(function () {
	var cvs = document.getElementById('cvs');

	/**@type {WebGLRenderingContext} gl*/
	var gl = cvs.getContext('webgl');
	var w = cvs.width = cvs.offsetWidth;
	var h = cvs.height = cvs.offsetHeight;
	var programs = {};

	var rect = new Float32Array([
		-1.0, -1.0,
		1.0, 0.0, 0.0,
		1.0, -1.0,
		0.0, 1.0, 0.0,
		-1.0, 1.0,
		0.0, 0.0, 1.0,
		-1.0, 1.0,
		1.0, 1.0, 0.0,
		1.0, -1.0,
		1.0, 0.0, 1.0,
		1.0, 1.0,
		0.0, 1.0, 1.0,
	]);

	var uniforms = {
		'u_color': { type: 'float', value: [1.0, 0.0, 0.0] }
	}
	var attributes = {
		'rect': { type: 'buffer', bufferData: rect },
		// 点数 类型 是否归一化 到下一个数据跳多少位内存 从缓冲起始位置开始获取
		'a_Position': { type: 'pointer', value: [2, gl.FLOAT, false, 5 * rect.BYTES_PER_ELEMENT, 0] },
		'a_PointColor': { type: 'pointer', value: [3, gl.FLOAT, false, 5 * rect.BYTES_PER_ELEMENT, 2 * rect.BYTES_PER_ELEMENT] }
	}

	gl.viewport(0, 0, w, h);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);



	$$utils.createProgramByShadersURL(
		gl,
		'./shaders/v.glsl',
		'./shaders/f.glsl',
		onProgramLoad
	);

	function onProgramLoad(program) {
		programs.test = program;
		$$utils.setProgramAttribute(gl, program, attributes);
		$$utils.setProgramUniform(gl, program, uniforms);
		gl.drawArrays(gl.TRIANGLES, 0, 6)
	}

	cvs.addEventListener('mousemove', function (e) {
		if (!programs.test) {
			return
		}

		uniforms['u_mouse'] = { type: 'float', value: [(e.offsetX / w).toFixed(2), (e.offsetY / h).toFixed(2)] }
		$$utils.setProgramAttribute(gl, programs.test, attributes);
		$$utils.setProgramUniform(gl, programs.test, uniforms);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.drawArrays(gl.TRIANGLES, 0, 6)
	})



})();