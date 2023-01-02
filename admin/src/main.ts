import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { useLoginStore } from './store/login/index';
// 导入element plus国际化配置
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'



// 样式
import '@/assets/css/global.less'
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/message-box/style/css";
// 引入element plus图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 样式
const app = createApp(App)

app.use(store)
const useLogin = useLoginStore()
// 这里加await的原因是要等动态路由注册完再进行router的注册
// 如果不加await，就会造成router先注册了，然后此时的地址比如是/home/manager
// 这时候/home/manager的页面又是动态路由注册的，所以此时该页面就会空了
await useLogin.loadLocalLogin()

app.use(router)
// 统一注册Icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 国际化注册
app.use(ElementPlus, {
  locale: zhCn
})

app.mount('#app')
