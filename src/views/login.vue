<template>
  <div class="login">
    <el-form class="login-form" ref="Form" :model="form" label-width="100px"  label-position="top">
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password" @keyup.enter.native="handleLogin"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click.prevent="handleLogin">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    async handleLogin() {
      const res = await this.$http.post('login', this.form);
      const data = res.data;
      // 判断
      if (data.meta.status === 200) {
        sessionStorage.setItem('token', data.data.token);
        this.$message.success('登录成功');
        // 跳转
        this.$router.push({
          name: 'home'
        });
      } else {
        this.$message.error('登录失败');
      }
    }
  }
};
</script>

<style scoped>
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
