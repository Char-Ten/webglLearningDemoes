import * as gt from "#/js/lib/glTools";
import vss from "./shaders/v.glsl";
import fss from "./shaders/f.glsl";
export default function(page){
	const cvs=page.cvs;
	/**@type {WebGLRenderingContext}*/
	const gl=page.gl;
	const w=cvs.width;
	const h=cvs.height;
	const size=50;
	const points=new Float32Array(createPoints(w,h,size));
	let now = new Date().getTime();
	let lastTime = now;
	let isPlay=true;

	
	const program=gt.createProgram(gl,vss,fss);

	const attributes={
		points:{type:"buffer",bufferData:points},
		a_position:{type:"pointer",value:[2,gl.FLOAT,false,0,0]}
	}
	const uniforms = {
		u_resolution:{type:"float",value:[w,h]},
		u_time:{type:"float",value:[new Date().getTime()-now]}
	}
	gl.useProgram(program);

	gt.setProgramAttribute(gl,program,attributes);
	gt.setProgramUniform(gl,program,uniforms);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	function run(time){
		if(!isPlay){
			return 
		}
		let newTime=new Date().getTime();
		if(newTime-lastTime<1000/60){
			requestAnimationFrame(run);
			return 
		}
		lastTime=newTime;
		uniforms.u_time.value=[time/1000];
		gt.setProgramUniform(gl,program,uniforms);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.POINTS,0,points.length/2);
		requestAnimationFrame(run);
	}
	run();

	return ()=>isPlay=false;
	
}

function createPoints(width,height,step){
	var a=[];
	for(let i=0;i<height;i+=step){
		for(let j=0;j<width;j+=step){
			a.push(j,i)
		}
	}
	return a;
}