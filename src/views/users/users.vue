<template>
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchBox">
      <el-col :span="24"><div class="grid-content bg-purple-dark">
        <el-input placeholder="请输入内容" class="search-input" clearable v-model="searchKey">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-button type="success" plain @click="addUserDialogVisible = true">添加用户</el-button>
      </div></el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      scripe
      border
      ref="singleTable"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="username"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        property="email"
        label="邮件"
        width="120">
      </el-table-column>
      <el-table-column
        property="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        property="create_time"
        label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | fomDate('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        property="mg_state"
        label="用户状态">
        <template slot-scope="scope">
          <!-- {{scope.row.mg_state}} -->
          <el-switch
            @change="handleChange(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            plain
            @click="handleEditOpenDialog(scope.row)"
            ></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            plain
            @click="handleDelete(scope.row.id)"
           ></el-button>
           <el-button
            size="mini"
            type="success"
            icon="el-icon-check"
            plain
            @click="handleSetOpenRoleDialog(scope.row)"
           ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible">
      <el-form
        ref="addUserForm"
        :rules="rules"
        label-position="right"
        label-width="100px"
        :model="userFormData">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userFormData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userFormData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userFormData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userFormData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editUserDidlogForm">
      <el-form
        :rules="rules"
        :model="userFormData"
        label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userFormData.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userFormData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userFormData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDidlogForm = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible">
      <el-form
        label-width = '100px'>
        <el-form-item label="用户名">
          {{ selectedUser.username }}
        </el-form-item>
        <el-form-item label="请选择角色">
          <el-select v-model="selectedUser.rid">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="option in options" :key="option.id" :label="option.roleName" :value="option.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      searchKey: '',
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      total: 0,
      addUserDialogVisible: false,
      userFormData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      loading: true,
      // 表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
        ]
      },
      editUserDidlogForm: false,
      setRoleDialogVisible: false,
      selectedUser: {
        username: '',
        rid: -1
      },
      // 存储角色
      options: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 获取列表信息的方法
    async init() {
      // 获取登陆的token
      // const token = sessionStorage.getItem('token');
      // 发送请求的时候带上token
      // this.$http.defaults.headers.common['Authorization'] = token;
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchKey}`);
      this.loading = false;
      const data = res.data;
      this.total = data.data.total;
      if (data.meta.status === 200) {
        this.tableData = data.data.users;
      }
    },
    // 分页的方法
    handleSizeChange(val) {
      // 当年页面上每页显示多少条执行
      this.pagesize = val;
      this.pagenum = 1;
      this.init();
      console.log(`每页: ${val}条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.init();
      console.log(`当前页: ${val}`);
    },
    handleSearch() {
      this.pagenum = 1;
      this.init();
    },
    async handleChange(user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      const data = res.data;
      if (data.meta.status === 200) {
        this.$message.success('用户状态修改成功');
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    async handleAdd() {
      // 验证表单
      this.$refs.addUserForm.validate(async (valid) => {
        // 验证失败
        if (!valid) {
          this.$message.error('请完善表单内容');
        } else {
          const res = await this.$http.post('users', this.userFormData);
          const data = res.data;
          if (data.meta.status === 201) {
            this.$message.success('用户添加成功');
            this.addUserDialogVisible = false;
            this.init();
            // 清空文本框的值
            for (var key in this.userFormData) {
              this.userFormData[key] = '';
            }
          } else {
            this.$message.error(data.meta.msg);
          }
        }
      });
    },
    // 根据id删除用户
    async handleDelete(id) {
      this.$confirm('是否确定删除该用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除操作
        const { data } = await this.$http.delete(`users/${id}`);
        if (data.meta.status === 200) {
          this.$message.success('用户删除成功');
          this.pagenum = 1;
          this.init();
        } else {
          this.$message.error(data.meta.msg);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 编辑用户
    handleEditOpenDialog(user) {
      this.editUserDidlogForm = true;
      this.userFormData = user;
    },
    // 编辑用户提交
    async handleEdit() {
      const { data } = await this.$http.put(`users/${this.userFormData.id}`, {
        email: this.userFormData.email,
        mobile: this.userFormData.mobile
      });
      if (data.meta.status === 200) {
        this.$message.success('修改成功');
        this.editUserDidlogForm = false;
        this.init();
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 打开分配权限的对话框
    async handleSetOpenRoleDialog(user) {
      this.setRoleDialogVisible = true;
      this.selectedUser.username = user.username;
      // 记录用户id，在权限分配时使用
      this.selectedUser.id = user.id;
      // 发送请求获取所有角色信息
      const { data } = await this.$http.get('roles');
      this.options = data.data;
      const { data: data1 } = await this.$http.get(`users/${user.id}`);
      this.selectedUser.rid = data1.data.rid;
    },
    async handleSetRole() {
      const { data } = await this.$http.put(`users/${this.selectedUser.id}/role`, {
        rid: this.selectedUser.rid
      });
      if (data.meta.status === 200) {
        this.$message.success('权限分配成功');
        this.setRoleDialogVisible = false;
      } else {
        this.$message.error(data.meta.msg);
      }
    }
  }
};
</script>

<style scoped>
  .box-card {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .searchBox {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .search-input {
    width: 300px;
  }
</style>
