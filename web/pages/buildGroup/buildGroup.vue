<template>
	<view class="build_group">
		<uni-nav-bar
			v-bind="navBar"
			@clickLeft="navLeftHandle"/>
		<view class="build_group_center">
			<view class="image_upload">
				<uni-file-picker
					ref="uUpload"
					v-bind="uploadConfig">
				</uni-file-picker>
			</view>
			<view class="group_name">
				<u-input 
					v-model="content" 
					v-bind="inputConfig"/>
			</view>
		</view>
		<view class="build_group_content">
			<view class="title">
				<text>用户</text>
			</view>
			<scroll-view 
				class="scroll_view"
				scroll-y="true" 
				v-if="userList.length">
				<view
					class="user_item"
					v-for="(item,index) in userList"
					:key="item.id"
					@click="itemClickHandle(item)">
					<view class="user_item_left">
						<u-icon
							v-if="isSelect(item.friendId)"
							name="checkmark-circle-fill"
							size="20"
							color="#ffe431">
						</u-icon>
						<u-icon
							v-else
							name="checkmark-circle"
							size="20"
							color="#ffe431">
						</u-icon>
					</view>
					<view class="user_item_right">
						<image 
							v-if="item.friendData.avatar"
							class="user_avatar"
							:src="item.friendData.avatar"></image>
						<view
							v-else
							class="user_avatar">
							<text>默认</text>
						</view>
						<view class="user_info">
							<view class="user_name">
								<text>{{ item.friendData.name }}</text>
							</view>
							<view class="user_indentify">
								<text>{{ getIdentity(item.friendData.type) }}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="footer">
			<u-button 
				v-if="isAllowCreate"
				type='primary'
				shape='circle'>
				创建
			</u-button>
			<u-button
				v-else
				type='primary'
				shape='circle'
				:disabled="true">
				创建
			</u-button>
		</view>
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
					leftIcon:'left',
					leftText:'取消',
					title:'创建群聊',
					height:'100rpx',
				},
				uploadConfig:{
					fileMediatype:"image",
					limit:"1",
					disablePreview:true,
					imageStyles:{
						border: false,
						width:'80',
						height:'80',
						margin:'0'
					}
				},
				inputConfig:{
					border:'false',
					maxCount:1,
					inputAlign:'center',
					placeholder:'请输入群名称'
				},
				userId:'',
				content:'',
				userList:[],
				fileList:[],
				selectUserList:[],
			};
		},
		computed:{
			isSelect(){
				return function(userId){
					return this.selectUserList.some(item => item == userId)
				}
			},
			isAllowCreate(){
				if(!this.content || !this.selectUserList.length){
					return false
				}else{
					return true
				}
			}
		},
		methods:{
			beforeUpload(index, list) {
				console.log('index--',index);
				console.log('list--',list);
			},
			onSuccessHandle(index){
				console.log(index);
			},
			onErrorHandle(err){
				console.log(err);
			},
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
			itemClickHandle(item){
				const userIndex = this.selectUserList.findIndex(userId => item.friendId == userId)
				if(userIndex !== -1){
					this.selectUserList.splice(userIndex,1)
				}else{
					this.selectUserList.push(item.friendId)
				}
			},
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
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
		},
		onLoad(options) {
			this.userId = uni.getStorageSync('userId')
		},
		onShow() {
			this.getFriendList()
		}
	}
</script>

<style lang="less" scoped>
.build_group{
	width: 100vw;
	height: 100vh;
	background-color: #fff;
	.build_group_center{
		height: 400rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 30rpx;
		.image_upload{
			width: 160rpx;
			height: 160rpx;
			margin-bottom: 50rpx;
			background-color: #ffe431;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 20rpx;
			.add_button{
				position: absolute;
				right: -20rpx;
				width: 160rpx;
				height: 160rpx;
				display: flex;
				align-items: center;
			}
		}
		.group_name{
			width: 100%;
			background-color: #e5e5e6;
			border-radius: 40rpx;
		}
	}
	.build_group_content{
		height: calc(100vh - 400rpx - 240rpx);
		box-sizing: border-box;
		padding: 0 30rpx;
		.title{
			font-size: 50rpx;
			font-weight: 700;
			height: 80rpx;
		}
		.scroll_view{
			height: calc(100vh - 400rpx - 240rpx - 80rpx);
			.user_item{
				display: flex;
				align-items: center;
				height: 100rpx;
				.user_item_left{
					width: 60rpx;
				}
				.user_item_right{
					flex: 1;
					display: flex;
					height: 80rpx;
					line-height: 80rpx;
					.user_avatar{
						width: 80rpx;
						height: 80rpx;
						border-radius: 20rpx;
						background-color: #ffe431;
						line-height: 80rpx;
						text-align: center;
					}
					.user_info{
						flex: 1;
						display: flex;
						justify-content: space-between;
						.user_name{
							margin-left: 20rpx;
						}
						.user_indentify{
							color: #ababab;
							font-size: 24rpx;
						}
					}
				}
			}
		}
	}
	.footer{
		margin: 0 20rpx;
		position: fixed;
		bottom: 30rpx;
		left: 0;
		right: 0;
	}
}
.active_select{
	color: red;
}

</style>
<style>

</style>