<template>
	<div class="page" id="PPage1" @click="clickForm">
		<h2>WebGL是什么</h2>
		<transition-group name="list" tag="ul">
			<li v-for="(item,i) in list" :key="i">{{item}}</li>
		</transition-group>
		<transition name="fade">
			<img v-if="isShowImage1" key="1" :src="img1" />
		</transition>
		<transition name="fade">
			<img v-if="isShowImage2" key="1" :src="img2" style="margin:100px;margin-bottom:0" />
		</transition>
		<transition name="fade">
			<img v-if="isShowImage3" key="1" :src="img3" style="margin:200px;margin-bottom:0"/>
		</transition>	
	</div>
</template>
<script>
import img1 from "#/assets/app/00.jpeg"
import img2 from "#/assets/app/01.jpeg"
import img3 from "#/assets/app/02.jpeg"
export default {
	data(){
		return {
			list:[],
			isShowImage1:false,
			isShowImage2:false,
			isShowImage3:false,
			img1,
			img2,
			img3
		}
	},
	methods:{
		clickForm(e){
			e.preventDefault();
			if(this.res.length){
				this.list.push(this.res.pop());
				return
			}
			if(!this.isShowImage1){
				this.isShowImage1=true;
				return
			}
			if(!this.isShowImage2){
				this.isShowImage2=true;
				return
			}
			if(!this.isShowImage3){
				this.isShowImage3=true;
				return
			}
			this.$router.history.push("/page2")
		}
	},
	created(){
		this.res=[
			'优化加速原理',
			'浏览器底层API',
			'OpenGL ES 2.0/3.0',
			'光栅化引擎',
		]
	}

}
</script>
<style>
#PPage1{
	width:980px;
	height: 100%;
	padding-top:50px;
	margin:auto;
	color: #ff9b26;
}
#PPage1 h2{
	margin:25px;
}
#PPage1 li{
	padding:20px;
}
#PPage1 img{
	position:absolute;
	width:500px;
	box-shadow: 0 0 50px #000;
}
.list-enter-active, .list-leave-active {
  transition: all .5s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(25%)
}

</style>
