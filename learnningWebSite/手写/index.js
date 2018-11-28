(function() {
	var cvs = document.getElementById("cvs");
	var cvs2 = document.getElementById("cvs2");
	var ctx=cvs2.getContext("2d")

    /**@type {WebGLRenderingContext} */
    var gl = cvs.getContext("webgl");
	var programs = {};
	var points=new Float32Array([]);

	var w=cvs.width=cvs2.width=cvs.offsetWidth;
	var h=cvs.height=cvs2.height=cvs.offsetHeight;


	var attributes = {
		points:{type:"buffer",bufferData:points},
		a_position:{type:"pointer",value:[2,gl.FLOAT,false,0,0]}
	}
	var uniforoms ={
		u_resolution:{type:"float",value:[w,h]},
		u_texture:{type:"int",value:[0]}
	}

	var attributesRect = {
		points:{type:"buffer",bufferData:createRectBuffer(0,0,w,h)},
		a_position:{type:"pointer",value:[2,gl.FLOAT,false,0,0]}
	}

	var texture = $$utils.createTexByImage(gl,cvs);
	
	$$utils.updateTexture(gl,gl.TEXTURE0,texture,cvs);
	

	gl.viewport(0,0,w,h);
	gl.clearColor(0,0,0,0);

	$$utils.createProgramByShadersURL(gl,'./shaders/v.glsl','./shaders/f.glsl',onProgramLoaded);
	$$utils.createProgramByShadersURL(gl,'./shaders/v.glsl','./shaders/rect.f.glsl',onRectProgramLoaded);
	function onProgramLoaded(program){
		programs.points=program;
		gl.useProgram(programs.points);		
		$$utils.setProgramAttribute(gl,programs.points,attributes);
		$$utils.setProgramUniform(gl,programs.points,uniforoms);
	}

	function onRectProgramLoaded(program){
		programs.rect=program;
		gl.useProgram(programs.rect);
		$$utils.setProgramAttribute(gl,programs.rect,attributesRect);
		$$utils.setProgramUniform(gl,programs.rect,uniforoms);
	}

	var isBegin=false;
	var p=[];
	
	cvs.addEventListener("mousedown",function(e){
		ctx.drawImage(cvs,0,0)
		isBegin=true;
		$$utils.updateTexture(gl,gl.TEXTURE0,texture,cvs);
		p=[e.offsetX,e.offsetY];
		points=new Float32Array(p);
		draw();
	});

	cvs.addEventListener("mousemove",function(e){
		if(!isBegin){
			return
		}
		p.push(e.offsetX,e.offsetY);
		points=new Float32Array(p);
		draw();
		drawBg();
	});

	cvs.addEventListener("mouseup",function(e){
		isBegin=false;
		drawBg();
	});


	function draw(){
		gl.useProgram(programs.points);
		gl.bufferData(gl.ARRAY_BUFFER,points,gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLE_STRIP,0,Math.floor(points.length/2))
	}

	function drawBg(){
		// ctx.clearRect(0,0,w,h)
		ctx.drawImage(cvs,0,0)
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
