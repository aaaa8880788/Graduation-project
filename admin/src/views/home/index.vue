<template>
  <div class="common-layout">
    <el-container>
      <!-- 头部部分 -->
      <el-header class="header">
        <!-- 左侧部分 -->
        <div class="header-left">
          <i class="iconfont icon-red-chongwugou"></i>
          <p>智慧党建系统</p>
        </div>
        <!-- 右侧部分 -->
        <div class="header-right">
          <el-dropdown @command="commandHandler">
            <span class="el-dropdown-link">
              <div class="avatar">
                <img v-if="userInfo.avatar" :src="userInfo.avatar" />
                <img v-else src="@/assets/image/user_head.png" />
              </div>
              <span>{{ userInfo.title ?? '默认用户' }}</span>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="退出登录">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <!-- 主体部分 -->
        <el-main class="main">
          <!-- 左侧菜单部分 -->
          <nav-menu></nav-menu>
          <!-- 右侧主体页面 -->
          <Suspense>
            <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
            </router-view>
            <template #fallback>
              <!-- 页面未加载时显示区域 -->
              <div></div>
            </template>
          </Suspense>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import navMenu from '@/components/nav-menu/index.vue' 
import { useRouter } from "vue-router";
import { getUserInfoRequest } from "@/network/home";
import localCache from '@/utils/local-cache'
// 导入Element Plus方法
import { ElMessage } from "element-plus";
// 定义属性
const router = useRouter();
let userId = localCache.getCache('userId')
let userInfo = ref({
  title: '',
  avatar: '',
  powerId: [],
  type: ''
})
// 定义方法
const commandHandler = (command: string) => {
  if (command === "退出登录") {
    localCache.clearCache()
    // 弹窗提示
    ElMessage({
      message: "退出登录成功",
      type: "success",
    });
    router.replace("/login");
  }
};
// 获取登录用户信息
const getUserInfo = async () => {
  if (typeof userId !== 'number' && [null, undefined].includes(userId)) {
    localCache.deleteCache("token");
    // 弹窗提示
    ElMessage({
      message: "登录失效，请重新登录",
      type: "error",
    });
    router.replace("/login");
  } else {
    const data = await getUserInfoRequest('/findManagerById', userId)
    if (data.code === 200) {
      userInfo.value.title = data.data.title
      userInfo.value.avatar = data.data.avatar
      userInfo.value.powerId = data.data.powerId
      userInfo.value.type = data.data.type
    } else {
      localCache.deleteCache("token");
      ElMessage({
        message: "登录失效，请重新登录",
        type: "error",
      });
      router.replace("/login");
    }
  }
}
getUserInfo()

</script>

<style scoped lang="less">
.common-layout {
  width: 100%;
}

.header {
  padding: 0 50px;
  height: 10vh;
  box-shadow: 0 0 8px 1px #ccc;
  position: relative;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 800px;

  n .header-left {
    display: flex;

    .icon-red-chongwugou {
      font-size: 35px;
      margin-right: 10px;
    }

    font-size: 24px;
  }

  .header-right {
    height: 100%;
    display: flex;
    align-items: center;

    .el-dropdown {
      height: 50%;
    }

    .el-dropdown-link {
      display: flex;
      align-items: center;

      .avatar {
        margin-right: 10px;
        width: 30px;
        height: 30px;

        img {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
}

.main {
  padding: 0;
  height: 90vh;
  display: flex;
  overflow: hidden;
}
</style>
