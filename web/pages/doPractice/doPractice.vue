<template>
	<view class="do_practice">
		<view class="do_practice_nav">
			<uni-nav-bar
				v-bind="navBar"
				@clickLeft="navLeftHandle">
				<template
				 v-if="currentAnswer.length"
				 #right="scoped">
					<view 
						class="confirm_button"
						@click="confirmClickHandle">
						<text>{{ navRightText }}</text>
					</view>
				</template>
			</uni-nav-bar>
		</view>
		<view
			v-if="answerDone"
			class="answer_done">
			<view class="answer_done_header">
				<view class="answer_done_header_title">
					<text>本次答对题目数</text>
				</view>
				<view class="answer_done_header_count">
					<text>{{ currentScore }}</text>
				</view>
			</view>
			<view class="answer_done_content">
				<view class="answer_done_center">
					<view class="answer_done_center_item">
						<text>正确率：</text>
						<text>{{ currentScore / 0.05 }}%</text>
					</view>
					<view class="answer_done_center_item">
						<text>用时：</text>
						<text>{{ transformDate((finallyDate-initDate),'HH:mm:ss') }}</text>
					</view>
					<view class="answer_done_center_item">
						<text>错题数：</text>
						<text>{{ 5 - currentScore }}</text>
					</view>
					<view class="answer_done_center_item">
						<text>积分：</text>
						<text>+{{ currentScore }}</text>
					</view>
				</view>
				<view class="answer_done_footer">
					<view 
						class="answer_done_receive_button"
						@click="receiveBtnClickHandle">
						<text>领取积分</text>
					</view>
				</view>
			</view>
		</view>
		<scroll-view 
			v-else
			class="practice_wrapper" 
			scroll-y="true">
			<view 
				v-if="practiceList.length"
				class="practice_item">
				<view class="practice_header">
					<view class="practice_header_left">
						<text>{{ typeTransform(practiceList[currentPractice].type) }}</text>
					</view>
					<view class="practice_header_right">
						<text>{{ currentPractice + 1 }}</text>
						<text>/</text>
						<text>5</text>
					</view>
				</view>
				<view class="practice_content">
					<view class="practice_title">
						<text>{{ practiceList[currentPractice].content }}</text>
					</view>
					<template v-if="isAnswerError">
						<view
							class="parctice_options"
							:class="{'answer_error': isActive(item)}"
							v-for="item,index in practiceList[currentPractice].options"
							:key="item.id">
							<uni-icons 
								v-if="isActive(item)"
								type="clear" 
								size="20"
								color="#e05959">
							</uni-icons>
							<text v-else>{{ numberTransform(index) }}</text>
							<text>{{ item }}</text>
						</view>
					</template>
					<template v-else-if="isAnswerRight">
						<view
							class="parctice_options"
							:class="{'answer_success': isActive(item)}"
							v-for="item,index in practiceList[currentPractice].options"
							:key="item.id">
							<uni-icons 
								v-if="isActive(item)"
								type="checkbox-filled" 
								size="20"
								color="#66bc7d">
							</uni-icons>
							<text v-else>{{ numberTransform(index) }}</text>
							<text>{{ item }}</text>
						</view>
					</template>
					<template v-else>
						<view
							class="parctice_options"
							:class="{'answer_active': isActive(item)}"
							v-for="item,index in practiceList[currentPractice].options"
							:key="item.id"
							@click="answerClickHandle(item)">
							<text>{{ numberTransform(index) }}</text>
							<text>{{ item }}</text>
						</view>
					</template>
				</view>
			</view>
			<view
				v-if="isAnswerError"
				class="practice_item"
				style="margin-top: 20rpx;">
				<view class="practice_header">
					<view class="practice_header_left">
						<text>答案解析</text>
					</view>
				</view>
				<view class="practice_content">
					<view class="practice_title">
						<template v-for="item in practiceList[currentPractice].answer">
							<text>{{ rightAnswer(item) }}</text>
						</template>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 提示组件 -->
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
	</view>
