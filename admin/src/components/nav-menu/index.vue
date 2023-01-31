<template>
  <div class="nav-menu">
    <el-scrollbar>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        router>
        <el-menu-item :index="item.path" v-for="item in showMenuList" :key="item.id">
          <el-icon><component :is="item.icon"></component></el-icon>
          <span>{{ item.content }}</span>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useLoginStore } from "@/store/login";
import localCache from "@/utils/local-cache";
import { ref } from 'vue'
// 导入Element Plus方法
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
// 定义属性
const useLogin = useLoginStore()
const menuList:any[] = useLogin.menuList
const router = useRouter();
const showMenuList = ref<any[]>([])

// 定义方法
// 权限名字转化
const getMenuName = (name:string) =>{
  let str:string = ''
  let icon:string = '' 
  switch (name) {
    case 'active':
      str = '活动管理'
      icon = 'Basketball'
      break;
    case 'article':
      str = '文章管理'
      icon = 'Notebook'
      break;
    case 'class':
      str = '专业管理'
      icon = 'Discount'
      break;
    case 'comment':
      str = '评论管理'
      icon = 'ChatRound'
      break;
    case 'faculty':
      str = '学院管理'
      icon = 'Connection'
      break;
    case 'gift':
      str = '礼品管理'
      icon = 'TrophyBase'
      break;
    case 'manager':
      str = '管理员管理'
      icon = 'User'
      break;
    case 'organization':
      str = '组织管理'
      icon = 'Bicycle'
      break;
    case 'place':
      str = '地点管理'
      icon = 'Location'
      break;
    case 'practice':
      str = '题目管理'
      icon = 'CollectionTag'
      break;
    case 'role':
      str = '角色管理'
      icon = 'IceCreamRound'
      break;
    case 'school':
      str = '学校管理'
      icon = 'Soccer'
      break;
    case 'user':
      str = '用户管理'
      icon = 'Scissor'
      break;
    case 'vedio':
      str = '视频管理'
      icon = 'VideoPlay'
      break;
    case 'order':
      str = '订单管理'
      icon = 'Document'
      break;
  }
  return {
    str,
    icon
  }
}

if(menuList.length){
  menuList.forEach(item => {
    item.path = `/home${item.path}`
    item.content = getMenuName(item.name).str
    item.icon = getMenuName(item.name).icon
  })
  showMenuList.value = menuList
}else{
  localCache.clearCache()
  ElMessage({
    message: "登录失效，请重新登录",
    type: "error",
  });
  router.replace("/login");
}


</script>

<style lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 90vh;
}
</style>
