(function() {
    /**@type {HTMLCanvasElement} */
    var canvas = document.getElementById('cvs');
    var gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    var rto = window.devicePixelRatio || 1;
    if (!gl) {
        return;
    }
    var program = null;
    var texture = null;
    var width = canvas.offsetWidth * rto;
    var height = canvas.offsetHeight * rto;
    var rectPosition = new Float32Array([
        0,
        0,
		0,height,
		width,height,
		width,0,
    ]);
    var buffer = gl.createBuffer();
    var img = new Image();
    var complateState = 0;

	var U_RESOLUTION = null;
	var U_IMAGE_SIZE = null;
	var U_TEX = null;
	var U_TIME = null;
	var A_POSITION = null;

    img.onload = onComplate;
    img.src = './img/test.png';
    gl.viewport(0, 0, width, height);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, rectPosition, gl.STATIC_DRAW);
    gl.clearColor(0, 0, 0, 0);
    canvas.width = width;
    canvas.height = height;
    $$utils.createProgramByShadersURL(
        gl,
        './shader/v.glsl',
        './shader/f.glsl',
        onComplate
	);
	window.addEventListener('resize',onResize)

    function onComplate(p) {
        complateState++;
        if (p instanceof WebGLProgram) {
            program = p;
        }
        if (complateState >= 2) {
            onProgramInit(p);
        }
    }

    function onProgramInit() {
		bindLocation();
		gl.activeTexture(gl.TEXTURE0);
		texture = $$utils.createTexByImage(gl, img);
        gl.useProgram(program);
		gl.uniform2f(U_RESOLUTION, width, height);
		gl.uniform2f(U_IMAGE_SIZE,img.width,img.height);
        gl.uniform1i(U_TEX, 0);
        gl.enableVertexAttribArray(A_POSITION);
        gl.vertexAttribPointer(A_POSITION, 2, gl.FLOAT, false, 0, 0);
        run();
    }

    function bindLocation() {
        U_RESOLUTION = gl.getUniformLocation(program, 'u_resolution');
		U_TEX = gl.getUniformLocation(program, 'u_tex');
		U_IMAGE_SIZE = gl.getUniformLocation(program,'u_image_size');
		U_TIME = gl.getUniformLocation(program,'u_time');
        A_POSITION = gl.getAttribLocation(program, 'a_position');
	}
	
	function run(time){
		gl.uniform1f(U_TIME,time/1000);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		requestAnimationFrame(run);
	}

	function onResize(){
		if(complateState<2){
			return
		}
		width = canvas.offsetWidth * rto;
		height = canvas.offsetHeight * rto;
		canvas.width = width;
		canvas.height = height;
		gl.viewport(0, 0, width, height);
		gl.uniform2f(U_RESOLUTION,width,height);
	}
})();
