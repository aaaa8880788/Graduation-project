<template>
	<u-count-down
		ref="countDown"
		:time="time" 
		format="HH:mm:ss" 
		autoStart 
		millisecond 
		@change="onChange">
		<view class="time">
			<view class="time__custom">
				<text class="time__custom__item">{{ timeData.seconds }}</text>
			</view>
		</view>
	</u-count-down>
</template>

<script>
	export default {
		data() {
			return {
				timeData: {},
			}
		},
		props:{
			time:{
				type:Number,
				default: 1000 * 3
			}
		},
		methods: {
			onChange(e) {
				this.timeData = e
				this.$emit('remainderChange',e.seconds)
				if(e.milliseconds === 0 && e.seconds === 0){
					this.$emit('timeover')
				}
			},
			//开始
			start() {
			  this.$refs.countDown.start();
			},
			// 暂停
			pause() {
			  this.$refs.countDown.pause();
			},
			// 重置
			reset() {
			  this.$refs.countDown.reset();
			},
		}
	}
</script>

<style lang="scss">
	.time {
		@include flex;
		align-items: center;

		&__custom {
			margin-top: 4px;
			width: 22px;
			height: 22px;
			background-color: $u-primary;
			border-radius: 4px;
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			justify-content: center;
			align-items: center;

			&__item {
				color: #fff;
				font-size: 12px;
				text-align: center;
			}
		}

		&__doc {
			color: $u-primary;
			padding: 0px 4px;
		}

		&__item {
			color: #606266;
			font-size: 15px;
			margin-right: 4px;
		}
	}
</style>
