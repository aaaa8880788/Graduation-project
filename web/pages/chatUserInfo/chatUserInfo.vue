<template>
	<view class="chat_user_info">
		<uni-nav-bar
			v-bind="navBar"
			@clickLeft="navLeftHandle"/>
		<!-- 背景层 -->
		<view class="bg">
			<image
				v-if="myInfoData.avatar"
				class="bg-img" 
				:src="myInfoData.avatar"
				mode="aspectFill"/>
			<image class="bg-img"
				v-else
				src="../../static/default_avatar.jpg"
				mode="aspectFill"/>
			<view class="bg-bai"></view>			 
		</view>
		<!-- 主体 -->
		<view class="main animate__animated animate__faster">
			<view class="user-header">
				<view class="sex">
					<template v-if="myInfoData.sex">
						<i 
							v-if="myInfoData.sex == '男'"
							class="iconfont man-color icon-xingbie-nan"></i>
						<i 
							v-else
							class="iconfont woman-color icon-xingbienv"></i>
					</template>
					<template v-else>
						<i class="iconfont icon-xingbie3"></i>
					</template>
				</view>
				<image 
					v-if="myInfoData.avatar"
					:src="myInfoData.avatar" 
					class="user-img animate__animated"
					mode="aspectFill"/>
				<image
					v-else
					src="../../static/default_avatar.jpg"
					class="user-img animate__animated"
					mode="aspectFill"/>
			</view>
			<view class="user-info">
				<view class="name">{{ myInfoData.name }}</view>
				<view class="nick">身份：{{ myInfoData.typeData }}</view>
				<view class="intr">这个人很懒，啥都没写~</view>
			</view>
		</view>
		<!-- 底部 -->
		<view 
			class="bottom animate__animated animate__faster"
			@click="footerBtnClick">
			<view class="bottom-btn">
				<text>发送消息</text>
			</view>
		</view>
		<!-- 提示组件 -->
		<u-toast ref="uToast"></u-toast>
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
					title:'资料',
					border:false,
					shadow:false,
					height:'100rpx',
					backgroundColor:'transparent',
				},
				userId: '',
				friendId:'',
				myInfoData:{}
			};
		},
		methods:{
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
			// 获取用户信息
			getUserInfo(){
				uni.request({
					url: `http://localhost:3000/web/api/getUserInfo`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						userId:this.friendId
					},
					success: (res) => {
						if(res.data.code === 200){
							this.myInfoData = res.data.data
							console.log('myInfoData---',this.myInfoData);
						}else if(res.data.code === 401){
							this.$refs.uToast.show({
								type: 'error',
								message: res.data.message,
								icon:false
							},)
							setTimeout(()=>{
								uni.redirectTo({
									url:'/pages/login/login'
								})
							},2000)
						}else{
							this.$refs.uToast.show({
								type: 'error',
								message: res.data.message,
								icon:false
							},)
						}
					},
					fail: (err) => {
						console.log('err',err);
					}
				})
			},
			footerBtnClick(){
				uni.request({
					url: `http://localhost:3000/web/api/addChatMessage`,
					method: 'POST',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						userId:this.userId,
						targetId:this.friendId,
						type:1
					},
					success: (res) => {
						if(res.data.code === 200){
							uni.navigateTo({
								url:`/pages/chatRoom/chatRoom?friendId=${this.friendId}`
							})
						}else if(res.data.code === 401){
							this.$refs.uToast.show({
								type: 'error',
								message: res.data.message,
								icon:false
							},)
							setTimeout(()=>{
								uni.redirectTo({
									url:'/pages/login/login'
								})
							},2000)
						}else{
							this.$refs.uToast.show({
								type: 'error',
								message: res.data.message,
								icon:false
							},)
						}
					},
					fail: (err) => {
						console.log('err',err);
					}
				})
			}
		},
		onLoad(options) {
			const { id } = options
			this.friendId = id
			this.userId = uni.getStorageSync('userId')
		},
		onShow(){
			this.getUserInfo()
		}
	}
</script>

<style lang="less" scoped>
.chat_user_info{
	/* 背景层 */
	.bg {
		z-index: -1;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		.bg-bai {
			width: 100%;
			height: 100%;
			
		}
		.bg-img {
			width: 110%;
			height: 110%;
			top: -10rpx;
			left: -10rpx;
			filter: blur(16px);
			opacity: 0.6;	
		}
	}
	/* main */
	.main {
		text-align: center;
		// 头像部分
		.user-header {
			position: relative;
			padding-top: 108rpx;
			margin: 0 auto;
			width: 410rpx;
			height: 404rpx;
			.sex {
				z-index: 1001;
				position: absolute;
				bottom: 12rpx;
				right: 12rpx;
				i {
					font-size: 28px;
					font-weight: 600;
					color: #fff;
					border-radius: 50%;
					padding: 12rpx;
				}
				.man-color {
					background-color: #5799ff;
				}
				.woman-color {
					background-color: #ff5d5b;
				}
				.icon-xingbie3{
					background-color: black;
				}
			}
			.user-img {
				z-index: 10;
				width: 400rpx;
				height: 400rpx;
				border-radius: 48rpx;
				border: 6rpx solid rgba(255,255,255,1);
				box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
			}
			.bind-user-img {
				z-index: 10;
				margin-left: -300rpx;
				margin-top: 80rpx;
				width: 250rpx;
				height: 250rpx;
				box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
				// border : none;
				border-radius: 50%;
				transition: 0.4s;
				// border: 6rpx solid rgba(255, 228, 49, 0.8);
			}
		}
		.user-info {
			position: relative;
			z-index: 3;
			width: 90%;
			margin: 50rpx auto;
			padding: 62rpx 0;
			border-radius: 10rpx;
			box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
			.name {
				font-size: 52rpx;
				color: #272832;
				line-height: 74rpx;
			}
			.nick {
				font-size: 28rpx;
				line-height: 40rpx;
				color: #272832;
			}
			.intr {
				font-size: 28rpx;
				font-weight: 300;
				line-height: 48rpx;
				color: #272832;
				padding-top: 20rpx 100rpx;
			}
		}	
	}
	.bottom{
		position: fixed;
		bottom: 40rpx;
		left: 0;
		right: 0;
		margin: 0 40rpx;
		border-radius: 10rpx;
		box-sizing: border-box;
		padding: 20rpx 20rpx;
		text-align: center;
		background-color: #05c5ff;
	}
}
</style>
