<template>
	<view class="nav_top">
		<view 
			class="nav_item"
			:class="{ 'nav_item_active' : index === current}"
			v-for="(item,index) in navData"
			:key="item"
			@click="navItemClickHandle(index,item)">
			<text>{{item}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"navTop",
		props:{
			navData:{
				type: Array,
				default: () => ['推荐','时事要闻','新思想','党史','党建']
			},
		},
		data() {
			return {
				current: 0,
			};
		},
		methods:{
			navItemClickHandle(index,item){
				if(index === this.current){
					return 
				}
				this.current = index
				this.$emit('itemChange',index,item)
			}
		}
	}
</script>

<style lang="less">
.nav_top{
	width: 100vw;
	background-color: #ffdede;
	box-sizing: border-box;
	height: 80rpx;
	line-height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
	.nav_item{
		height: 100%;
	}
	.nav_item_active{
		border-bottom: 3px solid #ff0000;
		font-weight: 700;
		font-size: 32rpx;
		color: #ff0000;
	}
}
</style>