<template>
  <div>
    <videoPlay 
    v-bind="props" 
    @play="onPlay"
    @pause="onPause" 
    @timeupdate="onTimeupdate" 
    @canplay="onCanplay" />
  </div>
</template>

<script setup lang="ts">
import videoPlay from 'vue3-video-play'
import 'vue3-video-play/dist/style.css' // 引入css

// 定义类型
interface Props {
  width?:string
  height?:string
  color?:string
  muted?:boolean
  webFullScreen?:boolean
  speedRate?:string[]
  autoPlay?:boolean
  loop?:boolean
  mirror?:boolean
  ligthOff?:boolean
  volume?:number
  control?:boolean
  title?:string
  src:string
  poster?:string
}

// 定义属性
const props = withDefaults(defineProps<Props>(), {
  width: '460px', //播放器高度
  height: '', //播放器高度
  color: "#409eff", //主题色
  muted: false, //静音
  webFullScreen: false,
  speedRate: () => ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
  autoPlay: false, //自动播放
  loop: false, //循环播放
  mirror: false, //镜像画面
  ligthOff: false,  //关灯模式
  volume: 0.3, //默认音量大小
  control: true, //是否显示控制器
  title: '', //视频名称
  src: "", //视频源
  poster: '', //封面
});
const onPlay = (ev:any) => {
  console.log('播放')
  console.log('ev',ev)
}
const onPause = (ev:any) => {
  console.log(ev, '暂停')
  console.log('ev',ev)
}

const onTimeupdate = (ev:any) => {
  console.log(ev, '时间更新')
  console.log('ev',ev)
}
const onCanplay = (ev:any) => {
  console.log(ev, '可以播放')
  console.log('ev',ev)
}
</script>

<style scoped>
</style>