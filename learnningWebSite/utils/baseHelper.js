(function() {
	/**
	 *网络请求文本数据
	 *
	 * @param {string} url
	 * @param {function} cb
	 */
	function getTxt(url, cb) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onload = function() {
			cb(xhr.responseText);
		};
		xhr.send();
	}

	/**
	 * 加载glsl
	 *
	 * @param {string} vssURL
	 * @param {string} fssURL
	 * @param {function} cb
	 */
	function loadGlsl(vssURL, fssURL, cb) {
		var data = {
			vss: "",
			fss: ""
		};
		getTxt(vssURL, function(txt) {
			data.vss = txt;
			end();
		});

		getTxt(fssURL, function(txt) {
			data.fss = txt;
			end();
		});

		function end() {
			if (data.vss && data.fss) {
				cb(data);
			}
		}
	}

	/**
	 * 从URL中创建着色器程序
	 *
	 * @param {WebGLRenderingContext} gl
	 * @param {String} vssURL
	 * @param {String} fssURL
	 * @param {function} cb
	 */
	function createProgramByShadersURL(gl, vssURL, fssURL, cb) {
		loadGlsl(vssURL, fssURL, function(data) {
			cb(createProgram(gl, data.vss, data.fss));
		});
	}

	/**
	 * 创建着色器程序
	 * @param {WebGLRenderingContext} gl
	 * @param {String} vss
	 * @param {String} fss
	 */
	function createProgram(gl, vss, fss) {
		var program = gl.createProgram();
		var vShader = createShader(gl, vss, gl.VERTEX_SHADER);
		var fShader = createShader(gl, fss, gl.FRAGMENT_SHADER);
		gl.linkProgram(program);
		gl.useProgram(program);

		return program;

		/**创建着色器 */
		function createShader(webgl, source, type) {
			var shader = webgl.createShader(type);
			webgl.shaderSource(shader, source);
			webgl.compileShader(shader);
			webgl.attachShader(program, shader);
			return shader;
		}
	}

	/**
	 * 创建buffer数据
	 * @param {WebGLRenderingContext} gl
	 * @param {ArrayBuffer} value
	 */
	function createBuffer(gl, value, usage) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, value, usage);
		return buffer;
	}

	/**
	 * 统一设置Attribute
	 *
	 * @param {WebGLRenderingContext} gl
	 * @param {WebGLProgram} program
	 * @param {Object} data
	 */
	function setProgramAttribute(gl, program, data) {
		var type = "";
		var value = null;
		var index = 0;
		var len = 0;
		for (var attr in data) {
			type = data[attr].type;
			value = data[attr].value;
			index = gl.getAttribLocation(program, attr);

			/**
			 * @desc 传递buffer类型数据
			 * data[attr]={
			 * 	type,
			 *  value,
			 *  buffer,
			 *  usage?
			 * }
			 */
			if (type === "buffer") {
				createBuffer(gl, data[attr].bufferData, data[attr].usage || gl.STATIC_DRAW);
				gl.enableVertexAttribArray(index);
				gl.vertexAttribPointer(
					index,
					value[0],
					value[1],
					value[2],
					value[3],
					value[4]
				);
				continue;
			}

			/**
			 * @desc 传递float型数据
			 * data[attr]={
			 * 	type,
			 * 	value:[<int>]
			 * }
			 */
			if (type === "float" && Array.isArray(value)) {
				len = value.length;
				if (len <= 0) {
					continue;
				}
				len > 4 && (len = 4);
				gl["vertexAttrib" + len + "fv"](index, value);
				continue;
			}
		}
	}

	/**
	 * 统一设置Uniform
	 *
	 * @param {WebGLRenderingContext} gl
	 * @param {WebGLProgram} program
	 * @param {Object} data
	 */
	function setProgramUniform(gl, program, data) {
		var type = "";
		var value = null;
		var index = 0;
		var len = 0;
		for(var attr in data){
			type = data[attr].type;
			value = data[attr].value;
			if(!Array.isArray(value)){
				continue;
			}

			len=value.length;
			index = gl.getUniformLocation(program, attr);
			if(type==='int'){
				gl['uniform'+len+'iv'](index,value);			
				continue
			}

			if(type==='float'){
				gl['uniform'+len+'fv'](index,value);
				continue
			}
		}
	}

	window.$$utils = {
		getTxt: getTxt,
		loadGlsl: loadGlsl,
		createProgram: createProgram,
		createProgramByShadersURL: createProgramByShadersURL,
		setProgramAttribute: setProgramAttribute,
		setProgramUniform: setProgramUniform,
		createProgram: createProgram
	};
})();
