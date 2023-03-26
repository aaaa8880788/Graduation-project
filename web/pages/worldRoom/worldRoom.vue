<template>
	<view class="chat_room">
		<view class="my_info_nav">
			<uni-nav-bar 
				v-bind="navBar"
				@clickLeft="navLeftHandle"/>
		</view>
		<scroll-view
			class="message_list"
			scroll-y="true"
			:scroll-with-animation="scrollAnimation"
			:scroll-into-view="scrollToView">
			<view 
				v-if="chatData.length"
				class="message_main"
				:style="{paddingBottom:footerHeight+'px'}"
				@click="scrollAreaClickHandle">
				<view class="message_item"
					v-for="(item, index) in chatData"
					:key="item.id"
					:id="`message${item.id}`">
						<!-- 时间 -->
						<view 
							v-if="item.moment && !item.justNow" 
							class="chat_time">
							<text>{{changeTime(item.moment)}}</text>
						</view>
						<!-- 群友消息 -->
						<view 
							v-if="item.userId != userId"
							class="message_common message_left">
							<!-- 头像 -->
							<view @click="avatarClick(item.userId)">
								<image
									v-if="item.userData.avatar"
									class="user_avatar" 
									:src="item.userData.avatar">
								</image>
								<view
									v-else
									class="user_default_avatar">
									<text>默</text>
								</view>
							</view>
							<!-- 头像 -->
							<!-- 消息 -->
							<view class="other_messgae">
								<view class="user_name">
									<text>{{ getIdentity(item.userData.type) }}：</text>
									<text>{{ item.userData.name }}</text>
								</view>
								<!-- 文字消息 -->
								<view 
									v-if="item.type == 0" 
									class="message animate__animated animate__fadeIn animate__faster">
									<text class="message_text">{{item.message}}</text>
								</view>
								<!-- 文字消息 -->
								<!-- 图像消息 -->
								<view 
									v-if="item.type == 1" 
									class="message_image">
									<image 
										:src="item.message" 
										mode="widthFix">
									</image>
								</view>
								<!-- 图像消息 -->
								<!-- 音频消息 -->
								<view 
									v-if="item.type == 2" 
									class="message">
									<view 
										class="message_text voice" 
										:style="{width:item.message.time*3.5+'px'}">
										<i 
											class="iconfont icon-yuyin1" 
											:class="{'isActive':isPlay}">
										</i>
										<span>{{item.message.time}}″</span>
									</view>
								</view>
							</view>
							<!-- 消息 -->
						</view>
						
						<!-- 本人消息 -->
						<view 
							v-if="item.userId == userId"
							class="message_common message_right" >
								<!-- 头像 -->
								<view @click="avatarClick(item.userId)">
									<image
										v-if="item.userData.avatar"
										class="user_avatar" 
										:src="item.userData.avatar">
									</image>
									<view
										v-else
										class="user_default_avatar">
										<text>默</text>
									</view>
								</view>
								<!-- 头像 -->
								<!-- 文字消息 -->
								<view 
									v-if="item.type == 0" 
									class="message animate__animated animate__fadeIn animate__faster">
									<text class="message_text">{{item.message}}</text>
								</view>
								<!-- 文字消息 -->
								<!-- 图像消息 -->
								<view 
									v-if="item.type == 1" 
									class="message">
									<image 
										class="message_image" 
										:src="item.message" 
										mode="widthFix">
									</image>
								</view>
								<!-- 图像消息 -->
								<!-- 音频消息 -->
								<view 
									v-if="item.type==2" 
									class="message">
									<view 
										class="message_text voice" 
										:style="{width:item.message.time*3.5+'px'}">
										<i
											class="iconfont icon-yuyin1" 
											:class="{'isActive':isPlay}">
										</i>
										<span>{{item.message.time}}"</span>
									</view>
								</view>
						</view>
				</view>
			</view>
		</scroll-view>
		<footerSubmit 
			ref="footerSubmit"
			v-model="content"
			@getHeight="getHeightHandle"
			@confirm="confirmHandle">
		</footerSubmit>
		<!-- 提示组件 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { chatData,dataTime1,spacTime } from '../../utils/utils.js'
	export default {
		data() {
			return {
				navBar:{
					shadow:true,
					leftIcon:'left',
					leftText:'返回',
					title:'群名称',
					height:'100rpx',
					backgroundColor:'transparent',
				},
				content:'',
				footerHeight:'60',
				// 滚动动画开启
				scrollAnimation:true,
				// 滚动到的位置盒子id
				scrollToView:'',
				userId:'',
				groupId:'',
				isPlay:false,
				chatData:[]
			};
		},
		methods:{
			getIdentity(type){
				switch (type){
					case 0:
					return '学生'
						break;
					case 1:
					return '教师'
						break;
				}
			},
			// 头像点击触发
			avatarClick(id){
				uni.navigateTo({
					url:`/pages/chatUserInfo/chatUserInfo?id=${id}`
				})
			},
			scrollAreaClickHandle(){
				if(this.$refs.footerSubmit){
					this.$refs.footerSubmit.closeEmoji()
				}
			},
			// 接收输入框高度
			getHeightHandle(height) {
				this.footerHeight = height
				if(this.chatData.length){
					this.ToBottom()
				}
			},
			// 消息自动定位到（最后一条）
			ToBottom () {
				this.scrollAnimation = true
				this.scrollToView=''
				this.$nextTick(() => {
					this.scrollToView = `message${this.chatData[this.chatData.length-1].id}`
				})
			},
			// 处理时间
			changeTime(date){
				return dataTime1(date)
			},
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
			// 获取聊天信息数据
			getGroupMessageInfo(){
				uni.request({
					url: `http://localhost:3000/web/api/getGroupMessageInfo`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						groupId:this.groupId,
					},
					success: (res) => {
						if(res.data.code === 200){
							this.chatData = res.data.data
							console.log('chatData---',this.chatData);
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
			confirmHandle(value){
				const data = {
					groupId:this.groupId,
					userId:this.userId,
					message:value,
					type:0
				}
				// 发送信息
				this.socket.emit('groupMessage', data)
			},
			// 接收消息(1.接收自己发送的信息 2.接收群友信息)-socket
			receiveSocketMessage() {
				this.socket.on('groupMessage',(data) => {
					// 时间间隔处理:justNow代表刚刚发的信息
					// 判断信息列表最后一条的时间与当前信息的时间间隔是否是1分钟内
					if(this.chatData.length){
						const lastChat = this.chatData[this.chatData.length - 1]
						let nowTime = new Date()
						let time = spacTime(lastChat.moment, data.moment)
						if(!time){
							// 间隔不大于1分钟
							data.justNow = true
						}
					}
					this.chatData.push(data)
					this.ToBottom()
				})
			}
		},
		onLoad(options) {
			const { groupId,name } = options
			this.userId = uni.getStorageSync('userId')
			this.groupId = groupId
			this.navBar.title = name
			this.getGroupMessageInfo()
			this.receiveSocketMessage()
		},
	}
</script>

<style lang="less" scoped>
.chat_room{
	height: 100vh;
	width: 100vw;
	position: relative;
	background-color: #f4f4f4;
	.message_list{
		height: calc(100vh - 102rpx);
		box-sizing: border-box;
		padding: 0rpx 30rpx;
		.message_main{
			display: flex;
			flex-direction: column;
			.message_item{
				.chat_time{
					font-size: 24rpx;
					line-height: 34rpx;
					color: rgba(39,40,50,0.3);
					padding: 20rpx 0;
					text-align: center;
				}
				// 公用
				.message_common{
					display: flex;
					padding: 20rpx 0;
					// 有头像
					.user_avatar {
						flex: none;
						width: 80rpx;
						height: 80rpx;
						border-radius: 20rpx;
					}
					// 无头像(默认头像)
					.user_default_avatar{
						text-align: center;
						background-color: #c1c1c1;
						flex: none;
						width: 80rpx;
						height: 80rpx;
						line-height: 80rpx;
						border-radius: 20rpx;
					}
					.message {
						display: flex;
						align-items: center;
						max-width: 480rpx;
						box-sizing: border-box;
						padding: 10rpx 14rpx;
						background-color: #95ec69;
						border-radius: 10rpx;
					}
					.message_text {
						box-sizing: border-box;
						font-size: 28rpx;
						color: #000;
						line-height: 44rpx;
					}
					.message_image {
						margin-left: 20rpx;
						image{
							max-width: 400rpx;
							border-radius: 20rpx;
						}
					}
					.voice {
						min-width: 120rpx;
						max-width: 350rpx;
						height: 44rpx;
						line-height: 44rpx;
						text-align: center;
						display: flex;
						justify-content: space-between;
						align-items: center;
						i{
							font-size: 40rpx;
							font-weight: 600;
						}
					}
				}
				// 群友
				.other_messgae{
					position: relative;
					top: -10rpx;
				}
				.message_left{
					flex-direction: row;
					.user_name{
						max-width: 200rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						margin-left: 20rpx;
						font-size: 24rpx;
					}
					.message{
						position: relative;
						margin-left: 20rpx;
						&::before{
							content: '';
							width: 0;
							height: 0;
							position: absolute;
							left: -9rpx;
							top: 10rpx;
							border-right: 10rpx solid #95ec69;
							border-top: 10rpx solid transparent;
							border-bottom: 10rpx solid transparent;
							z-index: 999;
						}
					}
				}
				// 本人
				.message_right{
					flex-direction: row-reverse;
					.message{
						position: relative;
						margin-right: 20rpx;
						&::before{
							content: '';
							width: 0;
							height: 0;
							position: absolute;
							right: -9rpx;
							top: 30rpx;
							border-left: 10rpx solid #95ec69;
							border-top: 10rpx solid transparent;
							border-bottom: 10rpx solid transparent;
							z-index: 999;
						}
					}
				}
			}
		}
	}
}
// 工具类
.isActive {
		color: red !important;
	}
</style>
