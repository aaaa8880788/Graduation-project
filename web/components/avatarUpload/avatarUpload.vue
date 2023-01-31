<template>
	<view class="avatar_upload">
		<u-upload
			:fileList="avatarList"
			@afterRead="afterRead"
			@delete="deletePic"
			name="1"
			:maxCount="1"
			:previewFullImage="true"
		>
			<image
				v-if="value"
				class="default_avatar" 
				:src="value">
			</image>
			<image 
				v-else
				class="default_avatar" 
				src="../../static/user_default.png">
			</image>
		</u-upload>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		name:"avatarUpload",
		data() {
			return {
				avatarList: []
			};
		},
		props:{
			value:{
				type:String,
				default:''
			}
		},
		watch:{
			avatarList:{
				handler(newValue,oldValue){
					if(newValue.length){
						this.$emit('input',newValue[0].url)
					}else{
						this.$emit('input','')
					}
				},
				deep:true
			}
		},
		methods:{
			// 删除图片
			deletePic(event) {
				this.avatarList.splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this.avatarList.length
				lists.map((item) => {
					this.avatarList.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					if(result){
						let item = this.avatarList[fileListLen]
						this.avatarList.splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result
						}))
						fileListLen++
					}else{
						this.avatarList.splice(fileListLen,1)
						this.$refs.uToast.show({
							type: 'error',
							message: '上传失败',
							icon:false
						})
						return
					}	
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://localhost:3000/admin/api/upload/avatar', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						header:{
							Authorization:uni.getStorageSync('token') ? JSON.parse(uni.getStorageSync('token')) : ''
						},
						success: (res) => {
							const data = JSON.parse(res.data)
							if(data.code === 200){
								resolve(data.data.url)
							}else{
								resolve()
							}
						}
					});
				})
			},
		}
	}
</script>

<style lang="less" scoped>
// 默认头像样式
.default_avatar{
	width: 160rpx;
	height: 160rpx;
}
</style>