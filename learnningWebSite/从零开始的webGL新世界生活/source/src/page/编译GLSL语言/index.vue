<template>
	<div id="PPage4" class="page">
		<h2>编译GLSL语言</h2>
		<div class="markdown" v-html="md"></div>
		<router-link class="nextPage" to="/page5">下一页>></router-link>	
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

</style>
