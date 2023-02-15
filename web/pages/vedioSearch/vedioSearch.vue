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
		<!-- 视频列表 -->
		<scroll-view
			v-if="vedioList.length"
			class="vedio_list" 
			scroll-y="true" >
			<view 
				class="vedio_item"
				v-for="item,index in vedioList"
				:key="item.id"
				@click="vedioClickHandle(item)">
				<view class="vedio_image">
					<image :src="item.image"></image>
					<view class="play_icon">
						<u-icon
							name="play-right-fill" 
							color="#fff"
							size="20"></u-icon>
					</view>
				</view>
				<view class="vedio_content">
					<view class="vedio_title">
						<text>{{item.title}}</text>
					</view>
					<view class="vedio_footer">
						<view class="footer_left">
							<text>{{ transformDate(item.moment) }}</text>
						</view>
						<view class="footer_right">
							<u-icon
								name="star"
								class="star"></u-icon>
							<text>{{item.supportUser.length}}</text>
						</view>
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
				vedioList:[]
			};
		},
		methods:{
			confirm({value}){
				uni.request({
					url: `http://localhost:3000/web/api/getSearchList`,
					method: 'GET',
					data:{
						title:value,
						type:1
					},
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					success: (res) => {
						if(res.data.code === 200){
							this.vedioList = res.data.data
							console.log('vedioList---',this.vedioList);
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
			// 视频点击触发
			vedioClickHandle(item){
				uni.navigateTo({
					url:`/pages/vedioDetail/vedioDetail?vedioId=${item.id}`,
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.article_search{
	width: 100vw;
	height: 100vh;
	background-color: #fff;
	.vedio_list{
		height: calc(100vh - 56px);
		box-sizing: border-box;
		.vedio_item{
			.vedio_image{
				width: 100%;
				height: 400rpx;
				position: relative;
				image{
					width: 100%;
					height: 100%;
				}
				.play_icon{
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%);
					background-color: rgba(0, 0, 0, .5);
					border-radius: 50%;
					padding: 40rpx;
				}
			}
			.vedio_content{
				padding: 20rpx 30rpx;
				.vedio_title{
					font-weight: 700;
					font-size: 30rpx;
					line-height: 35rpx;
				}
				.vedio_footer{
					margin-top: 10rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #adadad;
					.footer_right{
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
}
</style>
