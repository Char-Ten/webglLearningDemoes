(function() {
    var cvs = document.getElementById("cvs");

    /**@type {WebGLRenderingContext} */
    var gl = cvs.getContext("webgl");
	var programs = {};
	var textures=[];
	var points=new Float32Array();

	cvs.width=400;
	cvs.height=300;

	gl.viewport(0,0,400,300)
	
	var img=new Image();
	var attributes={
		points:{type:'buffer',bufferData:new Float32Array()},
		a_position:{type:'pointer',value:[2,gl.FLOAT,false,0,0]}
	}
	var uniforms={
		u_resolution: { type: "float", value: [ addRatio(cvs.offsetWidth), addRatio(cvs.offsetHeight)] },
		u_tex1:{type:'int',value:[0]},
		u_tex2:{type:'int',value:[1]}
	}
	
	img.onload=onImageLoaded;

	img.src="./img/test.jpg";

	function onImageLoaded(){
		textures.push($$utils.createTexByImage(gl,img));
		points=new Float32Array(createSampPoints(img.width,img.height,16));
		
		attributes.points.bufferData=points;


		$$utils.createProgramByShadersURL(gl,'./shaders/v.glsl','./shaders/f.glsl',onProgarmLoaded);
	}
	
	function onProgarmLoaded(program){
		programs.twoTex=program;
		gl.useProgram(program);
		$$utils.setProgramAttribute(gl,program,attributes);
		$$utils.setProgramUniform(gl,program,uniforms);
		console.log(points)
		gl.drawArrays(gl.POINTS,0,points.length/2)
		
	}

	function createSampPoints(width,height,step){
		var a=[];

		for(var i=0;i<=height;i+=step){
			for(var j=0;j<=width;j+=step){
				a.push(j,i)
			}
		}
		return a;
	}


	function addRatio(n){
		return n*(window.devicePixelRatio||1)
	}

})();


