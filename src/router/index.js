import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/login';
import Home from '@/views/home';
import Users from '@/views/users/users';
Vue.use(Router);

export default new Router({
  routes: [
    // {name: 'home', path: '/', redirect: {name: 'login'}},
    {name: 'login', path: '/login', component: Login},
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        { name: 'users', path: '/users', component: Users }
      ]

    }
  ]
});
