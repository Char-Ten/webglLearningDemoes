(function(root, fn) {
    if (typeof define === "function" && define.amd) {
        define(fn);
    } else if (typeof exports === "object") {
        module.exports = fn();
    } else {
        root.StringAnmt2 = fn();
    }
})(this, function() {
    var attributes = {};
    var uniform = {};
    var textures = [];
    var programs = {};

    /**
     * @param {Object} conf
     */
    function Main(conf) {
        this.vdo = document.createElement("video");
        this.vdo.style.position = "fixed";
        this.vdo.style.top = 0;
        this.cvs = document.getElementById(conf.canvasId);
        if (!this.cvs) {
            throw "no canvas";
        }

        this.gl = this.cvs.getContext("webgl");

        if (!this.gl) {
            throw "not support webgl";
        }

        this.text = conf.text || "丨一二三十上土王田正回困国囸昌晶";
        this.fontSize = conf.fontSize || 16;
        this.fontFamily = conf.fontFamily || "Arial";
        this.color = conf.color || [0, 0, 0, 1];
        this.track = null;
        this.isPlay = false;
        this.raf = requestAnimationFrame || webkitRequestAnimationFrame;
        this.type = conf.type;
        this.fps = conf.fps || 60;
        if (!this.raf) {
            throw "not support requestAnimationFrame";
        }

        this.cvs.width = addRatio(this.cvs.offsetWidth);
        this.cvs.height = addRatio(this.cvs.offsetHeight);
        this.gl.viewport(0, 0, this.cvs.width, this.cvs.height);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);

        this.textCanvas = createTextTextrue(this.text, this.fontFamily);

        init(this);

        render(this);
    }

    Main.prototype = {
        constructor: Main,

        /**
         * @method openCamera 开启摄像头
         * @param {Number} w 摄像头图像宽度
         * @param {Number} h 摄像头图像高度
         * @param {Boolean} isAudio 是否录音
         * @param {Boolean} isBack 是否使用后置摄像头
         */
        openCamera: function(w, h, isAudio, isBack) {
            var _this = this;
            var facingMode = "user";
            if (isBack) {
                facingMode = { exact: "environment" };
            }
            var vdo = this.vdo;
            var constraints = {
                audio: isAudio,
                video: {
                    width: w,
                    height: h,
                    facingMode: facingMode
                }
            };
            vdo.width = w;
            vdo.height = h;

            try {
                navigator.mediaDevices
                    .getUserMedia(constraints)
                    .then(function(mediaStream) {
                        _this.track = mediaStream.getTracks()[0];
                        vdo.srcObject = mediaStream;
                        vdo.onloadedmetadata = function() {
                            vdo.play();
                            _this.isVdoPlay = true;
                            textures = [
                                createTexByImage(_this.gl, vdo),
                                createTexByImage(_this.gl, _this.textCanvas)
                            ];
                        };
                    })
                    .catch(function() {
                        alert(
                            "您当前的浏览器不支持或者您拒绝了调用摄像头的请求"
                        );
                        console.error("no support media api or user reject");
                    });
            } catch (e) {
                alert("您当前的浏览器不支持打开摄像头的功能");
            }
        },

        /**@method closeCamera 关闭摄像头 */
        closeCamera: function() {
            if (this.track) {
                this.track.stop();
            }
        },

        /**@method play 播放动画 */
        play: function() {
            this.isPlay = true;
        },

        /**@method pause 暂停 */
        pause: function() {
            this.isPlay = false;
        },

        /**@method toggle 切换播放状态 */
        toggle: function() {
            return (this.isPlay = !this.isPlay);
        },

        /**
         * @method updateText 更新文字
         * @param {String} text 要更新的文字
         */
        updateText: function(text) {
            /**@type {WebGLRenderingContext} */
            var gl = this.gl;

            this.text = text || "丨一二三十上土王田正回困国囸昌晶";
            this.textCanvas = createTextTextrue(this.text, this.fontFamily);
            uniform.u_len.value = [this.text.length];
            if (!textures.length) {
                return;
            }
            if (!programs.points) {
                return;
            }
            setProgramUniform(gl, programs.points, uniform);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(main.gl.TEXTURE_2D, textures[1]);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                this.textCanvas
            );
        },

        /**
         * @method updateFontSize
         * @param {Number} size 新更新的字体大小
         */
        updateFontSize: function(size) {
            /**@type {WebGLRenderingContext} */
            var gl = this.gl;

            this.fontSize = size || 16;

            var points = createSampPoints(
                this.cvs.width,
                this.cvs.height,
                this.fontSize
            );

            attributes.points.bufferData = new Float32Array(points);
            if (!programs.points) {
                return;
            }
            if (attributes.points) {
                return;
            }
            setProgramAttribute(gl, programs.points, attributes);
		},
		
		/** */
		updateStyle:function(conf){
			this.type=conf.type||2;
			this.color=conf.color||[0,0,0,1];
			if(!programs.points){
				return
			}
			var gl=this.gl;
			uniform.u_type.value=[this.type];
			uniform.u_color.value=this.color;
			setProgramUniform(gl,programs.points,uniform);
		}
    };

    function init(main) {
        var _this = main;
        var cvs = _this.cvs;
        /**@type {WebGLRenderingContext} */
        var gl = _this.gl;
        var points = createSampPoints(
            _this.cvs.width,
            _this.cvs.height,
            _this.fontSize
        );

        attributes = {
            points: { type: "buffer", bufferData: new Float32Array(points) },
            a_position: { type: "pointer", value: [2, gl.FLOAT, false, 0, 0] }
        };

        uniform = {
            u_resolution: { type: "float", value: [cvs.width, cvs.height] },
            u_tex1: { type: "int", value: [0] },
            u_tex2: { type: "int", value: [1] },
            u_len: { type: "float", value: [_this.text.length] },
            u_size: { type: "float", value: [_this.fontSize] },
            u_type: { type: "int", value: [_this.type] },
            u_color: { type: "float", value: _this.color }
        };

        createProgramByShadersURL(
            gl,
            "./shaders/v.glsl",
            "./shaders/f.glsl",
            function(program) {
                programs.points = program;
                _this.gl.useProgram(program);
            }
        );
    }
    function render(main) {
        var raf = main.raf;
        var lastTime = new Date().getTime();

        loop();
        function loop() {
            var time = new Date().getTime();

            if (!programs.points) {
                raf(loop);
                return;
            }
            if (!textures.length) {
                raf(loop);
                return;
            }
            if (!main.isVdoPlay) {
                raf(loop);
                return;
            }
            if (!main.hasInit) {
                main.hasInit = true;
                setProgramAttribute(main.gl, programs.points, attributes);
                setProgramUniform(main.gl, programs.points, uniform);
                main.gl.activeTexture(main.gl.TEXTURE0);
                main.gl.bindTexture(main.gl.TEXTURE_2D, textures[0]);
                main.gl.activeTexture(main.gl.TEXTURE1);
                main.gl.bindTexture(main.gl.TEXTURE_2D, textures[1]);
            }
            if (!main.isPlay) {
                raf(loop);
                return;
            }
            if (time - lastTime < main.fps) {
                raf(loop);
                return;
            }

            lastTime = time;

            main.gl.activeTexture(main.gl.TEXTURE0);
            main.gl.bindTexture(main.gl.TEXTURE_2D, textures[0]);
            main.gl.texImage2D(
                main.gl.TEXTURE_2D,
                0,
                main.gl.RGBA,
                main.gl.RGBA,
                main.gl.UNSIGNED_BYTE,
                main.vdo
            );

            main.gl.clear(main.gl.COLOR_BUFFER_BIT);
            main.gl.drawArrays(
                main.gl.POINTS,
                0,
                attributes.points.bufferData.length / 2
            );

            raf(loop);
        }
    }

    /**创建采样点 */
    function createSampPoints(width, height, step) {
        var a = [];

        for (var i = 0; i <= height; i += step) {
            for (var j = 0; j <= width; j += step) {
                a.push(j, i);
            }
        }
        return a;
    }

    /**
     * 创建文字纹理
     * @param {String} text - 要成为纹理的文字
     * @param {String} fontFamily - 文字的字体
     * @return {HTMLCanvasElement}
     */
    function createTextTextrue(text, fontFamily) {
        var cvs = document.createElement("canvas");
        var ctx = cvs.getContext("2d");

        cvs.width = 32 * text.length;
        cvs.height = 32;

        ctx.font = "32px " + fontFamily;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        text.split("").forEach(function(word, i) {
            ctx.fillText(word, i * 32 + 16, 16);
        });

        return cvs;
    }

    function addRatio(n) {
        return n * (window.devicePixelRatio || 1);
    }

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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
    }

    /**检查数字是否为2的指数
     * @param {Number} value - 要检查的值
     * @return {Boolean}
     */
    function isPowerOf2(value) {
        return !(value & (value - 1));
    }

    return Main;
});
