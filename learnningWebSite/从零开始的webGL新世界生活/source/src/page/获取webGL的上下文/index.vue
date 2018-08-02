<template>
	<div id="PPage2" class="page">
		<h2>获取WebGL上下文</h2>
		<div class="markdown" v-html="md"></div>
		<nav>
			<a target="ifr" href="https://char-ten.github.io/webglLearningDemoes/learnningWebSite/%E7%82%B9%E7%B2%BE%E7%81%B5/index.html">点精灵粒子</a>
			<a target="ifr" href="https://char-ten.github.io/webglLearningDemoes/learnningWebSite/%E7%BF%BB%E8%BD%AC%E5%9D%90%E6%A0%87/index.html">翻转坐标</a>
		</nav>
		<iframe name="ifr" class="demo" src="https://char-ten.github.io/webglLearningDemoes/learnningWebSite/%E7%82%B9%E7%B2%BE%E7%81%B5/index.html"></iframe>
		<router-link class="nextPage" to="/page3">下一页>></router-link>
	</div>
</template>
<script>
import md from "./index.md"
export default {
	data(){
		return {
			md:marked(md)
		}
	},
	mounted(){
		
	}
}
</script>
<style>
#PPage2{
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
}
#PPage2 .demo{
	flex:1;
	border:none;
	overflow: hidden;
}
#PPage2 nav{
	display: flex;
}
#PPage2 nav a{
	flex: 1;
	margin-left:1px;
	text-align: center;
	color:#333;
	background:#ff9b26;
	transition: all .5s;
	cursor: pointer;
}
#PPage2 nav a:hover{
	transform: scale(1.2);
	box-shadow: 0 0 5px #ff9b26;
	background:#fff;
}
#PPage2 .nextPage{
	color:#ff9b26;
	text-decoration: underline;
}
</style>
