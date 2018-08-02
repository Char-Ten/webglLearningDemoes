<template>
	<div id="PPage7" class="page">
		<h2>在我们公司内部的使用情况</h2>
		<div class="item">
			<div>
				<img :src="img"/>
			</div>
			<a target="_blank" href="http://git.3k.com/web/PM/sdk-20171218/tree/master/src/components/dialog/colorPicker/base">
				投放落地页 颜色选择器组件
			</a>
		</div>
		<router-link class="nextPage" to="/end">下一页>></router-link>
	</div>	
</template>
<script>
import img from "#/assets/app/005.png";

export default {
	data(){
		return {
			img
		}
	}
}
</script>
<style>
#PPage7{
	display: flex;
	flex-direction: column;
}
#PPage7 .item{
	flex:1;
	text-align: center;
	color:#ff9b26;
}
#PPage7 .item a{
	color:#ff9b26;
}
</style>
