(function() {
    var form = document.getElementById("form");
    var uploader = document.getElementById("uploadImage");
	var cvs = document.getElementById("cvs");
	var programs={}

    /**@type {WebGLRenderingContext} */
    var gl = cvs.getContext("webgl");
    var w = (cvs.width = cvs.offsetWidth);
    var h = (cvs.height = cvs.offsetHeight);
	var attributes={
		'rect':{type:'buffer',bufferData:createRectBuffer(0,0,400,300)},
		'a_position':{type:'pointer',value:[2,gl.FLOAT,false,0,0]},
		'texPosBuf':{type:'buffer',bufferData:createRectBuffer(0,0,1.0,1.0)},
		'a_TexCoord':{type:'pointer',value:[2,gl.FLOAT,false,0,0]}
	}
	var uniforms={
		'u_resolution':{type:'float',value:[400,300]}
	}
	

    gl.viewport(0, 0, w, h);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

	uploader.addEventListener("change", onImageUpload);
	$$utils.createProgramByShadersURL(gl,"./shaders/v.glsl","./shaders/f.glsl",onProgramLoaded);

	function onProgramLoaded(program){
		programs.renderImage=program;
		gl.useProgram(program);
		$$utils.setProgramAttribute(gl,program,attributes);
		$$utils.setProgramUniform(gl,program,uniforms);
	
	}

    /**@param {Event} evt */
    function onImageUpload(evt) {
        var file = evt.target.files[0];
        var fr = new FileReader();
        fr.addEventListener("load", function() {
            onReadURLEnd(fr.result);
            form.reset();
        });
        fr.readAsDataURL(file);
    }

    function onReadURLEnd(url) {
        var img = new Image();
        img.addEventListener("load", function() {
            onImageLoad(img);
        });
        img.src = url;
    }

    function onImageLoad(img) {
		var texture=$$utils.createTexByImage(gl,img);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		attributes.rect.bufferData=createRectBuffer(0,0,400,300);
		uniforms.u_image_resolution={type:'float',value:[img.width,img.height]}
		$$utils.setProgramAttribute(gl,programs.renderImage,attributes);
		$$utils.setProgramUniform(gl,programs.renderImage,uniforms)
		gl.drawArrays(gl.TRIANGLES,0,6)
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
