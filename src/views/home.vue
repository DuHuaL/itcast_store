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
          <el-submenu
            v-for="item1 in menus"
            :key="item1.id"
            :index="item1.id + ''">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item
              :index="'/' + item2.path"
              v-for="item2 in item1.children"
              :key="item2.id">
              <i class="el-icon-menu"></i>
              {{item2.authName}}
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
  // 在路由之前，设置了路由前置守卫
  // // 判断是否登录
  // beforeCreate() {
  //   // 判断是否有token值
  //   const token = sessionStorage.getItem('token');
  //   if (!token) {
  //     // 跳转到登陆页面并提示登陆
  //     this.$router.push({
  //       name: 'login'
  //     });
  //     this.$message.warning('请先登录');
  //   }
  // },
  created() {
    this.loadData();
  },
  data() {
    return {
      menus: []
    };
  },
  methods: {
    async loadData() {
      const {data: resData} = await this.$http.get('menus');
      this.menus = resData.data;
    },
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
