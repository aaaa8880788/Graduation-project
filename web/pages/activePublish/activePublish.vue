<template>
	<view class="active_publish">
		<uni-nav-bar
			class="active_publish_nav"
			v-bind="navBar"
			@clickLeft="navLeftHandle">
		</uni-nav-bar >
		<scroll-view 
			class="active_publish_content"
			scroll-y="true" >
			<u--form
				labelPosition="left"
				:model="publishData"
				ref="form1">
				<u-form-item
					label="名称"
					labelWidth="auto"
					prop="publishData.name"
					borderBottom
					ref="item1">
					<u--input
						v-model="publishData.name"
						placeholder="请填写活动名称"
						border="none">
					</u--input>
				</u-form-item>
				<u-form-item
					label="地点"
					prop="publishData.placed"
					labelWidth="auto"
					@click="showPlaceHandle"
					borderBottom
					ref="item2">
					<u--input
						v-model="publishData.placeName"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择活动地点"
						border="none">
					</u--input>
				</u-form-item>
				<u-form-item
					label="开始时间"
					prop="publishData.startTime"
					labelWidth="auto"
					@click="showStartTimeHandle"
					borderBottom
					ref="item2">
					</u-datetime-picker>
					<uni-datetime-picker 
						type="datetime" 
						returnType="date" 
						:border="false"
						:clear-icon="false"
						v-model="publishData.startTime"/>
				</u-form-item>
				<u-form-item
					label="结束时间"
					prop="publishData.endTime"
					labelWidth="auto"
					@click="showEndTimeHandle"
					borderBottom
					ref="item2">
					<uni-datetime-picker
						type="datetime" 
						returnType="date" 
						:border="false"
						:clear-icon="false"
						v-model="publishData.endTime"/>
					</u--input>
				</u-form-item>
				<view class="publish_score">
					<view class="publish_score_title">
						<text>参与活动积分</text>
					</view>
					<u-slider
						min="0" 
						max="50"
						activeColor="#eb5544"
						v-model="publishData.score">
					</u-slider>
					<view class="publish_score_footer">
						<text >{{ publishData.score }}</text>
					</view>
				</view>
				<view class="publish_score">
					<view class="publish_score_title">
						<text>最多参与人数</text>
					</view>
					<u-slider
						min="0" 
						activeColor="#eb5544"
						disabled
						v-model="publishData.volume">
					</u-slider>
					<view class="publish_score_footer">
						<text >{{ publishData.volume }}</text>
					</view>
				</view>
				<u-form-item
					prop="publishData.body"
					ref="item2">
					<u--textarea
						height="180"
						maxlength="270"
						placeholder="请填写活动内容"
						v-model="publishData.body"
						count
					></u--textarea>
				</u-form-item>
			</u--form>
		</scroll-view>
		<view class="active_publish_footer">
			<u-button 
				class="publishBtn"
				shape="circle"
				color="#eb5544"
				text="发布"
				:disabled="publishBtnDisabled"
				@click="publishClickHandle">
			</u-button>
		</view>
		<!-- 提示组件 -->
		<u-action-sheet
			:show="sheetPlace.showSheet"
			:actions="sheetPlace.actions"
			:title="sheetPlace.title"
			@close="sheetPlace.showSheet = false"
			@select="placeSelectHandle">
		</u-action-sheet>
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
					title:'发布活动',
					height:'100rpx',
					backgroundColor:'#eb5544',
					color:'#fff',
				},
				publishData:{
					name:'',
					placeId:'',
					placeName:'',
					startTime:'',
					endTime:'',
					body:'',
					score:0,
					volume:0
				},
				sheetPlace:{
					showSheet:false,
					actions:[],
					title:'请选择活动地点'		
				},
				maxPerson:0,
				publishBtnDisabled:true,
				showStartTimePicker:false,
				showEndTimePicker:false,
			};
		},
		watch:{
			publishData:{
				handler(newValue){
					if(newValue.name && newValue.placeName && newValue.body && newValue.startTime && newValue.endTime){
						this.publishBtnDisabled = false
					}else{
						this.publishBtnDisabled = true
					}
				},
				deep:true
			}
		},
		methods:{
			// 导航栏左侧按钮点击触发
			navLeftHandle(){
				uni.navigateBack()
			},
			showPlaceHandle(){
				this.sheetPlace.showSheet = true; 
				uni.hideKeyboard()
			},
			placeSelectHandle(item){
				this.publishData.placeId = item.id
				this.publishData.placeName = item.name
				this.publishData.volume = item.volume
				this.maxPerson = item.volume
			},
			// 获取活动地点信息
			getPlaceList(){
				uni.request({
					url: `http://localhost:3000/web/api/getPlaceList`,
					method: 'GET',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					success: (res) => {
						if(res.data.code === 200){
							this.sheetPlace.actions = res.data.data
							console.log('placeList---',res.data.data);
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
			// 发布按钮点击触发
			publishClickHandle(){
				const publishData = {
					name: this.publishData.name,
					placeId: this.publishData.placeId,
					body: this.publishData.body,
					startTime: this.publishData.startTime,
					endTime: this.publishData.endTime,
					userId: this.userId,
					score: this.publishData.score,
				}
				uni.request({
					url: `http://localhost:3000/web/api/publishActive`,
					method: 'POST',
					header:{
						Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
					},
					data:{
						...publishData
					},
					success: (res) => {
						if(res.data.code === 200){
							this.$refs.uToast.show({
								type: 'success',
								message: '活动发布成功~',
								icon:false
							})
							setTimeout(() => {
								uni.navigateBack()
							},2000)
						}else if(res.data.code === 401){
							this.$refs.uToast.show({
								type: 'error',
								message: res.data.message,
								icon:false
							})
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
							})
						}
					},
					fail: (err) => {
						console.log('err',err);
					}
				})
			},
			showStartTimeHandle(){
				this.showStartTimePicker = true
			},
			showEndTimeHandle(){
				this.showStartTimePicker = true
			},
			startTimeConfirmHandle(value){
				this.publishData.startTime = value
				this.showStartTimePicker = false
			},
			endTimeConfirmHandle(value){
				this.publishData.endTime = value
				this.showStartTimePicker = false
			},
			startTimeCanceHandle(){
				this.showStartTimePicker = false
			},
			endTimeCanceHandle(){
				this.showEndTimePicker = false
			},
		},
		onLoad() {
			this.userId = uni.getStorageSync('userId')
		},
		onShow(){
			this.getPlaceList()
		}
	}
</script>

<style lang="less" scoped>
.active_publish{
	position: relative;
	height: 100vh;
	width: 100vw;
	background-color: #ffffff;
	overflow: hidden;
	.active_publish_content{
		height: calc(100vh - 202rpx);
		width: 100%;
		box-sizing: border-box;
		padding: 0 30rpx;
		.publish_score{
			position: relative;
			.publish_score_title{
				margin-top: 20rpx;
				font-size: 15px
			}
			.publish_score_footer{
				position: absolute;
				bottom: -10px;
				left: 50%;
				transform: translateX(-50%);
				color: #eb5544;
			}
		}
	}
	.active_publish_footer{
		position: absolute;
		bottom:0;
		left: 0;
		right: 0;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
	}
}
</style>
