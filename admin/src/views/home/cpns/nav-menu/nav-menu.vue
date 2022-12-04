<template>
  <div class="nav-menu">
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      router
    >
      <el-menu-item :index="item.path" v-for="item in menuList" :key="item.id">
        <el-icon><component :is="item.icon"></component></el-icon>
        <span>{{ item.content }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import menuList from "./config/menu-data";
// 定义属性
interface Props {
  isCollapse?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isCollapse: false,
});
</script>

<style lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 90vh;
}
</style>
