<template>
	<view class="form_content">
		<view class="input_title">
			<text>{{inputTitle}}</text>
		</view>
		<view class="form">
			<input
				v-if="showPassword"
				:value="inputValue"
				@input="valueChangeHandle"
				class="input_content" 
				type="text" 
				:placeholder="placeholder" 
				:placeholder-style="`${placeholderStyle}`"/>
			<input
				v-else
				:value="inputValue"
				@input="valueChangeHandle"
				class="input_content" 
				type="password" 
				:placeholder="placeholder" 
				:placeholder-style="`${placeholderStyle}`"/>
			<view v-if="showPassIcon">
				<uni-icons
					v-if="showPassword"
					type="eye-slash" 
					size="20"
					@click="showPasswordHandle">
				</uni-icons>
				<uni-icons
					v-else
					type="eye-filled" 
					size="20"
					@click="showPasswordHandle">
				</uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"passwordInput",
		props: {
			value: {
				type: String,
				default: ""
			},
			placeholder: {
				type: String,
				default: "请输入"
			},
			placeholderStyle: {
				type: String,
				default: "color: #aaa;font-weight:400;"
			},
			inputType:{
				type: String,
				default: 'text'
			},
			inputTitle: {
				type: String,
				default: '标题'
			}
		},
		data() {
			return {
				showPassIcon:false,
				showPassword:false,
				inputValue:"",
			};
		},
		watch: {
			inputValue: {
				handler(newVal,oldVal) {
					if(newVal){
						this.showPassIcon = true
					}else{
						this.showPassIcon = false
					}
				}
			}
		},
		created() {
			this.inputValue = this.value
		},
		methods: {
			// 输入框值变化触发
			valueChangeHandle(e){
				const value = e.target.value
				this.inputValue = value
				this.$emit('input',value)
			},
			// 清除密码图标触发
			showPasswordHandle(){
				this.showPassword = !this.showPassword
			}
		}
	}
</script>

<style lang="less" scoped>
.form_content{
	.input_title{
		display: flex;
		align-items: center;
		height: 50rpx;
		font-size: 12px;
	}
	
	.form{
		display: flex;
		align-items: center;
		border-bottom: #aaa 1px solid;
		.input_content{
			width: 100%;
			padding: 10rpx 0;	
		}
	}
}
</style>