import { createRouter, createWebHistory } from "vue-router";
// 导入Element Plus方法
import { ElMessage } from "element-plus";
import type { RouteRecordRaw } from "vue-router";
import localCache from "@/utils/local-cache";
import { firstMenuPath } from "@/utils/map-menus";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    name: "home",
    path: "/home",
    component: () => import("@/views/home/index.vue"),
    children:[
      {
        name: 'not-found',
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/not-found/not-found.vue')
      }
    ]
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeEach(async(to, from) => {
  if (to.path !== "/login") {
    const token = localCache.getCache("token");
    const userId = localCache.getCache("userId");
    const menuList = localCache.getCache("menuList");
    if (!token) {
      ElMessage({
        message: "登录失效，请重新登录",
        type: "error",
      });
      return "login";
    }
  }
  if (to.path === '/home') {
    return firstMenuPath
  }
});

export default router;
