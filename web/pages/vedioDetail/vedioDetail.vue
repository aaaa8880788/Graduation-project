<template>
	<view class="vedio_detail">
		<view class="vedio_nav">
			<uni-nav-bar 
				v-bind="navBar"
				@clickLeft="navLeftHandle"/>
		</view>
		<xiao-video-component :src="vedioData.vedio"></xiao-video-component>
		<scroll-view 
			class="vedio_content"
			scroll-y="true" 
			:scroll-top="scrollTop"
			:scroll-with-animation="true"
			@scroll="scrollViewOnHandle"
			:style="{height:navHeight+'px'}">
			<view class="vedio_header">
				<view class="vedio_title">
					<text>{{ vedioData.title }}</text>
				</view>
				<view 
					class="vedio_desc" 
					v-html="vedioData.body">
				</view>
				<view class="vidio_desc_header">
					<text style="margin-right: 20rpx;">智慧党建学习平台</text>
					<text>{{ transformDate(vedioData.moment) }}</text>
				</view>
				<view class="vidio_desc_footer">
					<view class="vidio_desc_footer_left">
						<text class="font">评论</text>
						<text>{{ commentList.length }}</text>
					</view>
					<view class="vidio_desc_footer_right">
						<text class="font">收藏</text>
						<text>{{ vedioData.supportUser.length }}</text>
					</view>
				</view>
			</view>
			<view class="commentList">
				<view class="comment_header">
					<text class="comment_title">观点</text>
				</view>
				<view 
					v-if="commentList.length"
					class="comment_List">
					<view 
						class="comment_item"
						v-for="item in commentList">
						<view class="comment_left">
							<image
								v-if="item.userData.avatar"
								class="default" 
								:src="item.userData.avatar">
							</image>
							<image 
								v-else
								class="default" 
								src="../../static/user_default.png">
							</image>
						</view>
						<view class="comment_right">
							<view class="comment_right_title">
								<view class="comment_name">
									<text>{{ item.userData.name }}</text>
								</view>
								<view 
									class="comment_support" 
									@click="supportCommentHandle(item)">
									<text class="count">{{ item.supportUser.length }}</text>
									<u-icon 
										v-if="isSupport(item.supportUser)"
										name="thumb-up-fill" 
										color="#eb5544"
										size="16">
									</u-icon>
									<u-icon
										v-else
										name="thumb-up" 
										color="#a6a6a6"
										size="16">
									</u-icon>
								</view>
							</view>
							<view class="comment_right_content">
								<text>{{ item.content }}</text>
							</view>
							<view class="comment_right_footer">
								<text class="moment">{{ getLastTime(item.moment) }}</text>
								<text class="center">·</text>
								<text class="reply">回复</text>
							</view>
						</view>
					</view>
				</view>
				<u-empty 
					v-else
					mode="comment"
					icon="http://cdn.uviewui.com/uview/empty/comment.png">
				</u-empty>
			</view>
		</scroll-view>
		<commentBar
			:commentCount="commentList.length"
			:isLight="isLight"
			@iconClick="iconClickHandle"
			@publishClick="publishClickHandle">
		</commentBar>
		<backTop 
			:isShowBackTop="isShowBackTop"
			@backTopClick="backTopClickHandle">
		</backTop>
		<publishComment 
			v-model="commentContent"
			:isShowPopup="isShowPopup"
			@popupCloseBtnClick="popupCloseHandle"
			@popupPublishClick="popupPublishHandle">
		</publishComment>
		<!-- 提示组件 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { formateUtcString,getLastTime } from '../../utils/dataFormate.js'
	export default {
		data() {
			return {
				navBar:{
					shadow:true,
					leftIcon:'left',
					leftText:'返回',
					title:'详情',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff'
				},
				vedioData:{
					supportUser:[]
				},
				userId:'',
				isShowBackTop:false,
				scrollTop:0,
				setScrollTop:0,
				isLight:false,
				commentList:[],
				isShowPopup:false,
				commentContent:'',
				pH:0, //窗口高度
				navHeight:0, //元素的所需高度
			};
		},
		watch:{
			vedioData:{
				handler(newValue,oldValue){
					if(newValue.supportUser.length){
						const index = newValue.supportUser.findIndex(item => item === this.userId)
						if(index === -1){
							this.isLight = false
						}else{
							this.isLight = true
						}
					}else{
						this.isLight = false
					}
				},
				deep:true
			}
		},
		methods:{
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
			isSupport(userArray){
				const index = userArray.findIndex(item => item === this.userId)
				if(index === -1){
					return false
				}else{
					return true
				}
			},
			// 发表观点点击
			publishClickHandle(){
				this.isShowPopup = true
				this.scrollTop = 0
				this.$nextTick(()=>{
					this.scrollTop = this.setScrollTop
				})
			},
			getVedioDetail(){
				uni.request({
					url: `http://localhost:3000/web/api/getVedioDetail`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						id: this.vedioId
					},
					success: (res) => {
						if(res.data.code === 200){
							this.vedioData = res.data.data
							setTimeout(()=>{
								this.getCommentListPositon()
							})
							console.log('vedioData',this.vedioData)
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
			getLastTime(time){
				return getLastTime(time)
			},
			getCommentListPositon(){
				const query = uni.createSelectorQuery();
				query.select('.commentList').boundingClientRect(res => {
				  this.setScrollTop = res.top - 50;
				}).exec()
			},
			getCommentList(){
				uni.request({
					url: `http://localhost:3000/web/api/getCommentList`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						fatherId: this.vedioId
					},
					success: (res) => {
						if(res.data.code === 200){
							this.commentList = res.data.data
							console.log('commentList',this.commentList)
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
			// 评论点赞
			supportCommentHandle(item){
				const supportComment = {
					id:item.id,
					userId:this.userId
				}
				uni.request({
					url: `http://localhost:3000/web/api/supportComment`,
					method: 'POST',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						...supportComment
					},
					success: (res) => {
						if(res.data.code === 200){
							this.getCommentList()
							this.$refs.uToast.show({
								type: 'success',
								message: res.data.message,
								icon:false
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
							})
						}
					},
					fail: (err) => {
						console.log('err',err);
					}
				})
			},	
			iconClickHandle(item){
				if(item === 'chat'){
					// 评论图标点击
					// 获取某元素距离顶部的距离
					var query = uni.createSelectorQuery();
					this.scrollTop = 0
					this.$nextTick(()=>{
						this.scrollTop = this.setScrollTop
					})
				}else{
					// 收藏图标点击
					const userCollect = {
						type:1,
						id:this.vedioId,
						userId:this.userId
					}
					uni.request({
						url: `http://localhost:3000/web/api/userCollect`,
						method: 'POST',
						header:{
							Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
						},
						data:{
							...userCollect
						},
						success: (res) => {
							if(res.data.code === 200){
								this.getVedioDetail()
								this.$refs.uToast.show({
									type: 'success',
									message: res.data.message,
									icon:false
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
								})
							}
						},
						fail: (err) => {
							console.log('err',err);
						}
					})
				}
			},
			// 滚动监听
			scrollViewOnHandle(e){
				if(e.detail.scrollTop > 470){
					this.isShowBackTop = true
				}else{
					this.isShowBackTop = false
				}
			},
			backTopClickHandle(){
				this.scrollTop = this.setScrollTop
				this.$nextTick(()=>{
					this.scrollTop = 0
				})
			},
			// 评论弹出层关闭触发
			popupCloseHandle(){
				this.commentContent = ''
				this.isShowPopup = false
			},
			// 发布评论点击触发
			popupPublishHandle(value){
				const publishData = {
					content:value,
					commentType:1,// 0 为视频类型
					userId:this.userId,
					fatherId:this.vedioId
				}
				uni.request({
					url: `http://localhost:3000/web/api/publishComment`,
					method: 'POST',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						...publishData
					},
					success: (res) => {
						if(res.data.code === 200){
							this.$refs.uToast.show({
								type: 'success',
								message: '评论成功,待管理员评审通过~',
								icon:false
							})
							this.getCommentList()
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
		},
		onLoad(query){
			const { vedioId } = query
			this.vedioId = vedioId
			this.userId = JSON.parse(uni.getStorageSync('userId'))
			this.getVedioDetail()
			this.getCommentList()
		},
		onReady() {
			let that=this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					that._data.pH=res.windowHeight //windoHeight为窗口高度，主要使用的是这个
					let titleH=uni.createSelectorQuery().select(".vedio_content"); //想要获取高度的元素名（class/id）
					titleH.boundingClientRect(data=>{
						let pH=that._data.pH; 
						that._data.navHeight=pH-data.top  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
					}).exec()
				}
			})
		},

	}
</script>

<style lang="less">
.vedio_detail{
	height: 100vh;
	width: 100vw;
	background-color: #fff;
	.vedio_content{
		.vedio_header{
			padding: 20rpx 30rpx;
			.vedio_title{
				font-size: 40rpx;
				font-weight: 700;
			}
			.vedio_desc{
				margin: 20rpx 0 5rpx 0 ;
				font-size: 24rpx;
				color: #b5b5b5;
			}
			.vidio_desc_header{
				font-size: 24rpx;
				color: #b5b5b5;
			}
			.vidio_desc_footer{
				margin-top: 30rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 30rpx;
				text-align: center;
				.vidio_desc_footer_left,.vidio_desc_footer_right{
					border-radius: 10rpx;
					height: 60rpx;
					line-height: 60rpx;
					width: 45%;
					background-color: #eaeaeb;
					.font{
						color: #818181;
						margin-right: 10rpx;
					}
				}
			}
		}
		.commentList{
			padding: 0 20rpx;
			.comment_header{
				border-bottom: 1px solid #ccc;
				padding-bottom: 20rpx;
				.comment_title{
					border-left: 10rpx solid #eb5544;
					padding-left: 20rpx;
					font-size: 40rpx;
					font-weight: 700;
				}
			}
			.comment_List{
				padding-bottom: 40rpx;
				.comment_item{
					margin-top: 50rpx;
					display: flex;
					.comment_left{
						width: 10%;
						.default{
							width: 60rpx;
							height: 60rpx;
							border-radius: 100%;
						}
					}
					.comment_right{
						width: 90%;
						.comment_right_title{
							height: 40rpx;
							line-height: 40rpx;
							display: flex;
							align-items: flex-start;
							justify-content: space-between;
							.comment_name{
								color: #a79988;
							}
							.comment_support{
								display: flex;
								align-items: center;
								color: #a6a6a6;
								.count{
									margin-right: 5rpx;
									font-size: 24rpx
								}
							}
						}
						.comment_right_content{
							margin-top: 10rpx;
							line-height: 35rpx;
						}
						.comment_right_footer{
							margin-top: 10rpx;
							.moment{
								color: #b8b8b8;
							}
							.center{
								margin: 0 10rpx;
							}
						}
					}
				}
			}
		}
	}
}
</style>
