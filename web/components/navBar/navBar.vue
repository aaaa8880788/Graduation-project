<template>
	<view class="nav_bar">
		<uni-nav-bar v-bind="navConfig">
			<template slot="left">
				<view class="nav_left">
					<image 
						class="left_image" 
						src="../../static/home/icon_study.svg">
					</image>
				</view>
			</template>
			<view class="nav_center">
				<view class="search" @click="centerClickHandle">
					<uni-icons 
						class="input-uni-icon search_icon" 
						type="search" 
						size="18" 
						color="#636363" />
					<text class="search_font">智慧党建</text>
				</view>
			</view>
			<template slot="right">
				<view class="nav_right" @click="rightClickHandle">
					<text>我的</text>
				</view>
			</template>
		</uni-nav-bar>
	</view>
</template>

<script>
	export default {
		name:"navBar",
		props: {
			navConfig: {
				type: Object,
				default: () => ({
					backgroundColor:"#ff0000"
				})
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			rightClickHandle(){
				uni.switchTab({
					url: '/pages/mine/mine'
				})
			},
			centerClickHandle(){
				this.$emit('searchClick')
			}
		}
	}
</script>

<style lang="less">
.nav_bar{
	.nav_left{
		height: 100%;
		width: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
		.left_image{
			width: 50rpx;
			height: 50rpx;
		}
	}
	.nav_center{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		.search{
			width: 100%;
			height: 70%;
			display: flex;
			align-items: center;
			background-color: rgba(255, 255, 255, .8);
			border-radius: 30rpx;
			.search_icon{
				margin: 0 5rpx 0 20rpx;
			}
			.search_font{
				color: #636363;
			}
		}
	}
	.nav_right{
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-weight: 700;
		font-size: 30rpx;
	}
}
</style>