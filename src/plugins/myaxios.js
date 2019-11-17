import axios from 'axios';
import { Message } from 'element-ui';
const MyAxios = {};
MyAxios.install = function(Vue) {
  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/',
    timeout: 1000
  });

  // 设置axios的拦截器
  // Add a request interceptor
  instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 请求的拦截器，在发送请求之前执行
  // 登陆的时候不需要加，登陆接口排除
  // 判断是不是登陆接口
    if (config.url.toLowerCase() !== 'login') {
      const token = sessionStorage.getItem('token');
      config.headers.Authorization = token;
    }
    return config;
  }, function (error) {
  // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
    const {data: {meta: {status, msg}}} = response;
    if (status !== 200 && status !== 201) {
      Message.error(msg);
    }
    return response;
  }, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
    return Promise.reject(error);
  });

  Vue.prototype.$http = instance;
};

export default MyAxios;
