<template>
	<view class="love_article">
		<view class="love_article_nav">
			<uni-nav-bar 
				v-bind="navBar"
				@clickLeft="navLeftHandle"/>
		</view>
		<!-- 文章列表 -->
		<scroll-view
			class="article_list" 
			scroll-y="true" >
			<view
				class="article"
				v-for="item,index in articleList"
				:key="item.id"
				@click="articleClickHandle(item)">
				<view class="article_title">
					<text>{{item.title}}</text>
				</view>
				<view class="article_content">
					<view class="article_content_left">
						<text>{{ transformDate(item.moment) }}</text>
					</view>
					<view class="article_content_right">
						<u-icon 
							name="star"
							class="star"></u-icon>
						<text>{{item.supportUser.length}}</text>
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
					title:'收藏的文章',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff'
				},
				articleList:[],
				userId:''
			};
		},
		methods:{
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
			// 获取收藏文章列表
			getLoveArticleList(){
				uni.request({
					url: `http://localhost:3000/web/api/getLoveArticleList?id=${this.userId}`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					success: (res) => {
						if(res.data.code === 200){
							this.articleList = res.data.data
							console.log('articleList---',this.articleList);
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
			articleClickHandle(item){
				uni.navigateTo({
					url:`/pages/articleDetail/articleDetail?articleId=${item.id}`
				})
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync('userId')
		},
		onShow(){
			this.getLoveArticleList()
		}
	}
</script>

<style lang="less" scoped>
.love_article{
	height: 100vh;
	width: 100vw;
	.article_list{
		height: calc(100vh - 102rpx);
		box-sizing: border-box;
		padding: 0 30rpx;
		.article{
			margin: 30rpx 0;
			padding-bottom: 30rpx;
			border-bottom: 1px solid #ccc;
			.article_title{
				font-weight: 700;
				font-size: 30rpx;
				line-height: 35rpx;
			}
			.article_content{
				margin-top: 10rpx;
				display: flex;
				justify-content: space-between;
				color: #ccc;
				.article_content_right{
					.star{
						margin-right: 5rpx;
					}
					display: flex;
					color: #969696;
				}
			}
		}
	}
}
</style>
