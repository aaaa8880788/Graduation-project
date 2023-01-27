<template>
	<view class="mine">
		<view class="mine_header">
			<text>个人中心</text>
		</view>
		<scroll-view
			class="mine_content"
			scroll-y="true" >
			<view class="mine_content_header">
				<view class="header_left">
					<image 
						v-if="userInfo.avatar"
						class="avatar" 
						:src="userInfo.avatar">
					</image>
					<view 
						v-else
						class="avatar_default">
						<text>默认</text>
					</view>
				</view>
				<view class="header_center">
					<view class="title">
						<text>{{userInfo.name}}</text>
					</view>
					<view class="level">
						<text>{{levelTransform(userInfo.score)}}</text>
					</view>
				</view>
				<view class="header_right">
					<u-icon name="arrow-right" color="#fff"></u-icon>
				</view>
			</view>
			<view class="mine_content_study">
				<view class="study_score">
					<text style="font-size: 50rpx;margin-right: 10rpx;">{{userInfo.score}}</text>
					<text>积分</text>
				</view>
				<view class="stydy_type" >
					<view 
						class="typeItem" 
						v-for="item in studyData"
						:key="item.title"
						@click="typeItemHandle(item)">
						<image
							class="typeImage" 
							:src="item.icon">
						</image>
						<view class="typeText">
							<text>{{item.title}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="mine_content_goods">
				<view class="goods_title">
					<text>兑换</text>
				</view>
				<image 
					class="goods_image"
					src="../../static/mine/goods.png"
					@click="goStoreHandle">
				</image>
			</view>
			<view class="mine_content_service">
				<view class="service_title">
					<text>服务</text>
				</view>
				<view class="service_list">
					<view 
						class="service_item"
						v-for="item,index in serviceData"
						:key="item.title"
						@click="serviceClickHandle(item)">
						<image 
							class="service_image" 
							:src="item.icon" >
						</image>
						<view class="service_name">
							<text>{{item.title}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 提示组件 -->
		<uni-popup
			ref="tipDialogRef" 
			type="dialog">
			<uni-popup-dialog 
				:message="popupDialog.message" 
				:duration="popupDialog.duration" 
				:content="popupDialog.content"
				:before-close="popupDialog.beforeClose" 
				@close="dialogCloseHandle" 
				@confirm="dialogConfirmHandle">
			</uni-popup-dialog>
		</uni-popup>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId:'',
				userInfo:{},
				popupDialog:{
					type:'success',
					message:"默认信息",
					content:"默认信息",
					duration:2000,
					beforeClose:true
				},
				studyData: [
					{
						title: '获取积分',
						icon: require('../../static/mine/score.svg')
					},
					{
						title: '我要答题',
						icon: require('../../static/mine/test.svg')
					}
				],
				serviceData: [
					{
						title: '签到服务',
						icon: require('../../static/mine/创意.svg')
					},
					{
						title: '收藏文章',
						icon: require('../../static/mine/沟通训练.svg')
					},
					{
						title: '收藏视频',
						icon: require('../../static/mine/关键词.svg')
					},
					{
						title: '我的订单',
						icon: require('../../static/mine/计划.svg')
					},
					{
						title: '我的评论',
						icon: require('../../static/mine/首套.svg')
					},
					{
						title: '活动列表',
						icon: require('../../static/mine/物业类型.svg')
					},
					{
						title: '参与活动',
						icon: require('../../static/mine/装修.svg')
					},
					{
						title: '个人信息',
						icon: require('../../static/mine/约带看.svg')
					},
				]
			};
		},
		methods:{
			// 获取用户信息
			getUserInfo(){
				uni.request({
					url: `http://localhost:3000/web/api/getUserInfo`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token')
					},
					data:{
						userId:this.userId
					},
					success: (res) => {
						if(res.data.code === 200){
							this.userInfo = res.data.data
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
			// 对话框关闭按钮点击触发
			dialogCloseHandle(){
				this.$refs.tipDialogRef.close()
			},
			dialogConfirmHandle(){
				this.$refs.tipDialogRef.close()
			},
			typeItemHandle(item){
				if(item.title === '获取积分'){
					this.popupDialog.content = '可通过签到、浏览文章、观看视频、答题获取积分，积分可用来兑换商品'
					this.$refs.tipDialogRef.open()
				}else{
					console.log('点击了我要答题');
				}
			},
			// 点击积分兑换触发
			goStoreHandle(){
				console.log('点击了积分兑换');
			},
			// 段位转化
			levelTransform(score){
				let str = ''
				if(score < 100){
					str = '段位:积分不足,暂无段位'
				}else if(score < 500){
					str = '青铜'
				}else{
					str = '荣耀王者'
				}
				return str
			},
			// 服务点击触发
			serviceClickHandle(item){
				console.log(item.title)
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync('userId')
			this.getUserInfo()
		}
	}
</script>

<style lang="less">
	.mine{
		background-color: #ececec;
		height: calc(100vh - 50px);
		.mine_header{
			height: 44px;
			line-height: 44px;
			text-align: center;
			background-color: #eb5544;
			font-weight: 700;
			color: #fff;
		}
		.mine_content{
			height: calc(100vh - 44px - 50px);
			.mine_content_header{
				height: 170rpx;
				padding-bottom: 100rpx;
				background-color: #eb5544;
				display: flex;
				.header_left{
					width: 20vw;
					display: flex;
					align-items: center;
					justify-content: center;
					.avatar_default{
						width: 13vw;
						height: 13vw;
						line-height: 13vw;
						text-align: center;
						background-color: rgba(79, 148, 241, .9);
						border-radius: 100%;
						color: #fff;
					}
					.avatar{
						width: 13vw;
						height: 13vw;
						border-radius: 100%;
						border: 2px solid #eb6c31;
					}
				}
				.header_center{
					width: 70vw;
					display: flex;
					flex-direction: column;
					justify-content: center;
					color: #fff;
					.title{
						font-size: 36rpx;
					}
					.level{
						font-size: 24rpx;
					}
				}
				.header_right{
					width: 10vw;
					display: flex;
					align-items: center;
				}
			}
			.mine_content_study{
				background-color: #fff;
				position: relative;
				top: -60rpx;
				height: 350rpx;
				margin: 0 40rpx;
				border-radius: 10rpx;
				box-sizing: border-box;
				padding: 20rpx;
				.study_score{
					color: #eb5544;
					font-weight: 700;
					height: 40rpx;
					padding-bottom: 50rpx;
					border-bottom: 1px solid #e3e3e3;
				}
				.stydy_type{
					text-align: center;
					display: flex;
					.typeItem{
						margin-top: 30rpx;
						width: 50%;
						.typeImage{
							width: 120rpx;
							height: 120rpx;
						}
					}
				}
			}
			.mine_content_goods{
				background-color: #fff;
				position: relative;
				top: -30rpx;
				height: 350rpx;
				margin: 0 40rpx;
				border-radius: 10rpx;
				box-sizing: border-box;
				padding: 20rpx;
				.goods_title{
					font-weight: 700;
					font-size: 36rpx;
					margin-bottom: 20rpx;
				}
				.goods_image{
					width: 100%;
					height: 80%;
					border-radius: 20rpx;
				}
			}
			.mine_content_service{
				background-color: #fff;
				position: relative;
				margin: 0 40rpx;
				border-radius: 10rpx;
				box-sizing: border-box;
				padding: 20rpx;
				.service_title {
					font-weight: 700;
					font-size: 36rpx;
					margin-bottom: 20rpx;
				}
				.service_list {
					width: 100%;
					display: flex;
					flex-wrap: wrap;
					.service_item{
						margin-top: 20rpx;
						text-align: center;
						width: 25%;
						.service_image{
							width: 60rpx;
							height: 60rpx;
						}
					}
				}
			}
		}
	}
</style>
