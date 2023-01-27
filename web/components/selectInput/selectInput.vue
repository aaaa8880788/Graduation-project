<template>
	<view class="form_content">
		<view class="input_title">
			<text>{{inputTitle}}</text>
		</view>
		<view class="form">
			<input
				class="input_content" 
				:value="inputValue"
				disabled
				:type="inputType" 
				:placeholder="placeholder" 
				:placeholder-style="`${placeholderStyle}`"
				@click="clickHandle"/>
			<uni-icons 
				v-if="showClearIcon"
				type="close" 
				size="20"
				@click="clearIconHandle">
			</uni-icons>
		</view>
		<u-action-sheet 
			:show="showPick"
			:actions="listData" 
			:title="placeholder"
			@select="selectClick"
			@close="showPick = false">
		</u-action-sheet>
	</view>
</template>

<script>
	export default {
		name:"stringInput",
		props: {
			value: {
				type: String | Number,
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
			},
			listData: {
				type: Array,
				default: () => []
			},
		},
		data() {
			return {
				showClearIcon:false,
				inputValue:"",
				showPick:false
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
			if(this.listData){
				const item = this.listData.find(item => item.value === this.value)
				if(item){
					return this.inputValue = item.name
				}
			}
		},
		methods: {
			// 清除按钮触发
			clearIconHandle(){
				this.inputValue = ''
				this.$emit('input','')
				this.$emit('clear')
			},
			// 输入框点击触发
			clickHandle(){
				this.showPick = true
				uni.hideKeyboard()
			},
			// 选中值触发
			selectClick(val){
				this.inputValue = val.name
				this.$emit('input',val.value)
				this.$emit('change',val)
				this.showPick = false
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