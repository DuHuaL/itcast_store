<template>
  <el-container class="box">
    <el-header class="header">
      <el-row>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <img src="@/assets/logo.png" alt="">
          </div>
        </el-col>
        <el-col :span="13">
          <div class="grid-content bg-purple-light">
            <span>电商后台管理系统</span>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <a href="#" @click.prevent="handleLogOut">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="box">
      <el-aside width="200px" class="aside">
        <el-menu
        :unique-opened="true"
        :router="true"
        default-active="1-1"
        class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              数据报表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 判断是否登录
  beforeCreate() {
    // 判断是否有token值
    const token = sessionStorage.getItem('token');
    if (!token) {
      // 跳转到登陆页面并提示登陆
      this.$router.push({
        name: 'login'
      });
      this.$message.warning('请先登录');
    }
  },
  methods: {
    handleLogOut() {
      // 删除token
      sessionStorage.removeItem('token');
      // 跳转到login
      this.$router.push({
        name: 'login'
      });
      this.$message.success('退出成功');
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.box .header {
   background-color: #b3c0d1;
   line-height: 60px;
   padding: 0;
}
.box .header img{
  vertical-align: middle;
  padding-bottom: 20px;
}
.box .header span{
  font-size: 30px;
  color: #fff;
  /* padding-left: 400px; */
}
.box .header a {
  color: orange;
  padding-left: 30px;
  text-decoration: none;
}
.box .aside{
   background-color: #d3dce6;
}
.el-menu-vertical-demo {
   height: 100%;
}
.box .main {
  background-color: #e9eef3;
  height: 100%;
}
</style>
