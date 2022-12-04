import axios from "axios";
import type { AxiosInstance } from "axios";
import type { DRequestConfig, DRequestInterceptor } from "./type";
// 定义网络请求封装类
class DRequest {
  instance: AxiosInstance;
  interceptor?: DRequestInterceptor;
  constructor(config: DRequestConfig) {
    this.instance = axios.create(config);
    this.interceptor = config.interceptors;
    // 使用传进来的拦截器
    this.instance.interceptors.request.use(
      this.interceptor?.requestInterceptor,
      this.interceptor?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptor?.responseInterceptor,
      this.interceptor?.responseInterceptorCatch
    );
    // 下面可以使用全局拦截器
    /*
    this.instance.interceptors.request.use(
      (config) => {
        console.log("所有的实例都有的拦截器:请求成功拦截");
        return config;
      },
      (err) => {
        console.log("所有的实例都有的拦截器:请求失败拦截");
        return err;
      }
    );
    this.instance.interceptors.response.use(
      (res) => {
        console.log("所有的实例都有的拦截器:响应成功拦截");
        return res;
      },
      (err) => {
        console.log("所有的实例都有的拦截器:响应失败拦截");
        return err;
      }
    );
    */
  }
  // 下面定义方法
  request(config: DRequestConfig): Promise<any> {
    return new Promise((resolve, rejects) => {
      this.instance
        .request(config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          rejects(err);
        });
    });
  }
  get(config: DRequestConfig) {
    return this.request({
      ...config,
      method: "GET",
    });
  }
  post(config: DRequestConfig) {
    return this.request({
      ...config,
      method: "POST",
    });
  }
  put(config: DRequestConfig) {
    return this.request({
      ...config,
      method: "PUT",
    });
  }
  delete(config: DRequestConfig) {
    return this.request({
      ...config,
      method: "DELETE",
    });
  }
}

export default DRequest;
