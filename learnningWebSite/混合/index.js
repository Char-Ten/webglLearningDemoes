(function() {
    var cvs = document.getElementById("cvs");

    /**@type {WebGLRenderingContext} */
    var gl = cvs.getContext("webgl");
    var programs = {};

    cvs.width = 400;
    cvs.height = 300;

    var pointCoord = new Float32Array([
        50,
        50,
        100,
        1,
        0,
		0,
		0.5,

        100,
        50,
        100,
        0,
        1,
		0,
		0.5
    ]);
    var pb = pointCoord.BYTES_PER_ELEMENT;

    var attris = {
        pointCoord: { type: "buffer", bufferData: pointCoord },
        a_position: { type: "pointer", value: [2, gl.FLOAT, false, 7 * pb, 0] },
        a_size: {
            type: "pointer",
            value: [1, gl.FLOAT, false, 7 * pb, 2 * pb]
        },
        a_color: {
            type: "pointer",
            value: [4, gl.FLOAT, false, 7 * pb, 3 * pb]
        }
    };

    var uniforms = {
        u_resolution: { type: "float", value: [400, 300] }
    };

    gl.viewport(0, 0, 400, 300);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)

    $$utils.createProgramByShadersURL(
        gl,
        "./shaders/v.glsl",
        "./shaders/f.glsl",
        onProgramLoaded
    );

    function onProgramLoaded(program) {
		programs.pointer = program;
		gl.useProgram(program)
        $$utils.setProgramAttribute(gl, programs.pointer, attris);
        $$utils.setProgramUniform(gl, programs.pointer, uniforms);
        gl.drawArrays(gl.POINTS, 0, 2);
    }
})();
