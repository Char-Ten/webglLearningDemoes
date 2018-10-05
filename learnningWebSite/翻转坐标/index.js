(function() {
    var cvs = document.getElementById("cvs");

    /**@type {WebGLRenderingContext} */
    var gl = cvs.getContext("webgl");
    var programs = {};

    var posCoord = new Float32Array([
		0,0,
		0,100,
		100,100,
		100,100,
		100,0,
		0,0
	]);
    var attributes = {
        posCoord: { type: "buffer", bufferData: posCoord },
        a_position: { type: "pointer", value: [2, gl.FLOAT, false, 0, 0] }
    };
    var uniforms = {
        u_resolution: { type: "float", value: [400, 300] }
    };

    cvs.width = 400;
    cvs.height = 300;

    gl.viewport(0, 0, 400, 300);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    $$utils.createProgramByShadersURL(
        gl,
        "./shaders/v.glsl",
        "./shaders/f.glsl",
        onProgramLoaded
    );

    /**
     *
     *
     * @param {WebGLProgram} program
     */
    function onProgramLoaded(program) {
        programs.setCoord = program;
        gl.useProgram(programs.setCoord);
        $$utils.setProgramAttribute(gl, program, attributes);
        $$utils.setProgramUniform(gl, program, uniforms);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
	
	window.updateRenderer=function(x,y,w,h){
		attributes.posCoord.bufferData=createRectBuffer(x,y,w,h);
		$$utils.setProgramAttribute(gl, programs.setCoord, attributes);
		$$utils.setProgramUniform(gl, programs.setCoord, uniforms);
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

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
})();
