<template>
	<view class="my_comment">
		<view class="my_comment_nav">
			<uni-nav-bar 
				v-bind="navBar"
				@clickLeft="navLeftHandle"/>
		</view>
		<!-- 文章列表 -->
		<scroll-view
			class="comment_list" 
			scroll-y="true" >
			<view
				class="comment"
				v-for="item,index in commentList"
				:key="item.id"
				@click="commentClickHandle(item)">
				<view class="comment_title">
					<text>{{item.content}}</text>
				</view>
				<view class="comment_content">
					<view class="comment_content_left">
						<text>{{ transformDate(item.moment) }}</text>
					</view>
					<view class="comment_content_right">
						<template v-if="item.commentType === 0">
							<text>文章</text>
						</template>
						<template v-else-if="item.commentType === 1">
							<text>视频</text>
						</template>
						<template v-else>
							<text>活动</text>
						</template>
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
					title:'我的评论',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff'
				},
				commentList:[],
				userId:''
			};
		},
		methods:{
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
			getCommentList(){
				uni.request({
					url: `http://localhost:3000/web/api/getCommentList?id=${this.userId}`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					success: (res) => {
						if(res.data.code === 200){
							this.commentList = res.data.data
							console.log('commentList---',this.commentList);
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
			commentClickHandle(item){
				switch (item.commentType){
					case 0:
						uni.navigateTo({
							url:`/pages/articleDetail/articleDetail?articleId=${item.fatherId}`
						})
						break;
					case 1:
						uni.navigateTo({
							url:`/pages/vedioDetail/vedioDetail?vedioId=${item.fatherId}`
						})
						break;
					case 2:
						uni.navigateTo({
							url:`/pages/activeDetail/activeDetail?activeId=${item.fatherId}`
						})
						break;
				}
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync('userId')
		},
		onShow(){
			this.getCommentList()
		}
	}
</script>

<style lang="less" scoped>
.my_comment{
	height: 100vh;
	width: 100vw;
	.comment_list{
		height: calc(100vh - 102rpx);
		box-sizing: border-box;
		padding: 0 30rpx;
		.comment{
			margin: 30rpx 0;
			padding-bottom: 30rpx;
			border-bottom: 1px solid #ccc;
			.comment_title{
				font-weight: 700;
				font-size: 30rpx;
				line-height: 35rpx;
				overflow: hidden;//多出的隐藏
				text-overflow: ellipsis;//多出部分用...代替
				display: -webkit-box;//定义为盒子模型显示
				-webkit-line-clamp: 2;//用来限制在一个块元素显示的文本的行数
				-webkit-box-orient: vertical;//从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
			}
			.comment_content{
				margin-top: 10rpx;
				display: flex;
				justify-content: space-between;
				color: #ccc;
				.comment_content_right{
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
