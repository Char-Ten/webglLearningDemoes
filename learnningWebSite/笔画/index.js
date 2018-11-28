function Vec2(x, y) {
	this.x = x;
	this.y = y;
	this.angle = Vec2.getAngleWithX(x, y);
	this.norm = Vec2.getNorm(x, y);
}
Vec2.getNorm = function(x, y) {
	return Math.sqrt(x * x + y * y);
};
Vec2.getAngleWithX = function(x, y, isAcute) {
	var angle = Math.atan2(y, x);
	if (!isAcute) {
		return angle;
	}
	if (angle > Math.PI / 2) {
		return Math.PI - angle;
	}
	if (angle < -Math.PI / 2) {
		return angle - Math.PI;
	}
	return angle;
};
Vec2.prototype = {
	constructor: Vec2,
	addWith: function(vec) {
		return new Vec2(this.x + vec.x, this.y + vec.y);
	},
	subWith: function(vec) {
		return new Vec2(this.x - vec.x, this.y - vec.y);
	},
	dotWith: function(vec) {
		return this.x * vec.x + this.y * vec.y;
	},
	multWith: function(vec) {
		return new Vec2(this.x * n, this.y * n);
	}
};

var cvs = document.getElementById("cvs");

/**@type {WebGLRenderingContext} */
var gl = cvs.getContext("webgl");

var width = (cvs.width = cvs.offsetWidth);
var height = (cvs.height = cvs.offsetHeight);
var programs = {
	rect: null,
	points: null
};
var texture = $$utils.createTexByImage(gl, cvs);
var pointsBuffer = gl.createBuffer();
var rectBuffer = gl.createBuffer();
var isReady = false;
var isMouseDown = false;
var prevX, prevY;

var pointCoord = new Float32Array([]);
var rectCoord = new Float32Array([0, 0, width, 0, width, height, 0, height]);
var points = [];

var pointsAttr = {
	a_position: {
		type: "pointer",
		value: [2, gl.FLOAT, false, 0, 0]
	}
};
var rectAttr = {
	a_position: {
		type: "pointer",
		value: [2, gl.FLOAT, false, 0, 0]
	}
};

var pointsUnifs = {
	u_resolution: { type: "float", value: [width, height] }
};

var rectUnifs = {
	u_resolution: { type: "float", value: [width, height] },
	u_tex1: { type: "int", value: [0] }
};

gl.viewport(0, 0, width, height);
gl.clearColor(0, 0, 0, 1);
gl.lineWidth(5);

$$utils.createProgramByShadersURL(
	gl,
	"./shaders/v.glsl",
	"./shaders/f.glsl",
	function(e) {
		onProgarmloaded("points", e);
	}
);
$$utils.createProgramByShadersURL(
	gl,
	"./shaders/v.glsl",
	"./shaders/rect.f.glsl",
	function(e) {
		onProgarmloaded("rect", e);
	}
);

cvs.addEventListener("mousedown", function(e) {
	if (!isReady) {
		return;
	}
	isMouseDown = true;
	points=[];
	pointCoord=new Float32Array(points);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cvs);
	
	renderRect();
	renderPoints();
	prevX = e.offsetX;
	prevY = e.offsetY;
});
cvs.addEventListener("mousemove", function(e) {
	if (!isReady) {
		return;
	}
	if (!isMouseDown) {
		return;
	}
	points = points.concat(createStepPoints(e.offsetX, e.offsetY, prevX, prevY));
	pointCoord=new Float32Array(points);
	renderRect();
	renderPoints();
	prevX = e.offsetX;
	prevY = e.offsetY;
});
cvs.addEventListener("mouseup", function(e) {
	if (!isReady) {
		return;
	}
	if (!isMouseDown) {
		return;
	}
	isMouseDown = false;
	
});

cvs.addEventListener("touchstart", function(e) {
	if (!isReady) {
		return;
	}
	e.preventDefault();
	var x = e.touches[0].pageX;
	var y= e.touches[0].pageY
	isMouseDown = true;
	points=createStepPoints(x,y);
	pointCoord=new Float32Array(points);
	
	
	renderRect();
	renderPoints();
	prevX = x;
	prevY = y;
});
cvs.addEventListener("touchmove", function(e) {
	if (!isReady) {
		return;
	}
	if (!isMouseDown) {
		return;
	}
	e.preventDefault();
	var x = e.touches[0].pageX;
	var y= e.touches[0].pageY;

	points = points.concat(createStepPoints(x, y, prevX, prevY));
	pointCoord=new Float32Array(points);
	renderRect();
	renderPoints();
	if(new Vec2(x-prevX,y-prevY).norm<3 ){
		return
	}
	prevX = x;
	prevY = y;
});
cvs.addEventListener("touchend", function(e) {
	if (!isReady) {
		return;
	}
	if (!isMouseDown) {
		return;
	}
	isMouseDown = false;
	renderRect();
	renderPoints();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cvs);
	
});
function onProgarmloaded(key, value) {
	programs[key] = value;
	if (!(programs.rect && programs.points)) {
		return;
	}
	isReady = true;
	gl.useProgram(programs.rect);
	$$utils.setProgramAttribute(gl, programs.rect, rectAttr);
	$$utils.setProgramUniform(gl, programs.rect, rectUnifs);

	gl.useProgram(programs.points);
	$$utils.setProgramAttribute(gl, programs.points, pointsAttr);
	$$utils.setProgramUniform(gl, programs.points, pointsUnifs);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
}

function renderPoints() {
	if (!programs.points) {
		return;
	}
	gl.useProgram(programs.points);
	gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, pointCoord, gl.STATIC_DRAW);
	$$utils.setProgramAttribute(gl,programs.points,pointsAttr)
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, pointCoord.length / 2);
}

function renderRect() {
	if (!programs.rect) {
		return;
	}
	gl.useProgram(programs.rect);
	gl.bindBuffer(gl.ARRAY_BUFFER,rectBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, rectCoord, gl.STATIC_DRAW);
	$$utils.setProgramAttribute(gl,programs.rect,rectAttr)
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

var lstAng;
/**
 * 根据笔触点创建绘制点
 * @param {Number} x - 笔触点位置 x
 * @param {Number} y - 笔触点位置 y
 * @param {Number} prevX - 上一处笔触点位置 x
 * @param {Number} prevY - 上一处笔触点位置 y
 * @returns {Array<Number>}
 */
function createStepPoints(x, y, prevX, prevY) {
	var r = 5;

	if (typeof prevX === "undefined" || typeof prevY === "undefined") {
		return [x, y];
	}
	var vec = new Vec2(x - prevX, y - prevY);
	
	lstAng=vec.angle;
	// r = 30 / (vec.norm + 2) + 5;
	r=5+2/(vec.norm+1);
	var offset =- Math.PI / 8;

	return [
		x + r * Math.cos(vec.angle - offset),
		y + r * Math.sin(vec.angle - offset),
		x - r * Math.cos(vec.angle - offset),
		y - r * Math.sin(vec.angle - offset)
	];
}
