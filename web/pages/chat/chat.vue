<template>
	<view class="chat">
		<!-- 顶部 -->
		<view class="chat_top_bar">
			<view class="top_bar_left">
				<view
					class="top_bar_navigator"
					hover-class="none"
					@click="toChatUserInfoHandle">
					<image 
						v-if="myInfoData.avatar"
						class="avatar"
						:src="myInfoData.avatar">
					</image>
					<image
						v-else
						class="avatar"
						src="../../static/default_avatar.jpg">
					</image>
				</view>
				<view class="user_status">
					<text>在线</text>
				</view>
			</view>
			<view class="top_bar_right">
				<view 
					class="add_btn"
					@click="addBtnClickHandle">
					<u-icon 
						name="plus" 
						color="#000"
						bold></u-icon>
				</view>
			</view>
		</view>
		<scroll-view 
			class="chat_scroll"
			scroll-y="true">
			<view 
				v-if="myChatData.length"
				class="chat_list">
				<view 
					class="chat_item"
					v-for="(item,index) in myChatData"
					:key="item.id"
					@click="chatItemClickHandle(item)">
						<!-- 群 -->
						<template v-if="item.type == 0"> 
							<view class="chat_item_left">
								<image 
									v-if="item.targetData.image"
									class="user_avatar"
									:src="item.targetData.image">
								</image>
								<image
									v-else
									class="user_avatar"
									src="../../static/chat_default.png">
								</image>
							</view>
							<view class="chat_item_right">
								<view class="chat_item_right_title">
									<view class="chat_name">
										<text>{{ item.targetData.name }}</text>
									</view>
									<view class="chat_time">
										<text>18:28</text>
									</view>
								</view>
								<view class="chat_item_right_content">
									<text style="margin-right: 10rpx;">[群聊]</text>
									<text>{{ item.targetData.notice }}</text>
								</view>
							</view>
						</template>
						<!-- 好友 -->
						<template v-else>
							<view class="chat_item_left">
								<image 
									v-if="item.targetData.avatar"
									class="user_avatar"
									:src="item.targetData.avatar">
								</image>
								<image
									v-else
									class="user_avatar"
									src="../../static/chat_default.png">
								</image>
							</view>
							<view class="chat_item_right">
								<view class="chat_item_right_title">
									<view class="chat_name">
										<text>{{ item.targetData.name }}</text>
									</view>
									<view class="chat_time">
										<text v-if="item.lastMessageData">{{ changeTime(item.lastMessageData.moment) }}</text>
										<text v-else>{{ changeTime(item.moment) }}</text>						
									</view>
								</view>
								<view class="chat_item_right_content">
									<text style="margin-right: 10rpx;">[私聊]</text>
									<text v-if="item.lastMessageData">{{ item.lastMessageData.message }}</text>
									<text v-else>暂无记录</text>
								</view>
							</view>
						</template>
				</view>
			</view>
		</scroll-view>
		<!-- 提示组件 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { dataTime,dataTime1 } from '../../utils/utils.js'
	export default {
		data() {
			return {
				myInfoData:{},
				chatList:[],
			};
		},
		computed:{
			myChatData(){
				if(this.chatList.length){
					const arr = this.chatList.map(item => {
						if(item.lastMessageData){
							item.lastTime = item.lastMessageData.moment
						}else{
							item.lastTime = item.moment
						}
						return item
					})
					arr.sort((a,b) => {
						const timeA = new Date(a.lastTime)
					  const timeB = new Date(b.lastTime)
					  return timeB - timeA
					})
					return arr
				}
				return []
			}
		},
		methods:{
			// 处理时间
			changeTime(date){
				return dataTime1(date)
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
							this.myInfoData = res.data.data
							console.log('myInfoData---',this.myInfoData);
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
			// 获取聊天信息列表
			getChatMessage(){
				uni.request({
					url: `http://localhost:3000/web/api/getChatMessage`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						userId:this.userId
					},
					success: (res) => {
						if(res.data.code === 200){
							this.chatList = res.data.data
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
			addBtnClickHandle(){
				uni.navigateTo({
					url:"/pages/buildGroup/buildGroup"
				})
			},
			toChatUserInfoHandle(){
				uni.navigateTo({
					url:`/pages/chatUserInfo/chatUserInfo?id=${this.userId}`
				})
			},
			chatItemClickHandle(item){
				console.log('itme===',item);
				switch (item.type){
					// 群
					case 0:
						uni.navigateTo({
							url:`/pages/worldRoom/worldRoom?groupId=${item.targetId}&name=${item.targetData.name}`
						})
						break;
					// 好友
					case 1:
						uni.navigateTo({
							url:`/pages/chatRoom/chatRoom?friendId=${item.targetId}`
						})
						break;
					
				}
				console.log('item===',item);
				
			},
			chatItemOpenHandle(){
				console.log('bbb');
			},
			changeTime(date) {
				return dataTime(date)
			},
		},
		onLoad() {
			this.userId = uni.getStorageSync('userId')
		},
		onShow(){
			this.getUserInfo()
			this.getChatMessage()
		}
	}
</script>

<style lang="less" scoped>
.chat{
	width: 100vw;
	.chat_top_bar{
		height: 100rpx;
		background-color: #eb5544;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		.top_bar_left{
			display: flex;
			align-items: center;
			.top_bar_navigator{
				display: flex;
				margin-right: 20rpx;
				.avatar,.default_avatar{
					width: 68rpx;
					height: 68rpx;
					border-radius: 16rpx;
					line-height: 68rpx;
					text-align: center;
				}	
			}
			.user_status{
				color: #fff;
				box-sizing: border-box;
				padding: 5rpx 20rpx;
				border-radius: 20rpx;
				background-color: rgba(0, 0, 0, .25);
			}
		}
		.top_bar_right{
			.add_btn{
				box-sizing: border-box;
				padding: 15rpx;
				border-radius: 20rpx;
				box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, .2);
			}
		}
	}
	.chat_scroll{
		height: calc(100vh - 102rpx - 50px);
		background-color: #fff;
		.chat_list{
			.chat_item{
				box-sizing: border-box;
				height: 120rpx;
				padding: 10rpx 20rpx;
				display: flex;
				.chat_item_left{
					height: 100%;
					width: 120rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					.user_avatar{
						width: 70rpx;
						height: 70rpx;
						border-radius: 100%;
					}
				}
				.chat_item_right{
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					.chat_item_right_title{
						display: flex;
						justify-content: space-between;
						.chat_name{
							font-weight: 700;
							font-size: 30rpx;
							max-width: 400rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						.chat_time{
							font-size: 24rpx;
							color: #bababa;
						}
					}
					.chat_item_right_content{
						font-size: 24rpx;
						color: #bababa;
						max-width: 500rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
	}
}
</style>
