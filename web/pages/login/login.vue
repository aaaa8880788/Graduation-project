<template>
	<view class="login_wrapper">
		<view class="login_title animate__animated animate__backInDown">
			<image class="title_image" src="../../static/login/智慧党建.jpg"></image>
		</view>
		<view class="login_content">
			<uni-segmented-control 
				:current="current" 
				:values="items" 
				styleType="text"
				@clickItem="onClickItem" 
				activeColor="#d9080c">
			</uni-segmented-control>
			<view class="show_content">
				<view v-show="current === 0">
					<view class="phone_Login">
						<stringInput 
							v-model="phoneLogin.phone"
							inputTitle="手机号"
							placeholder="请输入手机号">
						</stringInput>
						<passwordInput 
							v-model="phoneLogin.password"
							inputTitle="密码"
							placeholder="请输入密码">
						</passwordInput>
					</view>
				</view>
				<view v-show="current === 1">
					<view class="studentId_Login">
						<stringInput
							v-model="studentIdLogin.id"
							inputTitle="学号"
							placeholder="请输入学号">
						</stringInput>
						<passwordInput
							v-model="studentIdLogin.password"
							inputTitle="密码"
							placeholder="请输入密码">
						</passwordInput>
					</view>
				</view>
				<view v-show="current === 2">
					<view class="cardId_Login">
						<stringInput
							v-model="cardIdLogin.id"
							inputTitle="工号"
							placeholder="请输入工号">
						</stringInput>
						<passwordInput
							v-model="cardIdLogin.password"
							inputTitle="密码"
							placeholder="请输入密码">
						</passwordInput>
					</view>
				</view>
			</view>
			<view class="foot_content">
				<button 
					:disabled="!showLoginBtn"
					type="warn"
					@click="loginBtnHandle">
						登录
				</button>
				<button
					type="default"
					style="margin-top: 20rpx;color: red;"
					@click="registerBtnHandle">
						注册
				</button>
			</view>
		</view>
		<view class="footer">
			<view 
				class="left" 
				@click="findPasswordHandle">
				<text>找回密码</text>
			</view>
			<view class="center">
				|
			</view>
			<view 
				class="right" 
				@click="noticeBtnHandle">
				<text>提示公告</text>
			</view>
		</view>
		<!-- 提示信息 -->
		<uni-popup 
			ref="tipMessageRef" 
			type="message">
			<uni-popup-message 
				:type="popupMessgae.type"
				:message="popupMessgae.message" 
				:duration="popupMessgae.duration">
			</uni-popup-message>
		</uni-popup>
		<uni-popup 
			ref="tipDialogRef" 
			type="dialog">
			<uni-popup-dialog 
				:message="popupDialog.message" 
				:duration="popupDialog.duration" 
				:content="popupDialog.content"
				:before-close="popupDialog.beforeClose" 
				@close="dialogCloseHandle" 
				@confirm="dialogConfirmHandle">
			</uni-popup-dialog>
		</uni-popup>
		<!-- 提示组件 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: ['手机登录', '学号登录', '工号登录'],
				// 当前tab栏
				current: 0,
				// 手机登录
				phoneLogin: {
					phone: '',
					password: ''
				},
				// 学号登录
				studentIdLogin: {
					id: '',
					password: ''
				},
				// 工号登录
				cardIdLogin: {
					id: '',
					password: ''
				},
				// 是否展示可点击登录按钮
				showLoginBtn:false,
				// 提示信息
				popupMessgae:{
					type:'success',
					message:"默认信息",
					duration:2000 ,
				},
				popupDialog:{
					type:'success',
					message:"默认信息",
					content:"默认信息",
					duration:2000,
					beforeClose:true
				},
			};
		},
		watch: {
			current:{
				handler(newVal,oldVal){
					switch (newVal){
						case 0:
							if(/^\d{11}$/.test(this.phoneLogin.phone) && this.phoneLogin.password){
								this.showLoginBtn = true
							}else{
								this.showLoginBtn = false
							}
							break;
						case 1:
							if(/^\d{12}$/.test(this.studentIdLogin.id) && this.studentIdLogin.password){
								this.showLoginBtn = true
							}else{
								this.showLoginBtn = false
							}
							break;
						case 2:
							if(/^\d{12}$/.test(this.cardIdLogin.id) && this.cardIdLogin.password){
								this.showLoginBtn = true
							}else{
								this.showLoginBtn = false
							}
							break;
						default:
							break;
					}
				}
			},
			phoneLogin:{
				handler(newVal,oldVal){
					if(/^\d{11}$/.test(newVal.phone) && newVal.password){
						this.showLoginBtn = true
					}else{
						this.showLoginBtn = false
					}
				},
				deep:true
			},
			studentIdLogin:{
				handler(newVal,oldVal){
					if(/^\d{12}$/.test(newVal.id) && newVal.password){
						this.showLoginBtn = true
					}else{
						this.showLoginBtn = false
					}
				},
				deep:true
			},
			cardIdLogin:{
				handler(newVal,oldVal){
					if(/^\d{12}$/.test(newVal.id) && newVal.password){
						this.showLoginBtn = true
					}else{
						this.showLoginBtn = false
					}
				},
				deep:true
			}
		},
		methods: {
			// tab栏点击触发
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			// 清除按钮点击触发
			clearIconHandle(){
				// 登录类型
				switch (this.current){
					case 0:
						this.phoneLogin.phone = ''
						break;
					case 1:
						this.studentIdLogin.id = ''
						break;
					case 2:
						this.cardIdLogin.id = ''
						break;
					default:
						break;
				}
			},
			// 登录按钮点击触发
			loginBtnHandle(){
				let data
				switch (this.current){
					case 0:
						data = {
							type:'phone',
							phone:this.phoneLogin.phone,
							password:this.phoneLogin.password
						}
						break;
					case 1:
						data = {
							type:'cardId',
							cardId:this.studentIdLogin.id,
							password:this.studentIdLogin.password
						}
						break;
					case 2:
						data = {
							type:'cardId',
							cardId:this.cardIdLogin.id,
							password:this.cardIdLogin.password
						}
						break;
				}
				uni.request({
					url: `http://localhost:3000/web/api/global/userLogin`,
					method: 'POST',
					data: data,
					success: (res) => {
						if(res.data.code === 200){
							const token = res.data.token
							const userId = res.data.userId
							this.$refs.uToast.show({
								type: 'success',
								message: res.data.message,
								icon:false
							},)
							uni.setStorageSync('token',`bearer ${token}`)
							uni.setStorageSync('userId',userId)
							setTimeout(()=>{
								uni.switchTab({
									url:'/pages/home/home'
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
			// 注册按钮点击触发
			registerBtnHandle(){
				uni.navigateTo({
					url:'/pages/register/register'
				})
			},
			// 提示公告按钮点击处理
			noticeBtnHandle(){
				this.popupDialog.content = '欢迎光临~'
				this.$refs.tipDialogRef.open()
			},
			// 对话框关闭按钮点击触发
			dialogCloseHandle(){
				this.$refs.tipDialogRef.close()
			},
			dialogConfirmHandle(){
				this.$refs.tipDialogRef.close()
			},
			// 找回密码按钮点击触发
			findPasswordHandle(){
				console.log('点击了找回密码')
			}
		}
	}
</script>

<style lang="less" scoped>
	.login_wrapper {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		background-color: #fff;
		.login_title {
			margin: 0 auto;
			height: 300rpx;
			width: 100%;
			position: relative;
			.title_image{
				position: absolute;
				top: -50rpx;
				left: 50%;
				transform: translateX(-50%);
			}
		}
		
		.login_content{
			margin: 100rpx 50rpx;
			.show_content{
				height: 250rpx;
				margin-top: 50rpx;
			}
		}
		
		.footer{
			position: fixed;
			left: 0;
			right: 0;
			bottom: 30rpx;
			display: flex;
			justify-content: center;
			.center{
				color: #aaa;
				margin: 0 20rpx;
			}
			.right{
				color: red;
			}
		}
	}
</style>
