import { defineStore } from 'pinia';
import { LoginState } from './type'
// 导入本地缓存实例
import localCache from "@/utils/local-cache";

export const useLoginStore = defineStore({
  id: 'login', // id必填，且需要唯一
  state: (): LoginState => {
    return {
      token: localCache.getCache("token") || "",
    };
  },
  getters: {
  },
  actions: {
    async setToken({ token }: LoginState) {
      localCache.setCache("token", token);
      this.token = token
    },
  },
});