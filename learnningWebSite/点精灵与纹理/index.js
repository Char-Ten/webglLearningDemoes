// (function() {
//     var cvs = document.getElementById("cvs");

//     /**@type {WebGLRenderingContext} */
//     var gl = cvs.getContext("webgl");
//     var programs = {};
//     var textures = [];
//     var points = new Float32Array();

//     cvs.width = 400;
//     cvs.height = 300;

//     gl.viewport(0, 0, 400, 300);

//     var img = new Image();
//     var attributes = {
//         points: { type: "buffer", bufferData: new Float32Array() },
//         a_position: { type: "pointer", value: [2, gl.FLOAT, false, 0, 0] }
//     };
//     var uniforms = {
//         u_resolution: {
//             type: "float",
//             value: [addRatio(cvs.offsetWidth), addRatio(cvs.offsetHeight)]
//         },
//         u_tex1: { type: "int", value: [0] },
//         u_tex2: { type: "int", value: [1] }
//     };

//     img.onload = onImageLoaded;

//     img.src = "./img/test.jpg";

//     function onImageLoaded() {
//         textures.push($$utils.createTexByImage(gl, img));
//         points = new Float32Array(createSampPoints(img.width, img.height, 16));

//         attributes.points.bufferData = points;

//         $$utils.createProgramByShadersURL(
//             gl,
//             "./shaders/v.glsl",
//             "./shaders/f.glsl",
//             onProgarmLoaded
//         );
//     }

//     function onProgarmLoaded(program) {
//         programs.twoTex = program;
//         gl.useProgram(program);
//         $$utils.setProgramAttribute(gl, program, attributes);
//         $$utils.setProgramUniform(gl, program, uniforms);
//         console.log(points);
//         gl.drawArrays(gl.POINTS, 0, points.length / 2);
//     }

//     function createSampPoints(width, height, step) {
//         var a = [];

//         for (var i = 0; i <= height; i += step) {
//             for (var j = 0; j <= width; j += step) {
//                 a.push(j, i);
//             }
//         }
//         return a;
//     }

//     function addRatio(n) {
//         return n * (window.devicePixelRatio || 1);
//     }
// })();
render("cvs1","./shaders/v.glsl", "./shaders/f2.glsl")
render("cvs2","./shaders/v.glsl", "./shaders/f3.glsl")
render("cvs3","./shaders/v.glsl", "./shaders/f4.glsl")


function render(id, vurl, furl) {
    var cvs = document.getElementById(id);

    /**@type {WebGLRenderingContext} */
    var gl = cvs.getContext("webgl");
    var programs = {};
    var textures = [];
	var points = new Float32Array();
	var text="萌萌哒的康娜酱"

    

    var img = new Image();
    var attributes = {
        points: { type: "buffer", bufferData: new Float32Array() },
        a_position: { type: "pointer", value: [2, gl.FLOAT, false, 0, 0] }
    };
    var uniforms = {
        u_resolution: {
            type: "float",
            value: [addRatio(cvs.offsetWidth), addRatio(cvs.offsetHeight)]
        },
        u_tex1: { type: "int", value: [0] },
		u_tex2: { type: "int", value: [1] },
		u_len: {type:"float",value:[text.length]}
    };

    img.onload = onImageLoaded;

    img.src = "./img/test.jpg";

    function onImageLoaded() {
		cvs.width = img.width;
		cvs.height = img.height;

		gl.viewport(0, 0, img.width, img.height);

		textures.push($$utils.createTexByImage(gl, img));
		textures.push($$utils.createTexByImage(gl,createTextTextrue(
			text,
			"微软雅黑"
		)));
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D,textures[0]);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D,textures[1])
        points = new Float32Array(createSampPoints(img.width, img.height, 32));

		uniforms.u_resolution.value=[cvs.width, cvs.height]
        attributes.points.bufferData = points;

        $$utils.createProgramByShadersURL(
            gl,
			vurl,
			furl,
            onProgarmLoaded
        );
    }

    function onProgarmLoaded(program) {
        programs.twoTex = program;
        gl.useProgram(program);
        $$utils.setProgramAttribute(gl, program, attributes);
        $$utils.setProgramUniform(gl, program, uniforms);
        gl.drawArrays(gl.POINTS, 0, points.length / 2);
    }

    function createSampPoints(width, height, step) {
        var a = [];

        for (var i = 0; i <= height; i += step) {
            for (var j = 0; j <= width; j += step) {
                a.push(j, i);
            }
		}
		console.log(a);
        return a;
    }

    function addRatio(n) {
        return n * (window.devicePixelRatio || 1);
    }
}

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
	console.log(text)
	document.body.appendChild(cvs)

	return cvs;
}