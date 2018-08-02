<template>
	<div id="PPage5" class="page">
		<h2>绘制</h2>
		<div class="markdown" v-html="md"></div>
		<router-link class="nextPage" to="/page7">下一页>></router-link>		
	</div>	
</template>
<script>
import md from "./index.md"
export default {
	data(){
		return {
			md:marked(md)
		}
	}
}
</script>
<style>
#PPage5 blockquote code{
	padding:2px;
	color:#ff9b26;
	background:rgba(0,0,0,.1)
}
</style>
