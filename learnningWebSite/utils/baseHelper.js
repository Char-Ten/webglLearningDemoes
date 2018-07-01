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
     * @param {Number} usage
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
     * @param {String} data.type - 可能的值：buffer,pointer,float,int
     * @param {Array|ArrayBuffer} data.value - 要绑定的值
     * @param {Array|ArrayBuffer} data.bufferData - 当type为buffer类型时，创建buffer的数据
     * @param {Number} data.usage - 当type为buffer类型时，创建buffer的类型，默认为gl.STATIC_DRAW
     *
     */
    function setProgramAttribute(gl, program, data) {
        var type = "";
        var value = null;
        var index = 0;
        var len = 0;
        for (var attr in data) {
            type = data[attr].type;
            value = data[attr].value;
            /**
             * @desc 传递buffer类型数据
             * data[attr]={
             * 	type,
             *  bufferData,
             *  usage?
             * }
             */
            if (type === "buffer") {
                createBuffer(
                    gl,
                    data[attr].bufferData,
                    data[attr].usage || gl.STATIC_DRAW
                );
                continue;
            }
            index = gl.getAttribLocation(program, attr);

            /**
             * @desc 设置buffer的读取规则
             * data[attr]={
             * 	type:"pointer",
             *  value:[]
             * }
             */
            if (type === "pointer") {
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
        for (var attr in data) {
            type = data[attr].type;
            value = data[attr].value;
            if (!Array.isArray(value)) {
                continue;
            }

            len = value.length;
            index = gl.getUniformLocation(program, attr);
            if (type === "int") {
                gl["uniform" + len + "iv"](index, value);
                continue;
            }

            if (type === "float") {
                gl["uniform" + len + "fv"](index, value);
                continue;
            }
        }
    }

    /**
	 * 创建纹理贴图
     * @param {WebGLRenderingContext} gl - 使用webgl的上下文
     * @param {Canvas||Image} image - 要作为纹理的图片对象
     * @return {WebglTexture} texture对象
     */
    function createTexByImage(gl, image) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
        );
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            return texture;
        }
        gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_MIN_FILTER,
            gl.NEAREST
        );
        gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_MAG_FILTER,
            gl.NEAREST
        );
        gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_WRAP_S,
            gl.CLAMP_TO_EDGE
        );
        gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_WRAP_T,
            gl.CLAMP_TO_EDGE
        );
        return texture;
    }

    /**检查数字是否为2的指数
     * @param {Number} value - 要检查的值
     * @return {Boolean}
     */
    function isPowerOf2(value) {
        return !(value & (value - 1));
    }

    window.$$utils = {
        getTxt: getTxt,
        loadGlsl: loadGlsl,
        createProgram: createProgram,
        createProgramByShadersURL: createProgramByShadersURL,
        setProgramAttribute: setProgramAttribute,
        setProgramUniform: setProgramUniform,
        createProgram: createProgram,
		createTexByImage: createTexByImage,
		isPowerOf2:isPowerOf2
    };
})();
