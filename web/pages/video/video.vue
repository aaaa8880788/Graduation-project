<template>
	<view class="vedio">
		<!-- 导航栏 -->
		<navBar></navBar>
		<navTop 
			:navData="navData"
			@itemChange="itemChangeHandle">
		</navTop>
		<scroll-view 
			class="vedio_list" 
			scroll-y="true" >
			<view 
				class="vedio_item"
				v-for="item,index in currentVedioList"
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
				vedioList:[]
			};
		},
		computed:{
			currentVedioList(){
				let arr = []
				const vedio = this.vedioList.find(item => item.name === this.currentActive)
				if(vedio){
						arr = vedio.data
				}
				return arr
			},
		},
		methods:{
			itemChangeHandle(index,item){
				this.currentActive = item
			},
			transformDate(date,format){
				return formateUtcString(date,format)
			},
			getVedioList(){
				uni.request({
					url: `http://localhost:3000/web/api/getVedioesList`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					success: (res) => {
						if(res.data.code === 200){
							this.vedioList = res.data.data
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
			vedioClickHandle(item){
				uni.navigateTo({
					url:`/pages/vedioDetail/vedioDetail?vedioId=${item.id}`,
				})
			}
		},
		onLoad() {
			this.getVedioList()
		}
	}
</script>

<style lang="less">
.vedio{
	height: calc(100vh - 50px);
	.vedio_list{
		height: calc(100vh - 50px - 44px - 80rpx);
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