</template>

<script>
	import { formateUtcString } from '../../utils/dataFormate.js'
	export default {
		data() {
			return {
				navBar:{
					leftIcon:'left',
					height:'100rpx',
					backgroundColor:'#f6f6f6',
				},
				popupDialog:{
					type:'success',
					message:"默认信息",
					content:"默认信息",
					duration:2000,
					beforeClose:true
				},
				navRightText:'确定',
				practiceList:[],
				currentPractice:0,
				currentScore:0,
				isAnswerError:false,
				isAnswerRight:false,
				currentAnswer:[],
				answerDone:false,
				initDate:0,
				finallyDate:0,
				isReceiveBtnDisabled:false,
				userId:''
			};
		},
		methods:{
			// 领取积分按钮点击触发
			receiveBtnClickHandle(){
				if(this.currentScore === 0){
					this.$refs.uToast.show({
						type: 'warning',
						message: '暂无积分可领取~',
						icon:false
					},)
				}else{
					uni.request({
						url: `http://localhost:3000/web/api/updateUserInfo?id=${this.userId}`,
						method: 'POST',
						header:{
							Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
						},
						data:{
							score:this.currentScore
						},
						success: (res) => {
							if(res.data.code === 200){
								this.$refs.uToast.show({
									type: 'success',
									message: '领取成功~',
									icon:false
								},)
								setTimeout(()=>{
									uni.navigateBack()
								},2000)
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
			transformDate(date,format){
				return formateUtcString(date,format)
			},
			isActive(item){
				const index = this.currentAnswer.findIndex(answer => answer === item)
				if(index === -1){
					return false
				}else{
					return true
				}
			},
			rightAnswer(item){
				const index = this.practiceList[this.currentPractice].options.findIndex(option => option === item)
				return this.numberTransform(index)
			},
			navLeftHandle(){
				if(!this.answerDone){
					this.popupDialog.content = '确定要退出答题？\n 退出后作答历史将不会保存'
					this.$refs.tipDialogRef.open()
				}else{
					this.popupDialog.content = '确定要退出结算页面？\n 请确保积分领取成功'
					this.$refs.tipDialogRef.open()
				}
			},
			// 对话框关闭按钮点击触发
			dialogCloseHandle(){
				this.$refs.tipDialogRef.close()
			},
			dialogConfirmHandle(){
				uni.navigateBack()
				this.$refs.tipDialogRef.close()
			},
			getPracticeList(){
				uni.request({
					url: `http://localhost:3000/web/api/getPracticeList`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					success: (res) => {
						if(res.data.code === 200){
							this.practiceList = res.data.data
							console.log('practiceList',this.practiceList)
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
			confirmClickHandle(){
				switch (this.navRightText){
					case '确定':
						let isRight = true
						for(const item of this.practiceList[this.currentPractice].answer){
							const index = this.currentAnswer.findIndex(answer => answer === item)
							if(index === -1){
								isRight = false
								break
							}
						}
						if(isRight){
							this.isAnswerRight = true
							this.currentScore += 1
						}else{
							this.isAnswerError = true
						}
						if(this.currentPractice === 4){
							this.navRightText = '结算'
						}else{
							this.navRightText = '下一题'
						}
						break;
					case '下一题':
						this.isAnswerRight = false
						this.isAnswerError = false
						this.navRightText = '确定'
						this.currentPractice += 1
						this.currentAnswer = []
						break;
					case '结算':
						console.log('恭喜你完成答题，获得积分：',this.currentScore);
						this.$nextTick(()=>{
							this.answerDone = true
						})
						this.currentAnswer = []
						this.finallyDate = new Date()
						break;
				}
			},
			typeTransform(type){
				if(type === 0){
					return '单选题'
				}else{
					return '多选题'
				}
			},
			numberTransform(index){
				let str = ''
				switch (index){
					case 0:
						str = 'A'
						break;
					case 1:
						str = 'B'
						break;
					case 2:
						str = 'C'
						break;
					case 3:
						str = 'D'
						break;
				}
				return str
			},
			answerClickHandle(item){
				const index = this.currentAnswer.findIndex(answer => answer === item)
				const length = this.currentAnswer.length
				if(this.practiceList[this.currentPractice].type === 0){
					// 单选
					if(index === -1){
						if(length !== 0){
							this.currentAnswer.pop()
						}
						this.currentAnswer.push(item)
					}
				}else{
					// 多选
					if(index === -1){
						this.currentAnswer.push(item)
					}else{
						if(length !== 1){
							this.currentAnswer.splice(index,1)
						}
					}
				}
			}
		},
		onLoad() {
			this.getPracticeList()
			this.initDate = new Date()
			this.userId = uni.getStorageSync('userId')
		}
	}
</script>

<style lang="less" scoped>
.do_practice{
	height: 100vh;
	width: 100vw;
	background-color: #f6f6f6;
	box-sizing: border-box;
	// 答题完成样式
	.answer_done{
		margin: 50rpx 20rpx;
		background-color: #fff;
		box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
		border-radius: 5px;
		overflow: hidden;
		.answer_done_header{
			padding: 20rpx;
			color: #fff;
			background-color: #bda38a;
			.answer_done_header_title{
				font-size: 35rpx;
			}
			.answer_done_header_count{
				margin: 30rpx 0;
				font-size: 80rpx;
			}
		}
		.answer_done_content{
			padding: 30rpx;
			.answer_done_center{
				padding: 50rpx 0;
				display: flex;
				flex-wrap: wrap;
				.answer_done_center_item{
					height: 80rpx;
					width: 50%;
					color: #646464;
				}
			}
			.answer_done_footer{
				margin-top: 30rpx;
				color: #fff;
				background-color: #b79d84;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				border-radius: 5rpx;
			}
		}
	}
	.practice_wrapper{
		height: calc(100vh - 102rpx);
		box-sizing: border-box;
		padding-top: 20rpx;
		.practice_item{
			margin: 0 20rpx;
			background-color: #fff;
			box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
			border-radius: 5px;
			overflow: hidden;
			.practice_header{
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #ccc;
				padding: 0 30rpx;
				.practice_header_left{
					border-left: 5px solid #b29e84;
					padding-left: 10rpx;
					font-weight: 700;
					font-size: 35rpx;
				}
				.practice_header_right{
					color: #a4a3a8;
					text:nth-child(1){
						color: #000;
						font-weight: 700;
						font-size: 50rpx;
					}
				}
			}
			.practice_content{
				padding: 40rpx 30rpx;
				.practice_title{
					font-weight: 700;
					font-size: 30rpx;
					line-height: 55rpx;
					margin-bottom: 50rpx;
				}
				.parctice_options{
					background-color: #f3f4f5;
					color: #797979;
					border: 1px solid #dddddd;
					border-radius: 10rpx;
					margin-bottom: 15rpx;
					padding: 10rpx 30rpx;
					min-height: 50rpx;
					line-height: 50rpx;
					display: flex;
					align-items: center;
					text:nth-child(1){
						margin-right: 10rpx;
					}
				}
			}
		}
	}
}
// 导航栏确定按钮
.confirm_button{
	background-color: #b4a087;
	color: #f6f6f6;
	border-radius: 5rpx;
	width: 100%;
	text-align: center;
	padding: 10rpx 0;
}
// 选中答案样式
.answer_active{
	color: #afa086 !important;
	border: 1px solid #b4aa95 !important;
}
// 错误答案样式
.answer_error{
	border-color: #ffe9e9 !important;
	background-color: #ffe9e9 !important;
	color: #e35352 !important;
}
// 正确样式
.answer_success{
	border-color: #e6f0eb !important;
	background-color: #e6f0eb !important;
	color: #66bc7d !important;
}
// 对话框样式
.uni-popup-dialog{
		text-align: center;
}
</style>
