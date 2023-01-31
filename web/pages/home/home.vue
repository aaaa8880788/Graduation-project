<template>
	<view class="home">
		<!-- 导航栏 -->
		<navBar></navBar>
		<navTop 
			:navData="navData"
			@itemChange="itemChangeHandle">
		</navTop>
		<!-- 文章列表 -->
		<scroll-view
			class="article_list" 
			scroll-y="true" >
			<view
				class="article"
				v-for="item,index in currentArticleList"
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
		<!-- 提示组件 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { formateUtcString } from '../../utils/dataFormate.js'
	export default {
		data() {
			return {
				navData:['推荐','时事要闻','新思想','党史','党建'],
				currentActive:'推荐',
				articleList:[]
			};
		},
		computed:{
			currentArticleList(){
				let arr = []
				const article = this.articleList.find(item => item.name === this.currentActive)
				if(article){
						arr = article.data
				}
				return arr
			},
		},
		methods:{
			itemChangeHandle(index,item){
				this.currentActive = item
			},
			getArticleList(){
				uni.request({
					url: `http://localhost:3000/web/api/getArticlesList`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					success: (res) => {
						if(res.data.code === 200){
							this.articleList = res.data.data
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
			// 文章点击触发
			articleClickHandle(item){
				uni.navigateTo({
					url:`/pages/articleDetail/articleDetail?articleId=${item.id}`,
				})
			}
		},
		onLoad() {
			this.getArticleList()
		}
	}
</script>

<style lang="less">
.home{
	height: calc(100vh - 50px);
	.article_list{
		height: calc(100vh - 50px - 44px - 80rpx);
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
