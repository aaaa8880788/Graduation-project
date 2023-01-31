<template>
	<view class="score_store">
		<view class="score_store_nav">
			<uni-nav-bar 
				v-bind="navBar"
				@clickLeft="navLeftHandle"/>
		</view>
		<scroll-view 
			class="score_store_goodsList" 
			scroll-y="true" >
			<view class="good_list">
				<view
					class="good_item"
					v-for="item,index in goodsList"
					:key="item.id"
					@click="goodClickHandle(item)">
					<view class="item_wrapper">
						<image
							class="good_image" 
							:src="item.image">
						</image>
						<view class="good_name">
							<text>{{ item.name }}</text>
						</view>
						<view class="good_footer">
							<view class="good_footer_left">
								<text>库存：</text>
								<text>{{ item.total }}</text>
							</view>
							<view class="good_footer_right">
								<text>积分：</text>
								<text>{{ item.score }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 提示组件 -->
		<u-popup 
			:customStyle="{backgroundColor:'rgba(255,255,255,0)'}"
			closeable
			:show="buyPageShow" 
			mode="center"
			@close="buyPageClosehandle"
			@open="buyPageOpenhandle">
		  <view class="buy_good">
		    <image
		    	class="buy_good_image" 
		    	:src="currentGoodData.image">
		    </image>
				<view class="buy_good_name">
					<text>{{ currentGoodData.name }}</text>
				</view>
				<view class="buy_good_info">
					<view class="buy_good_address">
						
					</view>
					<view class="buy_good_score">
						<view class="buy_good_score_left">
							<text>所需积分：</text>
							<text class="higt_light">{{ currentGoodData.score }}</text>
						</view>
						<view class="buy_good_score_right">
							<text>拥有积分：</text>
							<text class="higt_light">{{ userInfo.score }}</text>
						</view>
					</view>
				</view>
				<view class="buy_good_footer">
					<u-button 
						type="error"
						text="兑换"
						@click="bugClickHandle(currentGoodData)">
					</u-button>
				</view>
		  </view>
		</u-popup>
		<!-- 提示组件 -->
		<u-modal 
			showConfirmButton
			showCancelButton
			confirmText="确认兑换"
			:show="modalShow" 
			:title="modalTitle"
			@cancel="modalCancelHandle"
			@confirm="modalConfirmHandle">
			<template #default>
				<view>{{ userInfo.address }}</view>
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
					title:'积分商店',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff'
				},
				popupDialogType:'',
				goodsList:[],
				currentGoodData:{},
				userId:'',
				userInfo:{},
				buyPageShow:false,
				modalShow:false,
				modalTitle:''
			};
		},
		methods:{
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
			// 获取商品列表
			getGoodList(){
				uni.request({
					url: `http://localhost:3000/web/api/getGoodList`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					success: (res) => {
						if(res.data.code === 200){
							this.goodsList = res.data.data
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
							this.userInfo = res.data.data
							console.log('userInfo---',this.userInfo);
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
			goodClickHandle(item){
				if(item.total !== 0){
					this.currentGoodData = item
					this.buyPageShow = true
				}else{
					this.$refs.uToast.show({
						type: 'error',
						message: '商品没货了喔~',
						icon:false
					})
				}
			},
			buyPageOpenhandle(){
				console.log('buyPageOpenhandle');
			},
			buyPageClosehandle(){
				console.log('buyPageClosehandle');
				this.buyPageShow = false
			},
			// 点击兑换触发
			bugClickHandle(item){
				if(item.score > this.userInfo.score){
					this.buyPageShow = false
					this.$refs.uToast.show({
						type: 'error',
						message: '当前积分不足',
						icon:false,
						duration:3000
					})
					return
				}
				if(!this.userInfo.address){
					this.buyPageShow = false
					this.$refs.uToast.show({
						type: 'error',
						message: '请在个人中心完善收货地址',
						icon:false,
						duration:3000
					})
				}else{
					this.buyPageShow = false
					this.modalTitle = '收货地址'
					this.modalShow = true
				}
			},
			modalCancelHandle(){
				this.modalShow = false
			},
			modalConfirmHandle(){
				this.modalShow = false
				const goodInfo = this.currentGoodData
				// 生成订单
				const orderData = {
					userId:this.userId,
					giftId:goodInfo.id,
					score:goodInfo.score,
					address:this.userInfo.address
				}
				uni.request({
					url: `http://localhost:3000/web/api/addOrder`,
					method: 'POST',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						...orderData
					},
					success: (res) => {
						if(res.data.code === 200){
							this.getUserInfo()
							this.getGoodList()
							this.$refs.uToast.show({
								type: 'success',
								message: '商品兑换成功~',
								icon:false,
								duration:3000
							})
						}else if(res.data.code === 401){
							this.$refs.uToast.show({
								type: 'error',
								message: res.data.message,
								icon:false,
								duration:3000
							})
							setTimeout(()=>{
								uni.redirectTo({
									url:'/pages/login/login'
								})
							},2000)
						}else{
							this.$refs.uToast.show({
								type: 'error',
								message: '商品兑换失败~',
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
			this.getGoodList()
			this.getUserInfo()
		}
	}
</script>

<style lang="less" scoped>
.score_store{
	height: 100vh;
	width: 100vw;
	background-color: #f2f2f2;
	.score_store_goodsList{
		height: calc(100vh - 102rpx);
		width: 100%;
		box-sizing: border-box;
		.good_list{	
			display: flex;
			flex-wrap: wrap;
			.good_item{
				width: 50vw;
				padding: 20rpx;
				box-sizing: border-box;
				.item_wrapper{
					background-color: #fff;
					box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, .7);
					border-radius: 10rpx;
					overflow: hidden;
				}
				.good_image{
					width: 100%;
					height: 50vw;
				}
				.good_name{
					padding: 0 20rpx;
					text-align: center;
					overflow:hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.good_footer{
					display: flex;
					padding: 0 20rpx;
					justify-content: space-between;
					font-size: 24rpx;
					color: #aaaaaa;
					.good_footer_left{
						color: #eb5544;
					}
				}
			}
		}
	}
}
.buy_good{
	border-radius: 20rpx;
	overflow: hidden;
	background-color: #fff;
	width: 70vw;
	.buy_good_image{
		width: 100%;
		height: 70vw;
	}
	.buy_good_name{
		text-align: center;
		overflow:hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-weight: 700;
		font-size: 35rpx
	}
	.buy_good_info{
		.buy_good_score{
			padding: 0 20rpx;
			margin: 30rpx 0;
			display: flex;
			justify-content: space-between;
			color: #a5a5a5;
			.higt_light{
				color: #eb5544;
			}
		}
	}
}
.u-popup__content{
	background-color: red !important;
}
</style>
