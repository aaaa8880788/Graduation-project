<template>
	<view class="publish_comment">
		<u-popup
			ref="myPopup"
			:show="isShowPopup"
			mode="bottom"  
			round
			@close="popupCloseHandle">
			<view class="popup_wrapper">
			  <view class="popup_header">
			  	<view 
						class="header_bottom" 
						@click="cancelClick">
			  		<text>取消</text>
			  	</view>
					<view 
						class="header_bottom" 
						:class="{'active_color': value}"
						@click="publishClickHandle">
						<text>发布</text>
					</view>
			  </view>
				<view class="popup_footer">
					<input 
						type="text" 
						focus
						:placeholder="placeholder"
						close
						:value="value"
						@input="valueChangeHandle">
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"publishComment",
		props:{
			isShowPopup:{
				type:Boolean,
				default:false
			},
			placeholder:{
				type:String,
				default:"好观点将会被优先展示"
			},
			value:{
				type:String | Number,
				default:''
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			popupCloseHandle(){
				this.$emit('popupCloseBtnClick')
			},
			cancelClick(){
				this.$refs.myPopup.close()
			},
			publishClickHandle(){
				if(!this.value){
					return
				}
				this.$refs.myPopup.close()
				this.$emit('popupPublishClick',this.value)
			},
			valueChangeHandle(e){
				this.$emit('input',e.target.value)
			}
		}
	}
</script>

<style lang="less" scoped>
.popup_wrapper{
	height: 60px;
	padding: 5px 15px;
	.popup_header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.header_bottom{
			color: #b8b8b9;
			font-size: 14px
		}
	}
	.popup_footer{
		margin-top: 5px;
		background-color: #f0f1f3;
		padding: 5px 10px;
	}
}
input{
	font-size: 12px;
}
.uni-input-placeholder{
	font-size: 12px;
}
.active_color{
	color: #eb5544 !important;
}
</style>