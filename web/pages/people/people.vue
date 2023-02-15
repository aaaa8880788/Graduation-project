<template>
	<view class="people">
		<uni-nav-bar v-bind="navBar"/>
		<scroll-view 
			class="people_scroll"
			scroll-y="true" >
			<view class="user_list">
				<view class="user_title">
					<text>好友</text>
				</view>
				<template v-if="userList.length">
					<view 
						class="user_item" 
						v-for="(item,index) in userList"
						:key="item.id"
						@click="friendItemClick(item.friendId)">
						<view class="user_avatar">
							<image
								v-if="item.friendData.avatar"
								class="user_avatar_image"
								:src="item.friendData.avatar"></image>
							<view 
								v-else
								class="user_avatar_default">
								<text>默</text>
							</view>
						</view>
						<view class="user_info">
							<view class="user_name">
								<text>{{ item.friendData.name }}</text>
							</view>
							<view class="user_type">
								<text v-if="item.friendData.type == 0">学生</text>
								<text v-else>教师</text>
							</view>
						</view>
					</view>
				</template>
				<template v-else>
					<u-empty text="暂无好友" mode="list"></u-empty>
				</template>
			</view>
			<view class="group_list">
				<view class="group_title">
					<text>群组</text>
				</view>
				<template v-if="groupList.length">
					<view 
						class="group_item" 
						v-for="(item,index) in groupList"
						:key="item.id"
						@click="groupItemClick(item)">
						<view class="group_avatar">
							<image
								v-if="item.image"
								class="group_avatar_image"
								:src="item.image"></image>
							<view 
								v-else
								class="group_avatar_default">
								<text>默</text>
							</view>
						</view>
						<view class="group_info">
							<view class="group_name">
								<text>{{ item.name }}</text>
							</view>
						</view>
					</view>
				</template>
				<template v-else>
					<u-empty text="暂无群组" mode="list"></u-empty>
				</template>
			</view>
		</scroll-view>
		<!-- 提示组件 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navBar:{
					shadow:true,
					title:'通讯录',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff'
				},
				userId:'',
				userList:[],
				groupList:[]
			};
		},
		methods:{
			// 获取好友列表
			getFriendList(){
				uni.request({
					url: `http://localhost:3000/web/api/getFriendList`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						id:this.userId
					},
					success: (res) => {
						if(res.data.code === 200){
							this.userList = res.data.data
							console.log('userList---',this.userList);
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
			// 获取群列表
			getGroupList(){
				uni.request({
					url: `http://localhost:3000/web/api/getGroupList`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						id:this.userId
					},
					success: (res) => {
						if(res.data.code === 200){
							this.groupList = res.data.data
							console.log('groupList---',this.groupList);
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
			// 用户列表点击
			friendItemClick(id){
				uni.navigateTo({
					url:`/pages/chatUserInfo/chatUserInfo?id=${id}`
				})
			},
			// 群列表点击
			groupItemClick(item){
				uni.request({
					url: `http://localhost:3000/web/api/addChatMessage`,
					method: 'POST',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						userId:this.userId,
						targetId:item.id,
						type:0
					},
					success: (res) => {
						if(res.data.code === 200){
							uni.navigateTo({
								url:`/pages/worldRoom/worldRoom?groupId=${item.id}&name=${item.name}`
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
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync('userId')
		},
		onShow(){
			this.getFriendList()
			this.getGroupList()
		}
	}
</script>

<style lang="less" scoped>
.people{
	background-color: #fff;
	.people_scroll{
		height: calc(100vh - 202rpx);
		box-sizing: border-box;
		padding: 0 30rpx;
		.user_list{
			padding: 20rpx 0;
			.user_title{
				font-weight: 700;
				font-size: 40rpx;
				margin-bottom: 30rpx;
			}
			.user_item{
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				display: flex;
				margin: 10rpx 0;
				box-sizing: border-box;
				.user_avatar{
					height: 100rpx;
					width: 100rpx;
					.user_avatar_default{
						background-color: #c1c1c1;
						border-radius: 10rpx;
					}
					.user_avatar_image{
						height: 100rpx;
						width: 100rpx;
						border-radius: 10rpx;
					}
				}
				.user_info{
					flex: 1;
					box-sizing: border-box;
					padding-left: 30rpx;
					text-align: left;
					display: flex;
					justify-content: space-between;
					.user_type{
						color: #c1c1c1;
						font-size: 24rpx;
					}
				}
			}
		}
		.group_list{
			padding: 20rpx 0;
			.group_title{
				font-weight: 700;
				font-size: 40rpx;
				margin-bottom: 30rpx;
			}
			.group_item{
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				display: flex;
				margin: 10rpx 0;
				box-sizing: border-box;
				.group_avatar{
					height: 100rpx;
					width: 100rpx;
					.group_avatar_default{
						background-color: #c1c1c1;
						border-radius: 10rpx;
					}
					.group_avatar_image{
						height: 100rpx;
						width: 100rpx;
						border-radius: 10rpx;
					}
				}
				.group_info{
					box-sizing: border-box;
					padding-left: 30rpx;
					text-align: left;
					flex: 1;
					display: flex;
					justify-content: space-between;
					.group_type{
						color: #c1c1c1;
						font-size: 24rpx;
					}
				}
			}
		}
	}
}
</style>
