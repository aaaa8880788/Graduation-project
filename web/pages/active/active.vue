<template>
	<view class="active">
		<view class="active_nav">
			<uni-nav-bar 
				v-bind="navBar"
				@clickLeft="navLeftHandle"/>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navBar:{
					shadow:true,
					leftIcon:'left',
					leftText:'返回',
					title:'活动列表',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff'
				},
			};
		},
		methods:{
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="less">

</style>
