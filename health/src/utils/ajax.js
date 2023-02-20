import Vue from "vue";
import axios from "axios";
import { Message } from "element-ui";
import router from "@/router";

/**
 * 创建 ajax 实例
 * 并设置请求超时时间
 * @type {axios.AxiosInstance}
 */
const ajax = axios.create({
  timeout: 100000,
});

/**
 * 请求拦截器
 */
ajax.interceptors.request.use((config) => {
  console.log("请求 ", config);
  const token = sessionStorage.getItem("token");
  if (token) {
    // 把token 加入header 中
    config.headers["Authorization"] = token;
  }
  return config;
}, (err => {
  console.log("请求异常", err);
  })
);

/**
 * 响应拦截器
 */
ajax.interceptors.response.use(
  (res) => {
    console.log(res);
    // 密码错误
    // if (!res.data.status) {
    //   Message.error(res.data.msg);
    // }
    return res.data;
  },
  (err) => {
    console.log("异常", err);
    if (err.response.status === 400) {
      Message.error(err.response.data.msg);
    } else if (err.response.status === 401) {
      Message.error("您未登录，请登陆后操作！");
      // 跳转到登录页面
      sessionStorage.clear();
      router.replace("/login");
    } else if (err.response.status === 403) {
      Message.error(err.response.data.msg);
    } else if (err.response.status === 404) {
      Message.error("后端接口未找到");
    } else if (err.response.status === 500) {
      Message.error("后端异常--->" + err.response.data.msg);
    }
    return err.data;
  }
);

Vue.prototype.$ajax = ajax;

export default ajax;
