<template>
	<view 
		v-if="isShowBackTop"
		class="backTop"
		@click="backTopClickHandle">
		<u-icon 
			name="arrow-up"
			color="#fff"
			></u-icon>
	</view>
</template>

<script>
	export default {
		name:"backTop",
		props:{
			isShowBackTop: {
				type:Boolean,
				default: false
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			backTopClickHandle(){
				this.$emit('backTopClick')
			}
		}
	}
</script>

<style lang="less">
.backTop{
	position: fixed;
	top: 70%;
	right: 30rpx;
	z-index: 999;
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 100%;
	background-color: rgba(140, 140, 140, 0.9);
}
</style>