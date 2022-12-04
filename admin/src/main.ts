import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// 样式
import '@/assets/css/global.css'
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/message-box/style/css";
// 引入element plus图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 样式

const app = createApp(App)

app.use(router)
app.use(store)
// 统一注册Icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app')
