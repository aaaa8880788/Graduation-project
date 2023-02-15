<template>
	<view class="my_info">
		<view class="my_info_nav">
			<uni-nav-bar 
				v-bind="navBar"
				@clickLeft="navLeftHandle"/>
		</view>
		<scroll-view 
			class="my_info_form"
			scroll-y="true">
			<u--form
				labelPosition="left"
				:model="myInfoData"
				ref="form1">
				<u-form-item
					label="头像"
					prop="myInfoData.avatar"
					borderBottom
					ref="item1">
						<avatarUpload v-model="myInfoData.avatar"></avatarUpload>
					</u--input>
				</u-form-item>
				<template v-if="myInfoData.type === 0">
					<u-form-item
						label="学号"
						prop="myInfoData.cardId"
						borderBottom
						ref="item2"
						@click="disabledItemClickHandle">
						<u--input
							v-model="myInfoData.cardId"
							readonly
							border="none">
						</u--input>
					</u-form-item>
				</template>
				<template v-else>
					<u-form-item
						label="工号"
						prop="myInfoData.cardId"
						borderBottom
						ref="item2"
						@click="disabledItemClickHandle">
						<u--input
							v-model="myInfoData.cardId"
							readonly
							border="none">
						</u--input>
					</u-form-item>
				</template>
				<u-form-item
					label="姓名"
					prop="myInfoData.name"
					borderBottom
					ref="item2"
					@click="disabledItemClickHandle">
					<u--input
						v-model="myInfoData.name"
						readonly
						border="none">
					</u--input>
				</u-form-item>
				<u-form-item
					label="手机"
					prop="myInfoData.phone"
					borderBottom
					ref="item2"
					@click="disabledItemClickHandle">
					<u--input
						v-model="myInfoData.phone"
						readonly
						border="none">
					</u--input>
				</u-form-item>
				<u-form-item
					label="身份"
					prop="myInfoData.typeData"
					borderBottom
					ref="item2"
					@click="disabledItemClickHandle">
					<u--input
						v-model="myInfoData.typeData"
						readonly
						border="none">
					</u--input>
				</u-form-item>
				<u-form-item
					label="组织"
					prop="myInfoData.organizationData.name"
					borderBottom
					ref="item2"
					@click="disabledItemClickHandle">
					<u--input
						v-if="myInfoData.organizationData"
						v-model="myInfoData.organizationData.name"
						readonly
						border="none">
					</u--input>
				</u-form-item>
				<u-form-item
					label="学校"
					prop="myInfoData.schoolData.name"
					borderBottom
					ref="item2"
					@click="disabledItemClickHandle">
					<u--input
						v-if="myInfoData.schoolData"
						v-model="myInfoData.schoolData.name"
						readonly
						border="none">
					</u--input>
				</u-form-item>
				<!-- 学生才显示 -->
				<template v-if="myInfoData.type === 0">
					<u-form-item
						label="专业"
						prop="myInfoData.classData.name"
						borderBottom
						ref="item2"
						@click="disabledItemClickHandle">
						<u--input
							v-if="myInfoData.classData"
							v-model="myInfoData.classData.name"
							readonly
							border="none">
						</u--input>
					</u-form-item>
					<u-form-item
						label="班级"
						prop="myInfoData.className"
						borderBottom
						ref="item2"
						@click="disabledItemClickHandle">
						<u--input
							v-model="myInfoData.className"
							readonly
							border="none">
						</u--input>
					</u-form-item>
				</template>
				<u-form-item
					label="性别"
					prop="myInfoData.sex"
					borderBottom
					@click="showSexHandle"
					ref="item3">
					<u--input
						v-model="myInfoData.sex"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择性别"
						border="none">
					</u--input>
					<u-icon
						slot="right"
						name="arrow-right">
					</u-icon>
				</u-form-item>
				<u-form-item
					label="生日"
					prop="myInfoData.birthday"
					borderBottom
					@click="showBirthdayHandle"
					ref="item1">
					<u--input
						v-model="myInfoData.birthday"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择生日"
						border="none">
					</u--input>
					<u-icon
						slot="right"
						name="arrow-right">
					</u-icon>
				</u-form-item>
				<u-form-item
					label="地址"
					prop="myInfoData.address"
					borderBottom
					ref="item2">
					<u--textarea
						placeholder="请填写详细收货地址"
						v-model="myInfoData.address"
						count
					></u--textarea>
				</u-form-item>
			</u--form>
			<view 
				class="postion"
				style="height: 20rpx;">
			</view>
		</scroll-view>
		<view class="footer">
			<u-button
				class="footer_button"
				type="primary"
				text="保存信息"
				@click="saveClickHandle">
			</u-button>
			<u-button 
				class="footer_button"
				type="error"
				text="退出登录"
				@click="logoutClickHandle">
			</u-button>
		</view>
		<!-- 提示组件 -->
		<u-toast ref="uToast"></u-toast>
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
		<u-toast ref="uToast"></u-toast>
		<u-action-sheet
			:show="showSex"
			:actions="actions"
			title="请选择性别"
			@close="showSex = false"
			@select="sexSelect">
		</u-action-sheet>
		<u-datetime-picker
			:show="showBirthday"
			:value="birthday"
			mode="date"
			closeOnClickOverlay
			@confirm="birthdayConfirm"
			@cancel="birthdayClose"
			@close="birthdayClose"
		></u-datetime-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navBar:{
					shadow:true,
					leftIcon:'left',
					leftText:'返回',
					title:'个人信息',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff'
				},
				popupDialog:{
					type:'success',
					message:"默认信息",
					content:"默认信息",
					duration:2000,
					beforeClose:true
				},
				myInfoData:{
					classData:{},
					facultyData:{},
					organizationData:{},
					schoolData:{},
				},
				userId:'',
				showSex: false,
				actions: [{ name: '男' },{ name: '女' }],
				showBirthday: false,
				birthday: Number(new Date()),
			};
		},
		methods:{
			disabledItemClickHandle(){
				this.$refs.uToast.show({
					type: 'error',
					message: '无法修改，请联系管理员~',
					icon:false,
					duration:1000
				},)
			},
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
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
			// 对话框关闭按钮点击触发
			dialogCloseHandle(){
				this.$refs.tipDialogRef.close()
			},
			dialogConfirmHandle(){
				this.$refs.tipDialogRef.close()
			},
			sexSelect(e) {
				this.myInfoData.sex = e.name
			},
			showSexHandle(){
				this.showSex = true; 
				uni.hideKeyboard()
			},
			birthdayConfirm(e) {
				this.showBirthday = false
				this.myInfoData.birthday = uni.$u.timeFormat(e.value, 'yyyy-mm-dd')
			},
			birthdayClose() {
				this.showBirthday = false
			},
			showBirthdayHandle(){
				this.showBirthday = true; 
				uni.hideKeyboard()
			},
			// 点击保存触发
			saveClickHandle(){
				console.log('点击了保存',this.myInfoData);
				uni.request({
					url: `http://localhost:3000/web/api/updateUserInfo?id=${this.userId}`,
					method: 'POST',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						avatar:this.myInfoData.avatar,
						sex:this.myInfoData.sex,
						birthday:this.myInfoData.birthday,
						address:this.myInfoData.address,
					},
					success: (res) => {
						if(res.data.code === 200){
							this.$refs.uToast.show({
								type: 'success',
								message: '保存成功~',
								icon:false
							})
							this.getUserInfo()
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
								message: '保存失败~',
								icon:false
							},)
						}
					},
					fail: (err) => {
						console.log('err',err);
					}
				})
			},
			// 点击退出登录触发
			logoutClickHandle(){
				uni.clearStorage();
				this.$refs.uToast.show({
					type: 'success',
					message: '退出登录成功~',
					icon:false
				},)
				setTimeout(()=>{
					uni.redirectTo({
						url:'/pages/login/login'
					})
				},2000)
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync('userId')
		},
		onShow(){
			this.getUserInfo()
		}
	}
</script>

<style lang="less">
.my_info{
	width: 100vw;
	height: 100vh;
	background-color: #fff;
	.my_info_form{
		height: calc(100vh - 282rpx);
		box-sizing: border-box;
		padding: 0 30rpx;
	}
	.footer{
		height: 180rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
}
</style>
