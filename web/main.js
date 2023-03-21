
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import uView from '@/uni_modules/uview-ui'
// import io from './utils/weapp.socket.io.js'	// 通信模块
import { io } from "socket.io-client/dist/socket.io";
Vue.config.productionTip = false
// Vue.prototype.serverUrl = 'http://localhost:3000'		// 后端API baseUrl
Vue.prototype.socket = io('ws://localhost:3001',{
	cors: {
	    origin: '*',
			}
})
console.log('----',io('ws://localhost:3001'));

Vue.use(uView)
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif