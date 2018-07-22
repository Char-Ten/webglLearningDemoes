(function() {
	var cvs = document.getElementById("cvs");
    /**@type {WebGLRenderingContext} */
    var gl = cvs.getContext("webgl");
	var programs = {};
	var textures=[];
	var points=new Float32Array();
	var textObj=createTextTex("ABCD");

	cvs.width=400;
	cvs.height=300;

	gl.viewport(0,0,400,300);
	
	
	var img=new Image();
	var attributes={
		points:{type:'buffer',bufferData:new Float32Array()},
		a_position:{type:'pointer',value:[2,gl.FLOAT,false,0,0]}
	}
	var uniforms={
		u_resolution: { type: "float", value: [ addRatio(cvs.offsetWidth), addRatio(cvs.offsetHeight)] },
		u_tex1:{type:'int',value:[0]},
		u_tex2:{type:'int',value:[1]},
		u_len:{type:'float',value:[textObj.length]}
	}
	
	img.onload=onImageLoaded;

	img.src="./img/test.jpg";

	function onImageLoaded(){
		textures.push($$utils.createTexByImage(gl,img));
		
		textures.push($$utils.createTexByImage(gl,textObj.cvs));

		points=new Float32Array(createSampPoints(img.width,img.height,16));
		
		attributes.points.bufferData=points;

		$$utils.createProgramByShadersURL(gl,'./shaders/v.glsl','./shaders/f.glsl',onProgarmLoaded);
	}
	
	function onProgarmLoaded(program){
		programs.twoTex=program;
		gl.useProgram(program);
		$$utils.setProgramAttribute(gl,program,attributes);
		$$utils.setProgramUniform(gl,program,uniforms);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D,textures[0]);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D,textures[1]);
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

	function createTextTex(text){
		var text=text||'丨一二三十上土王田正回困国囸昌晶';
		var cvs=document.createElement("canvas");
		var ctx=cvs.getContext("2d");

		cvs.width=32*text.length;
		cvs.height=32;

		ctx.font='32px Arial';
		ctx.fontAlign="center";
		ctx.textBaseline="middle"
		ctx.fillText(text,0,16);
		for(var i=0;i<text.length;i++){
			ctx.strokeRect(i*32,0,32,32)
		}

		document.body.appendChild(cvs);
		return {
			cvs:cvs,
			length:text.length
		}
	}

})();



