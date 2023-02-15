<template>
	<view class="article_detail">
		<view class="article_nav">
			<uni-nav-bar 
				v-bind="navBar"
				@clickLeft="navLeftHandle">
				<template #right="scoped">
					<countDown
						ref="countDown"
						:time="countDownTime"
						@timeover="timeoverHandle"
						@remainderChange="remainderChangeHandle">
					</countDown>
				</template>
			</uni-nav-bar>
		</view>
		<scroll-view 
			v-if="articleData"
			class="article_content"
			scroll-y="true"
			:scroll-top="scrollTop"
			:scroll-with-animation="true"
			@scroll="scrollViewOnHandle">
			<view class="article_title">
				<text>{{articleData.title}}</text>
			</view>
			<view 
				class="article_item" 
				v-html="articleData.body">
			</view>
			<view class="article_footer">
				<view class="article_footer_left">
					<text class="font">评论</text>
					<text>{{ commentList.length }}</text>
				</view>
				<view class="article_footer_right">
					<text class="font">收藏</text>
					<text>{{ articleData.supportUser.length }}</text>
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
	</view>
</template>

<script>
	import { getLastTime } from '../../utils/dataFormate.js'
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
				countDownTime: 1000 * 59,
				remainder:0,
				popupDialog:{
					type:'success',
					content:"默认信息",
					duration:2000,
					beforeClose:true
				},
				articleId:'',
				userId:'',
				isShowBackTop:false,
				scrollTop:0,
				setScrollTop:0,
				articleData:{
					supportUser:[]
				},
				commentList:[],
				isShowPopup:false,
				commentContent:'',
				isLight:false
			};
		},
		watch:{
			articleData:{
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
			// 计时结束处理函数
			timeoverHandle(){
				uni.request({
					url: `http://localhost:3000/web/api/updateUserInfo?id=${this.userId}`,
					method: 'POST',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						score: 1
					},
					success: (res) => {
						if(res.data.code === 200){
							this.$refs.uToast.show({
								type: 'success',
								message: '积分获取成功~',
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
							},)
						}
					},
					fail: (err) => {
						console.log('err',err);
					}
				})
				this.$refs.countDown.reset()
			},
			remainderChangeHandle(remainder){
				this.remainder = remainder
			},
			// 计时后对话框关闭
			dialogCloseHandle(){
				this.$refs.countDown.start()
				this.$refs.tipDialogRef.close()
			},
			// 计时后对话框确定
			dialogConfirmHandle(){
				uni.navigateBack()
			},
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				this.$refs.countDown.pause()
				this.popupDialog.content = `${this.remainder}秒后将会奖励1积分，是否确定退出？`
				this.$refs.tipDialogRef.open()
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
			getLastTime(time){
				return getLastTime(time)
			},
			getCommentList(){
				uni.request({
					url: `http://localhost:3000/web/api/getCommentList`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						fatherId: this.articleId
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
			getArticleDetail(){
				uni.request({
					url: `http://localhost:3000/web/api/getArticleDetail`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						id: this.articleId
					},
					success: (res) => {
						if(res.data.code === 200){
							this.articleData = res.data.data
							setTimeout(()=>{
								this.getCommentListPositon()
							})
							console.log('articleData',this.articleData)
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
						type:0,
						id:this.articleId,
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
								this.getArticleDetail()
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
			// 发表观点点击
			publishClickHandle(){
				this.isShowPopup = true
				this.scrollTop = 0
				this.$nextTick(()=>{
					this.scrollTop = this.setScrollTop
				})
			},
			getCommentListPositon(){
				const query = uni.createSelectorQuery();
				query.select('.commentList').boundingClientRect(res => {
				  this.setScrollTop = res.top - 50;
				}).exec()
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
					commentType:0,// 0 为文章类型
					userId:this.userId,
					fatherId:this.articleId
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
			isSupport(userArray){
				const index = userArray.findIndex(item => item === this.userId)
				if(index === -1){
					return false
				}else{
					return true
				}
			}
		},
		onLoad(query){
			const { articleId } = query
			this.articleId = articleId
			this.userId = JSON.parse(uni.getStorageSync('userId'))
			this.getArticleDetail()
			this.getCommentList()
		},
	}
</script>

<style lang="less">
.article_detail{
	height: calc(100vh - 50px);
	.article_content{
		background-color: #f0f0f0;
		height: calc(100vh - 100px);
		box-sizing: border-box;
		padding: 0 20rpx;
		.article_title{
			font-weight: 700;
			font-size: 35rpx;
			margin-bottom: 30rpx;
		}
		.article_footer{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30rpx;
			text-align: center;
			.article_footer_left,.article_footer_right{
				color: #fff;
				border-radius: 10rpx;
				height: 60rpx;
				line-height: 60rpx;
				width: 45%;
				background-color: #eb5544;
				.font{
					margin-right: 10rpx;
				}
			}
		}
		.commentList{
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
