(function() {
    function Particle(options) {
        this.publicOptions = options.public || {};
        this.posCoord = {
            x: options.x || 0,
            y: options.y || 0
        };
        this.count = options.count || 0;
        this.plist = [];

        for (var i = 0; i < this.count; i++) {
            this.plist.push(this.createParticle({ index: i }));
        }
    }

    Particle.prototype.createParticle = function(options) {
        var json = {};
        var publicOptions = this.publicOptions;
        var setDefault = function(attr) {
            return options[attr] || publicOptions[attr];
        };
        var random = function() {
            return 2.0 * (Math.random() - 0.5);
        };
        json.index = options.index;
        json.x = setDefault("x") || this.posCoord.x;
        json.y = setDefault("y") || this.posCoord.y;
        json.vx = (setDefault("vx") || 0) * random();
        json.vy = (setDefault("vy") || 0) * random();
        json.ax = (setDefault("ax") || 0) * random();
        json.ay = (setDefault("ay") || 0) * random();
        json.size = setDefault("size") || 5;
        json.vsize = setDefault("vsize") || 0;
        json.asize = setDefault("asize") || 0;
        json.life = (setDefault("life") || 1000) * Math.random();
        json.createTime = new Date().getTime();
        json.lastTime = json.createTime;
        json.angle = setDefault("angle") || 0;
        json.vangle = setDefault("vangle") || 0;
        json.aangle = setDefault("aangle") || 0;
        return json;
    };

    Particle.prototype.update = function(callback) {
        var p = {};
        var time = new Date().getTime();
        var step = 0;
        for (var i = 0; i < this.plist.length; i++) {
            p = this.plist[i];

            step = time - p.lastTime;
            p.lastTime = time;
            if (p.lastTime - p.createTime > p.life) {
                this.plist[i] = this.createParticle({});
            } else {
                attrUpdate(p, "x", step);
                attrUpdate(p, "y", step);
                attrUpdate(p, "size", step);
                p.size < 0 && (p.size = 0);
                attrUpdate(p, "angle", step);
            }
            if (typeof callback === "function") {
                callback(p, i);
            }
        }
    };

    function attrUpdate(target, attr, step) {
        target["v" + attr] += (target["a" + attr] * step) / 1000;
        target[attr] += (target["v" + attr] * step) / 1000;
    }

    window.Particle = Particle;
})();

(function() {
    var cvs = document.getElementById("cvs");

    /**@type {WebGLRenderingContext} */
    var gl = cvs.getContext("webgl");
    var programs = {};
    var particle = new Particle({
        count: 1000,
        x: 50,
        y: 50,
        public: {
            vx: addRatio(10),
            vy: addRatio(10),
            ax:addRatio(320),
            ay: addRatio(320),
            size: 40,
            vsize: -40,
            life: 1000
        }
	});
	var vx=0;
	var vy=0;
    var data = createBufferByPlist(particle.plist);
    var posBuffer = new Float32Array(data.pos);
    var pB = posBuffer.BYTES_PER_ELEMENT;
    var attributes = {
        posBuffer: { type: "buffer", bufferData: posBuffer },
		a_position: { type: "pointer", value: [2, gl.FLOAT, false, 6*pB, 0] },
		a_color:{type:"pointer",value:[3,gl.FLOAT,false,6*pB,2*pB]},
		a_size:{type:"pointer",value:[1,gl.FLOAT,false,6*pB,5*pB]}
	};
    var uniforms = {
        u_resolution: { type: "float", value: [ addRatio(cvs.offsetWidth), addRatio(cvs.offsetHeight)] }
	};

	var reqAnmtF = new FrameRunner(60);
	
	cvs.width = addRatio(cvs.offsetWidth);
    cvs.height = addRatio(cvs.offsetHeight);

    reqAnmtF.onUpdate(function() {
		particle.posCoord.x+=vx;
		particle.posCoord.y+=vy;
		if(particle.posCoord.x>cvs.width){
			particle.posCoord.x=cvs.width;
		}
		if(particle.posCoord.x<0){
			particle.posCoord.x=0;
		}
		if(particle.posCoord.y>cvs.height){
			particle.posCoord.y=cvs.height;
		}
		if(particle.posCoord.y<0){
			particle.posCoord.y=0;
		}


        particle.update(updatePosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, posBuffer, gl.STATIC_DRAW);
        draw();
    });

    

    cvs.addEventListener("mousemove", function(e) {
        particle.posCoord.x = addRatio(e.offsetX);
        particle.posCoord.y = addRatio(e.offsetY);
    });
    cvs.addEventListener("touchmove", function(e) {
        e.preventDefault();
        particle.posCoord.x =addRatio( e.touches[0].pageX);
        particle.posCoord.y = addRatio(e.touches[0].pageY);
	});
	
	window.addEventListener("deviceorientation",function(e){
		vy=e.beta;
		vx=e.gamma;
	})


    gl.viewport(0, 0, cvs.width, cvs.height);
    gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)

    $$utils.createProgramByShadersURL(
        gl,
        "./shaders/v.glsl",
        "./shaders/f.glsl",
        onProgramLoaded
    );

    window.draw = function() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, particle.plist.length);
    };

    function onProgramLoaded(program) {
        programs.setCoord = program;
        gl.useProgram(programs.setCoord);
        $$utils.setProgramAttribute(gl, program, attributes);
		$$utils.setProgramUniform(gl, program, uniforms);
		gl.clear(gl.COLOR_BUFFER_BIT);
        // gl.drawArrays(gl.POINTS, 0, particle.plist.length);
        reqAnmtF.start();
    }

    function updatePosBuffer(p, i) {
        var a = createPoint(p);
        a.forEach(function(item, j) {
            posBuffer[i * 6 + j] = item;
        });
    }

    function createBufferByPlist(list) {
        var pos = [];
        for (var i = 0; i < list.length; i++) {
            pos = pos.concat(createPoint(list[i]));
        }

        return {
            pos: pos
        };
    }

    function createPoint(p) {
        var x = p.x;
        var y = p.y;
        var size = p.size;
        var color = p.color || [0, 0, 0];

        return [
			x, y,color[0],color[1],color[2],addRatio(size)
		];
	}
	
	function addRatio(n){
		return n*(window.devicePixelRatio||1)
	}
})();
