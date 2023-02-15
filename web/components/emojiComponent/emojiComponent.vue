<template>
	<view 
		v-if="isEmojiShow" 
		class="emoji_component">
		<view 
			v-for="(row,rowIndex) in Math.ceil(emojiList.length / rowSize)"
			class="emoji_row">
			<view
				v-for="(item,index) in rowSize"
				class="emoji_item"
				@click="emojiClickHandle(emojiList[index + rowIndex * rowSize])">
				<text>{{ emojiList[index + rowIndex * rowSize] }}</text>
			</view>
		</view>
		<view class="close_icon" @click="deleteClickHandle">
			<u-icon name="backspace" size="30"></u-icon>
		</view>
	</view>
</template>

<script>
	import { emojiList } from '../../utils/utils.js'
	export default {
		name:"emojiComponent",
		props:{
			isEmojiShow:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				emojiList:emojiList,
				rowSize:7
			};
		},
		methods:{
			emojiClickHandle(item){
				this.$emit('emojiClick',item)
			},
			deleteClickHandle(){
				this.$emit('deleteClick')
			}
		}
	}
</script>

<style lang="less" scoped>
.emoji_component{
	overflow: auto;
	max-height: 320rpx;
	box-sizing: border-box;
	padding-top: 40rpx;
	padding-bottom: 80rpx;
	position: relative;
	.emoji_row{
		display: flex;
		.emoji_item{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 40rpx;
			height: 70rpx;
			width: calc(100% / 7);
		}
	}
	.close_icon{
		background-color: #f4f4f4;
		position: fixed;
		z-index: 50;
		right: 7%;
		bottom: 1%;
	}
}
</style>