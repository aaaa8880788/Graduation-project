import type { AxiosRequestConfig, AxiosResponse } from "axios";

interface DRequestInterceptor<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorCatch?: (err: any) => any;
  responseInterceptor?: (res: T) => T;
  responseInterceptorCatch?: (err: any) => any;
}

interface DRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: DRequestInterceptor<T>;
}

export type { DRequestInterceptor, DRequestConfig };
