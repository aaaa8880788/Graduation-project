<template>
	<view class="article_detail">
		<view class="article_nav">
			<uni-nav-bar 
				v-bind="navBar"
				@clickLeft="navLeftHandle"/>
		</view>
		<scroll-view 
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
					<text>999</text>
				</view>
				<view class="article_footer_right">
					<text class="font">收藏</text>
					<text>999</text>
				</view>
			</view>
			<view class="commentList">
				<view class="comment_header">
					<text class="comment_title">观点</text>
				</view>
				<view class="comment_List">
					<view 
						class="comment_item"
						v-for="item in 2">
						<view class="comment_left">
							<image 
								class="default" 
								src="../../static/user_default.png"></image>
						</view>
						<view class="comment_right">
							<view class="comment_right_title">
								<view class="comment_name">
									<text>吴文光</text>
								</view>
								<view class="comment_support">
									<text class="count">5</text>
									<u-icon 
										name="thumb-up" 
										color="#a6a6a6"
										size="16"></u-icon>
								</view>
							</view>
							<view class="comment_right_content">
								<text>人类命运与共，携手共进</text>
							</view>
							<view class="comment_right_footer">
								<text class="moment">11小时前</text>
								<text class="center">·</text>
								<text class="reply">回复</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<commentBar 
			@iconClick="iconClickHandle"
			@publishClick="publishClickHandle">
		</commentBar>
		<backTop 
			:isShowBackTop="isShowBackTop"
			@backTopClick="backTopClickHandle"></backTop>
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
					title:'详情',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff'
				},
				articleId:'',
				isShowBackTop:false,
				scrollTop:0,
				setScrollTop:0,
				articleData:{},
				commentList:[]
			};
		},
		methods:{
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
			getArticleDetail(){
				uni.request({
					url: `http://localhost:3000/web/api/getArticleDetail`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token')
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
				}
			},
			// 发表观点点击
			publishClickHandle(){
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
			}
		},
		onLoad(query){
			const { articleId } = query
			this.articleId = articleId
			this.getArticleDetail()
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
		padding: 0 20rpx 0 20rpx;
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
