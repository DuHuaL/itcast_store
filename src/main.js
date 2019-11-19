// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import MyAxios from '@/plugins/myaxios.js';
// 导入element-ui
import ElementUI from 'element-ui';
// 导入elemenui中的css
// import 'element-ui/lib/theme-chalk/index.css';
// 导入自定义样式
import '@/assets/css/index.css';
// 导入moment
import moment from 'moment';
// 导入封装的面包屑组件
import MyBreadcrumb from '@/components/mybreadcrumb';
Vue.use(MyAxios);
Vue.use(ElementUI);
Vue.config.productionTip = false;
// 全局注册
Vue.component(MyBreadcrumb.name, MyBreadcrumb);

// 格式化日期的过滤器
Vue.filter('fomDate', (value, fomStr) => {
  return moment(value).format(fomStr);
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
