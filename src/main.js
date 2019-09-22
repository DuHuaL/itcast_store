// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import MyAxios from '@/plugins/myaxios.js';
// 导入element-ui
import ElementUI from 'element-ui';
// 导入elemenui中的css
import 'element-ui/lib/theme-chalk/index.css';
// 导入自定义样式
import '@/assets/css/index.css';
Vue.use(MyAxios);
Vue.use(ElementUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
