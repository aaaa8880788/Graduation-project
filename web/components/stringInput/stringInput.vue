<template>
	<view class="form_content">
		<view class="input_title">
			<text>{{inputTitle}}</text>
		</view>
		<view class="form">
			<input
				class="input_content" 
				:value="inputValue"
				@input="valueChangeHandle"
				:type="inputType" 
				:placeholder="placeholder" 
				:placeholder-style="`${placeholderStyle}`"/>
			<uni-icons 
				v-if="showClearIcon"
				type="close" 
				size="20"
				@click="clearIconHandle">
			</uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		name:"stringInput",
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
				showClearIcon:false,
				inputValue:""
			};
		},
		watch: {
			inputValue: {
				handler(newVal,oldVal) {
					if(newVal){
						this.showClearIcon = true
					}else{
						this.showClearIcon = false
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
			// 清除按钮触发
			clearIconHandle(){
				this.inputValue = ''
				this.$emit('input','')
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