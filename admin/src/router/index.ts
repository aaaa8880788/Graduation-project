import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import localCache from "@/utils/local-cache";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    name: "home",
    path: "/home",
    component: () => import("@/views/home/index.vue"),
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/index.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeEach((to, from) => {
  if (to.path !== "/login") {
    const token = localCache.getCache("token");
    if (!token) {
      return "login";
    }
  }
});

export default router;
