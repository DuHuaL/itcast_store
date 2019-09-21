<template>
  <div class="login">
    <el-form class="login-form" ref="Form" :model="form" label-width="100px"  label-position="top">
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    };
  }
};
</script>

<style>
.login {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}
.login-btn {
  width: 100%;
}
</style>
