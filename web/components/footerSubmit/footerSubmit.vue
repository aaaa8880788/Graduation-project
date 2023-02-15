<template>
	<view class="footer_submit">
		<view class="footer_header">
			<view class="footer_left">
				<view 
					class="icon_operation" 
					@click="recordChangeHandle">
					<i
						v-if="!isRecord"
						class="iconfont icon-jianpan">
					</i>
					<i
						v-else
						class="iconfont icon-yuyin">
					</i>
				</view>
			</view>
			<view 
				class="footer_center"
				:style="{textAlign: isRecord ? 'left' : 'center'}">
				<textarea
					ref="myTextarea"
					v-if="isRecord"
					v-model="valueText"
					focus="isFocus"
					auto-height
					border="false"
					@focus="textareaFocusHandle"
					@linechange="linechangeHandle"
					@confirm="confirmHandle"/>
				<text 
					v-else
					class="record_text">按住说话</text>
			</view>
			<view class="footer_right">
				<view 
					class="icon_smile" 
					@click="smileClickHandle">
					<i
						v-if="isEmojiShow"
						class="iconfont icon-jianpan">
					</i>
					<i 
						v-else
						class="iconfont icon-xiaolian"></i>
				</view>
				<view 
					v-if="valueText.length > 0" 
					class="button_send">
					<text @click="confirmHandle()">发送</text>
				</view>
				<view 
					v-else
					class="icon_add"
					@click="addClickHandle">
					<i class="iconfont icon-jia2"></i>
				</view>
				
			</view>
		</view>
		<emojiComponent 
			:isEmojiShow="isEmojiShow"
			@deleteClick="deleteClickHandle"
			@emojiClick="emojiClickHandle"></emojiComponent>
	</view>
</template>

<script>
	import GraphemeSplitter from 'grapheme-splitter'
	export default {
		name:"footerSubmit",
		data() {
			return {
				isRecord:true,
				isEmojiShow:false,
				isFocus:true,
				valueText:''
			};
		},
		props:{
			value:{
				type:String,
				default:''
			}
		},
		onLoad() {
			this.valueText = value
		},
		watch:{
			valueText:{
				handler(newValue,oldValue){
					this.$emit('input',newValue)
				}
			}
		},
		methods:{
			// 输入框函数变化触发
			linechangeHandle(e){
				this.$nextTick(() => {
					this.getSubHeigh()
				})
			},
			// 聚焦处理
			textareaFocusHandle(){
				this.isEmojiShow = false
				this.$nextTick(() => {
					this.getSubHeigh()
				})
			},
			// 回车或发送点击触发
			confirmHandle(){
				this.$emit('confirm',this.valueText)
				this.valueText = ''
			},
			// 点击语言图标触发
			recordChangeHandle(){
				this.isRecord = !this.isRecord
			},
			// 关闭表情
			closeEmoji(){
				this.isEmojiShow = false
				uni.hideKeyboard()
				this.$nextTick(() => {
					this.getSubHeigh()
				})
			},
			// 点击笑脸图标触发
			smileClickHandle(){
				this.isEmojiShow = !this.isEmojiShow
				if(!this.isEmojiShow){
					this.$refs.myTextarea._focus()
				}else{
					uni.hideKeyboard()
					this.$nextTick(() => {
						this.getSubHeigh()
					})
				}
			},
			// 点击加号图标触发
			addClickHandle(){
				console.log('add');
				this.$nextTick(() => {
					this.getSubHeigh()
				})
			},
			// 点击emoji列表中的删除触发
			deleteClickHandle(){
				if(!this.valueText){
					return
				}
				const splitter = new GraphemeSplitter();
				const graphemes = splitter.splitGraphemes(this.valueText);
				graphemes.pop()
				this.valueText = graphemes.join("")
			},
			// 点击emoji表情触发
			emojiClickHandle(item){
				const textArr = this.valueText.split("")
				textArr.push(item)
				this.valueText = textArr.join('')
			},
			// 获取高度
			getSubHeigh() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.footer_submit').boundingClientRect(data=>{
					this.$emit('getHeight', data.height)
				}).exec()
			},
		},
	}
</script>

<style lang="less" scoped>
	.footer_submit{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		border-top: 1px solid #d9d9d9;
		box-sizing: border-box;
		padding: 15rpx 30rpx;
		background-color: #f4f4f4;
		.footer_header{
			display: flex;
			justify-content: space-between;
			align-items: center;
			i{
				font-size: 26px;
			}
			.footer_left{
				display: flex;
				.icon_operation{
					display: flex;
					align-items: center;
				}
			}
			.footer_center{
				margin: 0 30rpx;
				padding: 20rpx;
				width: 50%;
				background-color: #fff;
				border-radius: 20rpx;
				textarea{
					width: 100%;
				}
			}
			.footer_right{		
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-around;
				.icon_smile,.icon_add{
					position: relative;
					width: 40rpx;
					height: 40rpx;
					i{
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%,-50%);
					}
				}
				.button_send{
					box-sizing: border-box;
					height: 50rpx;
					line-height: 50rpx;
					color: #fff;
					background-color: #f77343;
					padding: 0 20rpx;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>