<template>
	<view class="comment_bar_footer">
		<view 
			class="comment_bar_footer_left"
			@click="publishCommentClick">
			<text>欢迎发表你的观点</text>
		</view>
		<view class="comment_bar_footer_right">
			<view 
				class="chat" 
				@click="iconClickHandle('chat')">
				<view class="chat_count">
					<text>{{ commentCount }}</text>
				</view>
				<u-icon name="chat" size="25"></u-icon>
			</view>
			<view 
				class="star"
				@click="iconClickHandle('star')">
				<u-icon 
					v-if="!isLight"
					name="star" 
					size="25">
				</u-icon>
				<u-icon
					v-else
					name="star-fill" 
					size="25"
					color="#eb5544">
				</u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"commentBar",
		data() {
			return {
				
			};
		},
		props:{
			commentCount:{
				type:Number,
				default:0
			},
			isLight:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			// 图标点击
			iconClickHandle(item){
				this.$emit('iconClick',item)
			},
			publishCommentClick(){
				this.$emit('publishClick')
			}
		}
	}
</script>

<style lang="less" scoped>
	.comment_bar_footer{
		position: fixed;
		bottom: 0;
		left: 0%;
		right: 0;
		height: 50px;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 20px;
		.comment_bar_footer_left{
			color: #949599;
			background-color: #f3f4f6;
			border-radius: 5rpx;
			width: 70%;
			text-align: center;
			font-size: 24rpx;
		}
		.comment_bar_footer_right{
			width: 30%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			.chat{
				position: relative;
				.chat_count{
					width: 60rpx;
					height: 15px;
					line-height: 15px;
					text-align: center;
					position: absolute;
					color: #fff;
					top: -7px;
					right: -20px;
					font-size: 12px;
					background-color: red;
					border-radius: 20rpx;
				}
			}
		}
	}
</style>