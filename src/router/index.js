import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/login';
import Home from '@/views/home';
import Users from '@/views/users/users';
import Rights from '@/views/roles/rights';
import Roles from '@/views/roles/roles';
import ProCategory from '@/views/product/pro_category';
import Goods from '@/views/product/goods';
import Params from '@/views/product/params';
import { Message } from 'element-ui';
Vue.use(Router);

const router = new Router({
  routes: [
    // {name: 'home', path: '/', redirect: {name: 'login'}},
    {name: 'login', path: '/login', component: Login},
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        { name: 'users', path: 'users', component: Users },
        { name: 'rights', path: 'rights', component: Rights },
        { name: 'roles', path: 'roles', component: Roles },
        { name: 'procategory', path: 'categories', component: ProCategory },
        { name: 'goods', path: 'goods', component: Goods },
        { name: 'params', path: 'params', component: Params }
      ]

    }
  ]
});

// 全局路由的前置守卫
router.beforeEach((to, from, next) => {
  // 判断是否需要登录
  // 登录页面不需要登录
  if (to.name === 'login') {
    next();
  } else {
    // 判断是否有token
    const token = sessionStorage.getItem('token');
    if (token) {
      next();
    } else {
      // 提示登录
      Message.warning('请先登录');
      // 没有token
      // 跳转到登录页面
      router.push({
        name: 'login'
      });
    }
  }
});
export default router;
