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
            this.plist.push(this.createParticle({index:i}));
        }
    }

    Particle.prototype.createParticle = function(options) {
        var json = {};
        var publicOptions = this.publicOptions;
        var setDefault = function(attr) {
            return options[attr] || publicOptions[attr];
		};
		var random=function(){
			return 2.0*(Math.random()-.5);
		}
		json.index=options.index;
        json.x = setDefault("x") || this.posCoord.x;
        json.y = setDefault("y") || this.posCoord.y;
        json.vx = (setDefault("vx") || 0) *random();
        json.vy = (setDefault("vy") || 0) *random();
        json.ax = (setDefault("ax") || 0)*random();
        json.ay = (setDefault("ay") || 0)*Math.random();
        json.size = setDefault("size") || 5;
        json.vsize = setDefault("vsize") || 0;
        json.asize = setDefault("asize") || 0;
        json.life = (setDefault("life") || 1000)*Math.random();
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
        count: 2000,
        x: 50,
        y: 50,
        public: {
            vx: 10,
			vy: 10,
			ax: 20,
			ay: -50,
            size: 10,
            vsize: -5,
            life: 5000
        }
    });
    var data = createBufferByPlist(particle.plist);
	var posBuffer = new Float32Array(data.pos);
	var pB=posBuffer.BYTES_PER_ELEMENT

    var attributes = {
        posBuffer: { type: "buffer", bufferData: posBuffer },
		a_position: { type: "pointer", value: [2, gl.FLOAT, false, 6*pB, 0] },
		a_color:{type:"pointer",value:[4,gl.FLOAT,false,6*pB,2*pB]}
    };
    var uniforms = {
        u_resolution: { type: "float", value: [400, 300] }
    };

    var reqAnmtF = new FrameRunner(60);

    reqAnmtF.onUpdate(function() {
        particle.update(updatePosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, posBuffer, gl.STATIC_DRAW);
        draw();
    });

    cvs.width = 400;
    cvs.height = 300;

    cvs.addEventListener("mousemove", function(e) {
        particle.posCoord.x = e.offsetX;
        particle.posCoord.y = e.offsetY;
    });
    cvs.addEventListener("touchmove", function(e) {
		e.preventDefault();
        particle.posCoord.x = e.touches[0].pageX;
        particle.posCoord.y = e.touches[0].pageY;
    });

    gl.viewport(0, 0, 400, 300);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    $$utils.createProgramByShadersURL(
        gl,
        "./shaders/v.glsl",
        "./shaders/f.glsl",
        onProgramLoaded
    );

    window.draw = function() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, particle.plist.length * 6);
    };

    function onProgramLoaded(program) {
        programs.setCoord = program;
        gl.useProgram(programs.setCoord);
        $$utils.setProgramAttribute(gl, program, attributes);
        $$utils.setProgramUniform(gl, program, uniforms);
        reqAnmtF.start();
    }

    function updatePosBuffer(p, i) {
        var a = createRect(p.x, p.y, p.size, p.size,1,p.size/10,p.size/20);
        a.forEach(function(item, j) {
            posBuffer[i * 36 + j] = item;
		});
		
    }

    function createBufferByPlist(list) {
        var pos = [];
        for (var i = 0; i < list.length; i++) {
            pos = pos.concat(
                createRect(list[i].x, list[i].y, list[i].size, 2*list[i].size)
            );
        }

        return {
            pos: pos
        };
    }

    function createRect(x, y, w, h,r=0,g=0,b=0) {
        return [
			x, y, r,g,b,1,
			x, y + h,r,g,b,1,
			x + w, y + h,r,g,b,1,
			x + w, y + h,r,g,b,1,
			x + w, y,r,g,b,1,
			x, y,r,g,b,1,
		];
    }
    function createRectCenter(x, y, w, h) {
        return [(x + w) / 2, (y + h) / 2];
    }

    function createRotateM(r) {
        var c = Math.cos(r);
        var s = Math.sin(r);
        return [c, -s, 0, s, c, 0, 0, 0, 1];
    }
})();
