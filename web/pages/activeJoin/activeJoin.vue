<template>
	<view class="active_join">
		<view class="active_join_nav">
			<uni-nav-bar 
				v-bind="navBar"
				@clickLeft="navLeftHandle"/>
		</view>
		<!-- 文章列表 -->
		<scroll-view
			class="active_join_list" 
			scroll-y="true" >
			<view
				class="active_join_item"
				v-for="item,index in activeJoinList"
				:key="item.id"
				@click="activeJoinClickHandle(item)">
				<view class="active_join_title">
					<text>{{item.name}}</text>
				</view>
				<view class="active_join_content">
					<view class="active_join_content_left">
						<text>{{ transformDate(item.startTime) }}</text>
					</view>
					<view class="active_join_content_right">
						<text>{{ item.placeData.name }}</text>
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
					title:'我的活动',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff'
				},
				activeJoinList:[],
				userId:''
			};
		},
		methods:{
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
			getUserJoinActive(){
				uni.request({
					url: `http://localhost:3000/web/api/getUserJoinActive?id=${this.userId}`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					success: (res) => {
						if(res.data.code === 200){
							this.activeJoinList = res.data.data
							console.log('activeJoinList---',this.activeJoinList);
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
			transformDate(date,format){
				return formateUtcString(date,format)
			},
			activeJoinClickHandle(item){
				uni.navigateTo({
					url:`/pages/activeDetail/activeDetail?activeId=${item.id}`
				})
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync('userId')
		},
		onShow(){
			this.getUserJoinActive()
		}
	}
</script>

<style lang="less" scoped>
.active_join{
	height: 100vh;
	width: 100vw;
	.active_join_list{
		height: calc(100vh - 102rpx);
		box-sizing: border-box;
		padding: 30rpx;
		.active_join_item{
			padding-bottom: 30rpx;
			border-bottom: 1px solid #ccc;
			margin-bottom: 30rpx;
			.active_join_title{
				font-weight: 700;
				font-size: 30rpx;
				line-height: 35rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.active_join_content{
				margin-top: 10rpx;
				display: flex;
				justify-content: space-between;
				color: #b9b9b9;
			}
		}
	}
}
.uni-scroll-view{
	overflow: hidden !important;
}
</style>
