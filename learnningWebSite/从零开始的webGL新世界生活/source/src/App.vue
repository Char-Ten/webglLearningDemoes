<template>
  <div id="app" class="pointer" >
	<transition name='fade' appear mode='out-in'>
		<router-view :key="3"></router-view>
	</transition>
  </div>
</template>

<script>
export default {
  
};
</script>

<style>
html,body,#app{
	width:100%;
	height:100%;
	background:#333;
	
	font-size: 20px
}
* {
  margin: 0;
  padding: 0;
}

.page{
	width:980px;
	height: 100%;
	padding-top:50px;
	margin:auto;
	color: #fff;
	box-sizing: border-box;
}
.page h2{
	margin:25px;
	color:#ff9b26;
}
.nextPage{
	color:#ff9b26;
	text-decoration: underline;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
