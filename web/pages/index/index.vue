<template>
	<view class="init_background animate__animated animate__fadeIn"></view>
</template>

<script>
	export default {
		onShow() {
			setTimeout(()=>{
				uni.redirectTo({
					url:'/pages/login/login'
				})
			},2000)
		}
	}
</script>

<style>
	.init_background {
		height: 100vh;
		width: 100vw;
		background: url('../../static/background_01.jpg') no-repeat;
		background-size: 100vw 100vh;
	}
</style>
