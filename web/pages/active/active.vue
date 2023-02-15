<template>
	<view class="active">
		<uni-nav-bar
			v-bind="navBar"
			@clickLeft="navLeftHandle"
			@clickRight="navRightHandle">
			<template #right="scope">
				<uni-icons 
					type="plusempty" 
					size="22"
					color="#fff"></uni-icons>
			</template>
		</uni-nav-bar >	
		<scroll-view
			class="active_content"
			scroll-y="true" >
			<view class="avative_list">
				<view 
					class="active_item"
					v-for="item in activeList"
					:key="item.id"
					@click="activeItemClick(item)">
					<view class="active_item_name">
						<text>{{ item.name }}</text>
					</view>
					<view class="active_item_body">
						<text>{{ item.body }}</text>
					</view>
					<view class="active_item_time">
						<view class="active_item_time_left">
							<text>{{ transformDate(item.startTime) }}</text>
						</view>
						<view class="active_item_time_center">
							<text>——</text>
						</view>
						<view class="active_item_time_right">
							<text>{{ transformDate(item.endTime) }}</text>
						</view>
					</view>
					<view class="active_item_place">
						<text>{{ item.placeData.name }}</text>
					</view>
					<view class="active_item_author">
						<view class="active_item_author_right">
							<template v-if="item.userData.organizationData">
								<text>{{ item.userData.organizationData.name }}——</text>
							</template>
							<text>{{ item.userData.name }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
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
					title:'活动列表',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff',
				},
				myInfoData:{},
				activeList:[]
			};
		},
		methods:{
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
			navRightHandle(){
				if(this.myInfoData && this.myInfoData.powerId.length){
					const isCanAdd = this.myInfoData.powerId.some(item => item.powerName === 'add')
					if(isCanAdd){
						uni.navigateTo({
							url:'/pages/activePublish/activePublish'
						})
					}else{
						this.$refs.uToast.show({
							type: 'error',
							message: '暂无发布活动权限~',
							icon:false
						})
					}
				}else{
					this.$refs.uToast.show({
						type: 'error',
						message: '暂无发布活动权限~',
						icon:false
					})
				}
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
						userId:this.userId
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
			// 获取活动列表
			getActiveList(){
				uni.request({
					url: `http://localhost:3000/web/api/getActiveList`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					success: (res) => {
						if(res.data.code === 200){
							this.activeList = res.data.data
							console.log('activeList---',this.activeList);
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
			// 活动卡片点击触发
			activeItemClick(item){
				uni.navigateTo({
					url:`/pages/activeDetail/activeDetail?activeId=${item.id}`
				})
			},
			transformDate(date,format){
				return formateUtcString(date,format)
			},
		},
		onLoad() {
			this.userId = uni.getStorageSync('userId')
		},
		onShow(){
			this.getUserInfo()
			this.getActiveList()
		}
	}
</script>

<style lang="less" scoped>
.active{
	height: 100vh;
	width: 100vw;
	background-color: #dddddd;
	.active_content{
		height: calc(100vh - 102rpx);
		width: 100%;
		box-sizing: border-box;
		.avative_list{
			box-sizing: border-box;
			padding: 20rpx 0;
			.active_item{
				margin: 0 20rpx;
				background-color: #fff;
				border-radius: 15rpx;
				box-sizing: border-box;
				padding: 20rpx 30rpx;
				margin-bottom: 20rpx;
				box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, .1);
				.active_item_name{
					font-weight: 700;
					font-size: 40rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-bottom: 20rpx;
				}
				.active_item_body{
					margin-bottom: 30rpx;
					overflow: hidden;//多出的隐藏
					text-overflow: ellipsis;//多出部分用...代替
					display: -webkit-box;//定义为盒子模型显示
					-webkit-line-clamp: 4;//用来限制在一个块元素显示的文本的行数
					-webkit-box-orient: vertical;//从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
				}
				.active_item_time{
					display: flex;
					justify-content: space-between;
					color: #eb5544;
				}
				.active_item_place{
					text-align: right;
					color: #aaaaaa;
					font-size: 24rpx;
				}
				.active_item_author{
					text-align: right;
					color: #aaaaaa;
					font-size: 24rpx;
				}
			}
		}
	}
}
</style>
