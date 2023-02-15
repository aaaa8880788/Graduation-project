<template>
	<view class="active_detail">
		<uni-nav-bar
			class="active_detail_nav"
			v-bind="navBar"
			@clickLeft="navLeftHandle">
		</uni-nav-bar >
		<scroll-view 
			v-if="Object.keys(activeData).length"
			class="active_detail_content"
			scroll-y="true" >
			<view class="active_detail_item">
				<view class="active_detail_item_header">
					<text>{{ activeData.name }}</text>
				</view>
				<view class="active_detail_item_center">
					<text>{{ activeData.body }}</text>
				</view>
				<view class="active_detail_item_footer">
					<view class="active_place">
						<text>活动地点：</text>
						<text>{{ activeData.placeData.name }}</text>
					</view>
					<view class="active_start_time">
						<text>活动开始时间：</text>
						<text>{{ transformDate(activeData.startTime) }}</text>
					</view>
					<view class="active_start_time">
						<text>活动结束时间：</text>
						<text>{{ transformDate(activeData.endTime) }}</text>
					</view>
					<view class="active_score">
						<text>奖励积分：</text>
						<text>{{ activeData.score }}</text>
					</view>
					<view class="active_count">
						<text>剩余名额：</text>
						<text>{{ activeData.placeData.volume - activeData.joinUser.length }}</text>
					</view>
					<view class="active_author">
						<text>举报人：</text>
						<template v-if="activeData.userData.organizationData">
							<text>{{ activeData.userData.organizationData.name }}——</text>
						</template>
						<text>{{ activeData.userData.name }}</text>
					</view>
					<view class="active_join">
						<u-button v-if="isJoin"
							class="activeBtn"
							shape="circle"
							color="#eb5544"
							disabled=""
							text="已参与">	
						</u-button>
						<u-button
							v-else
							class="activeBtn"
							shape="circle"
							color="#eb5544"
							text="参与活动"
							@click="activeBtnClickHandle">
						</u-button>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 提示组件 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { formateUtcString } from '../../utils/dataFormate.js'
	export default {
		data() {
			return {
				navBar:{
					shadow:true,
					leftIcon:'left',
					leftText:'返回',
					title:'活动详情',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff',
				},
				activeId:'',
				userId:'',
				activeData:{}
			};
		},
		computed:{
			isJoin(){
				if(Object.keys(this.activeData).length){
					return this.activeData.joinUser.some(item => item === this.userId)
				}
				return false
			}
		},
		methods:{
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
			getActiveDetail(){
				uni.request({
					url: `http://localhost:3000/web/api/getActiveDetail`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						id: this.activeId
					},
					success: (res) => {
						if(res.data.code === 200){
							this.activeData = res.data.data
							console.log('activeData',this.activeData)
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
			activeBtnClickHandle(){
				uni.request({
					url: `http://localhost:3000/web/api/joinActive`,
					method: 'POST',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						id: this.activeId,
						userId: this.userId
					},
					success: (res) => {
						if(res.data.code === 200){
							this.$refs.uToast.show({
								type: 'success',
								message: '活动参与成功~',
								icon:false
							})
							this.getActiveDetail()
						}else if(res.data.code === 401){
							this.$refs.uToast.show({
								type: 'error',
								message: res.data.message,
								icon:false
							})
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
			transformDate(date,format){
				return formateUtcString(date,format)
			},
		},
		onLoad(query){
			const { activeId } = query
			this.activeId = activeId
			this.userId = JSON.parse(uni.getStorageSync('userId'))
			this.getActiveDetail()
		},
	}
</script>

<style lang="less" scoped>
.active_detail{
	position: relative;
	height: 100vh;
	width: 100vw;
	background-color: #dcdcdc;
	overflow: hidden;
	.active_detail_content{
		height: calc(100vh - 202rpx);
		position: relative;
		width: 100%;
		box-sizing: border-box;
		.active_detail_item{
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			box-sizing: border-box;
			background-color: #fff;
			border-radius: 20rpx;
			margin: 10px 10rpx;
			padding: 20rpx;
			box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, .3);
			.active_detail_item_header{
				font-weight: 700;
				font-size: 30rpx
			}
			.active_detail_item_center{
				margin-top: 20rpx;
				font-size: 24rpx;
			}
			.active_detail_item_footer{
				margin-top: 20rpx;
				color: #9f9f9f;
				.active_count,.active_score{
					font-weight: 700;
					text:nth-child(2){
						font-size: 40rpx;
						color: #eb5544;
					}
				}
				.active_join{
					margin-top: 30rpx;
				}
			}
		}
	}
}
.uni-scroll-view{
	overflow: hidden;
}
</style>
