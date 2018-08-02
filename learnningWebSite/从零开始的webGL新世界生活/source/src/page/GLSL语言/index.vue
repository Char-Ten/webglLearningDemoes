<template>
	<div id="PPage3" class="page" @click="click">
		<h2>GLSL语言 - 显卡的黑魔法</h2>
		<ul>
			<li>顶点着色器->输出像素位置</li>
			<li>片元着色器->输出像素颜色</li>
			<li>强类型语言</li>
		</ul>
		<div class="markdown" v-html="md"></div>
		<div class="yz" :class="{'yz-hide':!showList[0]}">简单得一逼！！？</div>
		<transition-group name="fade" tag="div">
			<blockquote key="1" v-if="showList[1]">即使是3d模型的绘制，其代码跟上面也是差不多的</blockquote>
			<blockquote key="2" v-if="showList[2]">正交投影</blockquote>
			<blockquote key="3" v-if="showList[3]">透视投影</blockquote>
			<img key="4" v-if="showList[4]" :src="ty"/>
		</transition-group>
		
	</div>
</template>
<script>
import md from "./index.md"
import ty from "#/assets/app/004.jpg"
export default {
	data(){
		return {
			md:marked(md),
			ty,
			showList:[]
		}
	},
	methods:{
		click(){
			this.showList.push(1);
			if(this.showList.length>5){
				this.$router.push("/page4")
			}
		}
	}
}
</script>
<style>
#PPage3{
	position: relative;
}
#PPage3 .yz{
	visibility: visible;
	position:absolute;
	right:0;
	height:50px;
	line-height: 50px;
	padding:5px;
	border:2px solid #ff9b26;
	border-radius: 25px;
	color:#ff9b26;
	box-shadow: 0 0 5px #000 inset;
	text-shadow: 0 0 5px #000;
	transform: translate(50px,-50px) rotate(-45deg);
	transition: all .5s;
}
#PPage3 .yz-hide{
	visibility: hidden;
	transform: scale(5) rotate(-180deg);
	opacity: 0;
}
#PPage3 blockquote{
	padding-left:5px;
	border-left: 2px solid #ff9b26;
	margin:5px;
	color:#acacac;
}
#PPage3 img{
	position: absolute;
	top:50%;
	left:50%;
	width:100%;
	transform: translate(-50%, -50%);
}
</style>
