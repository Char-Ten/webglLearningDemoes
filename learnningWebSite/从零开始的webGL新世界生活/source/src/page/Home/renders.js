import * as gt from "#/js/lib/glTools";
import vss from "./shaders/v.glsl";
import fss from "./shaders/f.glsl";
export default function() {
	const cvs = this.cvs;

	/**@type {WebGLRenderingContext}*/

	const gl = this.gl;

	let isPlay = true;

	const w = (cvs.width = cvs.offsetWidth);
	const h = (cvs.height = cvs.offsetHeight);
	const particle = new Particle({
		x: w / 2,
		y: (2 * h) / 3,
		count: 5000,
		pub: {
			vx: 10,
			vy: 10,
			ax: 25,
			ay: -250,
			size: 100,
			vsize: -30,
			life: 5000
		}
	});
	const points = new Float32Array(particle.createBufferList());

	const pb = points.BYTES_PER_ELEMENT;
	const attributes = {
		points: { type: "buffer", bufferData: points },
		a_position: { type: "pointer", value: [2, gl.FLOAT, false, 6 * pb, 0] },
		a_color: {
			type: "pointer",
			value: [3, gl.FLOAT, false, 6 * pb, 2 * pb]
		},
		a_size: { type: "pointer", value: [1, gl.FLOAT, false, 6 * pb, 5 * pb] }
	};
	const uniforms = {
		u_resolution: { type: "float", value: [w, h] }
	};

	const program = gt.createProgram(gl, vss, fss);

	gl.viewport(0, 0, cvs.width, cvs.height);
	gl.clearColor(0, 0, 0, 0);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.useProgram(program);
	gt.setProgramAttribute(gl, program, attributes);
	gt.setProgramUniform(gl, program, uniforms);
	gl.drawArrays(gl.POINTS, 0, particle.count);

	function run(time) {
		if (!isPlay) {
			return;
		}
		particle.update((p, i) => {
			points[i * 6] = p.x;
			points[i * 6 + 1] = p.y;
			points[i * 6 + 5] = p.size;
		});

		gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.POINTS, 0, particle.count);

		requestAnimationFrame(run);
	}
	run();

	return () => {
		isPlay = false;
	};
}

class Particle {
	constructor(options) {
		this.publicOptions = options.pub || {};
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
	createParticle(options) {
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
		json.ay = (setDefault("ay") || 0) * Math.random();
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
	}
	update(callback) {
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
	}
	createBufferList() {
		return this.plist.reduce((a, item) => {
			a.push(
				item.x,
				item.y,
				item.r || 1,
				item.g || Math.random(),
				item.b || 0,
				item.size
			);
			return a;
		}, []);
	}
}

function attrUpdate(target, attr, step) {
	target["v" + attr] += (target["a" + attr] * step) / 1000;
	target[attr] += (target["v" + attr] * step) / 1000;
}
