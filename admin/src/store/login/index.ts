import { defineStore } from 'pinia';
import { LoginState } from './type'
// 导入本地缓存实例
import localCache from "@/utils/local-cache";
// 导入工具函数
import { mapMenusToRoutes,mapMenusToPermissions } from '@/utils/map-menus';
// 导入路由对象
import router from '@/router'

export const useLoginStore = defineStore({
  id: 'login', // id必填，且需要唯一
  state: (): LoginState => {
    return {
      token: localCache.getCache("token") || "",
      menuList: localCache.getCache("menuList") || [],
      userId: localCache.getCache("userId") || "",
      permissions: localCache.getCache("permissions") || [],
    };
  },
  getters: {
  },
  actions: {
    async loadLocalLogin(){
      const token = localCache.getCache('token')
      if (token) {
        this.token = token
      }
      const userId = localCache.getCache('userId')
      if (userId) {
        this.userId = userId
      }
      const menuList = localCache.getCache('menuList')
      if (menuList) {
        this.menuList = menuList
        // 通过用户菜单权限拿到对应的路由信息
        const routes = await mapMenusToRoutes(menuList)

        // 注册动态路由
        // 将routes => router.main.children
        routes.forEach((route) => {
          router.addRoute('home', route)
        })

        // 通过用户菜单获取用户按钮权限
        const permissions = mapMenusToPermissions(menuList)
        this.permissions = permissions
      }
    }
  },
});