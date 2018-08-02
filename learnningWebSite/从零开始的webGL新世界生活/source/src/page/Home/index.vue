<template>
	<div id="PHome">
		<h1>从零开始的webGL新世界生活</h1>
		<canvas ref="cvs"></canvas>
		<a @click="clickA">了解webGL</a>
	</div>
</template>
<script>
import renders from "./renders.js";
export default {
    created() {
        this.renders = renders;
    },
    mounted() {
        this.cvs = this.$refs.cvs;
        this.gl = this.cvs.getContext("webgl");
        this.stopAnmt = this.renders();
    },
    beforeDestroy(){
		this.stopAnmt();
	},
	methods:{
		clickA(){
			this.$router.history.push('/page1');
		}
	}
};
</script>
<style>
#PHome {
    position: relative;
    height: 100%;
}
#PHome h1 {
    position: absolute;
    top: 40%;

    height: 60px;
    line-height: 60px;
    width: 100%;
    margin-top: -30px;
    text-align: center;
    color: #ff9b26;
    
}
#PHome canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
#PHome a {
    position: absolute;
    top: 75%;
    width: 100%;
	text-align: center;
	color: #ff9b26;
	cursor: pointer;
	text-decoration: underline;

}
#PHome a:active{
	color:#fff;
}
</style>
