<template>
	<view class="article_search">
		<uni-search-bar 
			:focus="true" 
			v-model="searchValue"
			bgColor="#e2e2e2"
			radius="30"
			@confirm="confirm" 
			@cancel="cancel">
		</uni-search-bar>
		<!-- 文章列表 -->
		<scroll-view
			v-if="articleList.length"
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
		<u-empty
			v-else
		  mode="search"
		  icon="http://cdn.uviewui.com/uview/empty/car.png">
		</u-empty>
		<!-- 提示组件 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { formateUtcString } from '../../utils/dataFormate.js'
	export default {
		data() {
			return {
				searchValue:'',
				articleList:[]
			};
		},
		methods:{
			confirm({value}){
				uni.request({
					url: `http://localhost:3000/web/api/getSearchList`,
					method: 'GET',
					data:{
						title:value,
						type:0
					},
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
			cancel(){
				uni.navigateBack()
			},
			transformDate(date,format){
				return formateUtcString(date,format)
			},
			// 文章点击触发
			articleClickHandle(item){
				uni.navigateTo({
					url:`/pages/articleDetail/articleDetail?articleId=${item.id}`,
				})
			},
		}
	}
</script>

<style lang="less" scoped>
.article_search{
	width: 100vw;
	height: 100vh;
	background-color: #fff;
	.article_list{
		height: calc(100vh - 56px);
		box-sizing: border-box;
		padding: 30rpx;
		.article{
			margin-bottom: 30rpx;
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
