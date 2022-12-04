<template>
  <div class="common-layout">
    <el-container>
      <!-- 头部部分 -->
      <el-header class="header">
        <!-- 左侧部分 -->
        <div class="header-left">
          <i class="iconfont icon-red-chongwugou"></i>
          <p>鸭子影视</p>
        </div>
        <!-- 右侧部分 -->
        <div class="header-right">
          <el-dropdown @command="commandHandler">
            <span class="el-dropdown-link">
              <div class="avatar">
                <img class="" src="@/assets/image/avatar.jpg" />
              </div>
              <span>呆头鸭</span>
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
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import navMenu from "./cpns/nav-menu/nav-menu.vue";
// import { ArrowDown } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useLoginStore } from 'store/login';
// 导入Element Plus方法
import { ElMessage } from "element-plus";
// 定义属性
const loginStore = useLoginStore();
const router = useRouter();
// 定义方法
const commandHandler = (command: string) => {
  if (command === "退出登录") {
    loginStore.clearToken();
    // 弹窗提示
    ElMessage({
      message: "退出登录成功",
      type: "success",
    });
    router.replace("/login");
  }
};
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
  .header-left {
    display: flex;
    .icon-red-chongwugou {
      font-size: 35px;
      margin-right: 10px;
    }
    font-size: 24px;
  }
  .header-right {
    .el-dropdown-link {
      display: flex;
      align-items: center;
    }
    .avatar {
      margin-right: 10px;
      img {
        width: 40px;
      }
    }
  }
}
.main {
  padding: 0;
  height: 90vh;
  display: flex;
}
</style>
