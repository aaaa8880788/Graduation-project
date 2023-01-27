<template>
	<view class="register_wrapper">
		<view class="register_nav">
			<uni-nav-bar 
				v-bind="navBar"
				@clickLeft="navLeftHandle"/>
		</view>
		<scroll-view 
			class="register_content" 
			scroll-y="true" >
			<view class="register_title animate__animated animate__backInDown">
				<image class="title_image" src="../../static/login/智慧党建.jpg"></image>
			</view>
			<view class="show_content">
				<view class="register_form">
					<selectInput
						v-model="register.type"
						inputTitle="类型"
						placeholder="请选择类型"
						:listData="typeData">
					</selectInput>
					<stringInput
						v-model="register.name"
						inputTitle="姓名"
						placeholder="请输入姓名">
					</stringInput>
					<stringInput 
						v-model="register.cardId"
						inputTitle="学号/工号"
						placeholder="请输入学号/工号">
					</stringInput>
					<stringInput
						v-model="register.phone"
						inputTitle="手机号"
						placeholder="请输入手机号">
					</stringInput>
					<passwordInput
						v-model="register.password"
						inputTitle="密码"
						placeholder="请输入密码">
					</passwordInput>
					<selectInput
						v-model="register.schoolId"
						inputTitle="学校"
						placeholder="请选择学校"
						:listData="schoolData">
					</selectInput>
					<selectInput
						v-model="register.facultyId"
						inputTitle="学院"
						placeholder="请选择学院"
						:listData="facultyData">
					</selectInput>
					<!-- 如果是教师着不需要专业跟班级 -->
					<template v-if="register.type === 0">
						<selectInput
							v-model="register.classId"
							inputTitle="专业"
							placeholder="请选择专业"
							:listData="classData"
							@clear="classIdClearHandle"
							@change="classIdChangeHandle">
						</selectInput>
						<selectInput
							ref="classNameSelect"
							v-model="register.className"
							inputTitle="班级"
							placeholder="请选择班级"
							:listData="classNameData">
						</selectInput>
					</template>
				</view>
			</view>
		</scroll-view>
		<view class="footer">
			<button
				type="warn"
				@click="registerBtnHandle">
					注册
			</button>
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
					leftText:'返回',
					title:'注册',
					height:'100rpx'
				},
				register:{
					type:'',
					name: '',
					cardId:'',
					phone:'',
					password:'',
					facultyId:'',
					schoolId:'',
					classId:'',
					className:''
				},
				rulesConfig:{
					type:	{
						type: 'error',
						message: "请选择类型",
						icon:false
					},
					name: {
						type: 'error',
						message: "请输入姓名",
						icon:false
					},
					password: {
						type: 'error',
						message: "请输入密码",
						icon:false
					},
					cardId: {
						type: 'error',
						message: "请输入学号/工号",
						icon:false
					},
					phone: {
						type: 'error',
						message: "请输入手机号",
						icon:false
					},
					facultyId: {
						type: 'error',
						message: "请选择学院",
						icon:false
					},
					schoolId: {
						type: 'error',
						message: "请选择学校",
						icon:false
					},
					classId: {
						type: 'error',
						message: "请选择专业",
						icon:false
					},
					className: {
						type: 'error',
						message: "请选择班级",
						icon:false
					},
				},
				// 所选类型数据
				typeData: [
					{
						name: "学生",
						value: 0
					},
					{
						name: "教师",
						value: 1
					}
				],
				facultyData: [],
				schoolData: [],
				classData: [],
				classNameData: []
			}
		},
		methods: {
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.redirectTo({
					url:'/pages/login/login'
				})
			},
			// 获取学院列表
			getFacultiesList(){
				uni.request({
					url: `http://localhost:3000/web/api/global/getFacultiesList`,
					method: 'GET',
					success: (res) => {
						if(res.data.code === 200){
							this.facultyData = res.data.data
						}
					},
					fail: (err) => {
						console.log('err',err);
					}
				})
			},
			getSchoolsList(){
				uni.request({
					url: `http://localhost:3000/web/api/global/getSchoolsList`,
					method: 'GET',
					success: (res) => {
						if(res.data.code === 200){
							this.schoolData = res.data.data
						}
					},
					fail: (err) => {
						console.log('err',err);
					}
				})
			},
			getClassesList(){
				uni.request({
					url: `http://localhost:3000/web/api/global/getClassesList`,
					method: 'GET',
					success: (res) => {
						if(res.data.code === 200){
							this.classData = res.data.data
						}
					},
					fail: (err) => {
						console.log('err',err);
					}
				})
			},
			// 专业选中处理
			classIdChangeHandle(val){
				const classNameData = val.classData.map(item => {
					return {
						name:item,
						value:item
					}
				})
				this.classNameData = classNameData
			},
			// 专业删除处理
			classIdClearHandle(){
				this.classNameData = []
				this.$refs.classNameSelect.clearIconHandle()
			},
			// 点击了注册按钮
			registerBtnHandle(){
				for(const key in this.register){
					if(this.register.type === 1 &&
						['classId','className'].includes(key)
					){
						continue
					}
					if(this.register[key] === ''){
						this.$refs.uToast.show({
							...this.rulesConfig[key]
						})
						return
					}
				}
				uni.request({
					url: `http://localhost:3000/web/api/global/userRegister`,
					method: 'POST',
					data:this.register,
					success: (res) => {
						if(res.data.code === 200){
							this.$refs.uToast.show({
								type: 'success',
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
		created() {
			// 获取学院列表
			this.getFacultiesList()
			// 获取学校列表
			this.getSchoolsList()
			// 获取专业班级列表
			this.getClassesList()
		}
	}
</script>

<style lang="less" scoped>
.register_wrapper {
	width: 100vw;
	height: 100vh;
	box-sizing: border-box;
	background-color: #fff;
	.register_nav{
		position: relative;
		z-index: 100;
	}
	.register_content{
		width: 100%;
		height: calc( 100vh - 230rpx );
		.register_title {
			margin: 0 auto;
			height: 360rpx;
			width: 100%;
			position: relative;
			.title_image{
				position: absolute;
				top: -50rpx;
				left: 50%;
				transform: translateX(-50%);
				z-index: -1;
			}
		}
		.show_content{
			padding: 60rpx 50rpx 0 50rpx;
		}
	}
	.footer{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}
}
</style>
