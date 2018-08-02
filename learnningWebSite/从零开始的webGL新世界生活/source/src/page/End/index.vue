<template>
	<div id="PEnd">
		<h1>谢谢</h1>
		<canvas ref="cvs"></canvas>
	</div>
</template>
<script>
import renders from "./render.js"
export default {
	created(){
		this.renders=renders;
	},
	mounted(){
		this.cvs=this.$refs.cvs;
		this.gl=this.cvs.getContext("webgl");
		this.cvs.width=this.cvs.offsetWidth;
		this.cvs.height=this.cvs.offsetHeight;
		this.gl.viewport(0,0,this.cvs.width,this.cvs.height);
		this.gl.clearColor(0,0,0,0);
		this.close=this.renders(this);
	},
	beforeDestroy(){
		this.close();
	}
}
</script>
<style>
#PEnd{
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	color:#ff9b26;
}
#PEnd canvas{
	position: absolute;
	top:0;
	left:0;
	width:100%;
	height: 100%;
}

</style>
