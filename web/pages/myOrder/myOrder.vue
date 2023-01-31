<template>
	<view class="my_order">
		<view class="my_order_nav">
			<uni-nav-bar 
				v-bind="navBar"
				@clickLeft="navLeftHandle"/>
			<scroll-view
				v-if="orderList.length"
				class="my_order_list"
				scroll-y="true" >
				<view 
					class="order_item"
					v-for="item,index in orderList"
					:key="item.id">
					<view class="item_header">
						<view class="item_header_left">
							<text>智慧党建</text>
						</view>
						<view class="item_header_right">
							<template v-if="item.status === 0">
								<text>未发货</text>
							</template>
							<template v-else>
								<text>已发货</text>
							</template>
						</view>
					</view>
					<view class="item_center">
						<image 
							class="item_center_left"
							:src="item.giftData.image">
						</image>
						<view class="item_center_center">
							<view class="good_name">
								<text>{{ item.giftData.name }}</text>
							</view>
							<view class="good_address">
								<text>收货地址：</text>
								<text>{{ item.userData.address  }}</text>
							</view>
						</view>
						<view class="item_center_right">
							<view class="score">
								<text>￥</text>
								<text>{{ item.giftData.score }}</text>
							</view>
							<view class="count">
								<text>共一件</text>
							</view>
						</view>
					</view>
					<view class="item_footer">
						<u-button
							type="error"
							text="删除订单"
							@click="deleteOrderHandle(item)">
						</u-button>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 提示组件 -->
		<u-modal 
			showConfirmButton
			showCancelButton
			:show="modalShow" 
			title="提示"
			@cancel="modalCancelHandle"
			@confirm="modalConfirmHandle">
			<template #default>
				<view>确定要删除订单？</view>
			</template>
		</u-modal>
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
					title:'我的订单',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff'
				},
				orderList:[],
				userId:'',
				modalShow:false,
				currentOrderId:''
			};
		},
		methods:{
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
			getOrderList(){
				uni.request({
					url: `http://localhost:3000/web/api/getOrderList`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					success: (res) => {
						if(res.data.code === 200){
							this.orderList = res.data.data
							console.log(this.orderList);
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
			deleteOrderHandle(item){
				this.currentOrderId = item.id
				this.modalShow = true
			},
			modalCancelHandle(){
				this.modalShow = false
			},
			modalConfirmHandle(){
				uni.request({
					url: `http://localhost:3000/web/api/deleteOrder`,
					method: 'DELETE',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						id:this.currentOrderId
					},
					success: (res) => {
						if(res.data.code === 200){
							this.getOrderList()
							this.modalShow = false
							this.$refs.uToast.show({
								type: 'success',
								message: '删除订单成功~',
								icon:false,
								duration:3000
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
		onLoad() {
			this.userId = uni.getStorageSync('userId')
		},
		onShow(){
			this.getOrderList()
		}
	}
</script>

<style lang="less" scoped>
.my_order{
	height: 100vh;
	width: 100vw;
	background-color: #f2f2f2;
	.my_order_list{
		height: calc(100vh - 102rpx);
		width: 100%;
		box-sizing: border-box;
		.order_item{
			background-color: #fff;
			margin: 30rpx 20rpx;
			padding: 20rpx 10rpx;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			.item_header{
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
				.item_header_left{
					font-size: 35rpx;
					font-weight: 700;
				}
				.item_header_right{
					color: #9e9e9e;
				}
			}
			.item_center{
				display: flex;
				align-items: center;
				height: 30vw;
				margin-bottom: 20rpx;
				.item_center_left{
					height: 30vw;
					width: 30vw;
					border-radius: 20rpx;
				}
				.item_center_center{
					height: 100%;
					display: flex;
					flex: 1;
					flex-direction: column;
					box-sizing: border-box;
					padding-left: 10rpx;
					.good_name{
						font-weight: 700;
						font-size: 35rpx;
					}
					.good_address{
						margin-top: 50rpx;
						font-size: 24rpx;
						line-height: 30rpx;
						overflow: hidden;//多出的隐藏
						text-overflow: ellipsis;//多出部分用...代替
						display: -webkit-box;//定义为盒子模型显示
						-webkit-line-clamp: 2;//用来限制在一个块元素显示的文本的行数
						-webkit-box-orient: vertical;//从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
					}
				}
				.item_center_right{
					text-align: center;
					width: 15vw;
					font-size: 24rpx;
				}
			}
			.item_right{
				
			}
		}
	}
}
</style>
