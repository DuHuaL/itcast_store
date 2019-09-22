import axios from 'axios';

const MyAxios = {};
MyAxios.install = function(Vue) {
  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/',
    timeout: 1000
  });
  Vue.prototype.$http = instance;
};

export default MyAxios;
