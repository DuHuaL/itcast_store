<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
     <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <!-- 添加按钮 -->
    <el-row class="btn">
      <el-col :span="24">
        <el-button type="success" plain @click="addRoledialog = true">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
     <el-table
      height="500"
      border
      stripe
      v-loading="loading"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="expand">
        <template slot-scope="scope">
          <!-- 显示一级权限 -->
          <el-row
            class="level1"
            v-for="item in scope.row.children"
            :key="item.id">
            <el-col :span="4">
              <el-tag
                closable
                @close="handleClose(scope.row, item)">
                {{ item.authName}}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 显示二级权限和三级 -->
              <el-row
                v-for="item1 in item.children"
                :key="item1.id">
                <!-- 显示二级 -->
                <el-col :span="4">
                  <el-tag
                    @close="handleClose(scope.row, item1)"
                    closable
                    type="success"
                    >
                    {{item1.authName}}
                  </el-tag>
                </el-col>
                <!-- 显示三级 -->
                <el-col
                  :span="20">
                  <el-tag
                    @close="handleClose(scope.row, item2)"
                    class="level3"
                    v-for="item2 in item1.children"
                    :key="item2.id"
                    closable
                    type="warning">
                    {{item2.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 如果当前角色没有权限 -->
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">
              当前角色没有权限
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            @click='handleEditDialog(scope.row)'
            size="mini"
            icon="el-icon-edit"
            type="primary"
            plain
            ></el-button>
          <el-button
            @click="handleDelete(scope.row)"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            plain
           ></el-button>
           <el-button
            size="mini"
            type="success"
            icon="el-icon-check"
            plain
            @click="handleSetRightsDialog(scope.row)"
           >
           </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出对话框分配权限 -->
    <el-dialog title="权限分配" :visible.sync="dialogSetRights">
      <el-tree
        ref="tree"
        node-key="id"
        :default-checked-keys="checkedKeys"
        :data="treeData"
        :props="defaultProps"
        show-checkbox
        default-expand-all>

      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSetRights = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRights">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoledialog">
      <el-form
        ref="addRole"
        :rules="rules"
        :model="addFormData"
        label-width="80px"
        >
        <el-form-item label="角色名称" prop="roleName">
          <el-input  v-model="addFormData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input  v-model="addFormData.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoledialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAddRoledialog">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色弹框 -->
    <el-dialog title="添加角色" :visible.sync="editRoleDialog">
      <el-form
        ref="addRole"
        v-model="addFormData"
        label-width="80px"
        >
        <el-form-item label="角色名称" prop="roleName">
          <el-input  v-model="addFormData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input  v-model="addFormData.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEditRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      loading: true,
      dialogSetRights: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中节点得id
      checkedKeys: [],
      // 点击分配权限得时候，获得角色ID
      currentRoleId: -1,
      addRoledialog: false,
      addFormData: {
        roleName: '',
        roleDesc: ''
      },
      editRoleDialog: false,
      editRoleId: -1,
      rules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 3, max: 6, message: '长度在3到8个字符', trigger: 'blur'}
        ]
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const {data: resData} = await this.$http.get('roles');
      const {data, meta} = resData;
      this.loading = false;
      if (meta.status === 200) {
        this.tableData = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    async handleClose(role, rights) {
      const {data} = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`);
      if (data.meta.status === 200) {
        // 删除成功
        this.$message.success('删除权限成功');
        // 重新绑定当前角色下的所有权限
        role.children = data.data;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 弹出分配权限得对话框
    async handleSetRightsDialog(role) {
      // 获取当前得角色id，分配权限得时候使用
      this.currentRoleId = role.id;
      this.dialogSetRights = true;
      const {data: resData} = await this.$http.get('rights/tree');
      const {data} = resData;
      this.treeData = data;
      // 获取当前角色得所有权限，获得权限得id，添加到checkedKeys数组中
      // var arr = [];
      // role.children.forEach((item1) => {
      //   // 一级权限
      //   arr.push(item1.id);
      //   // 二级权限
      //   item1.children.forEach((item2) => {
      //     arr.push(item2.id);
      //     // 三级权限
      //     item2.children.forEach((item3) => {
      //       arr.push(item3.id);
      //     });
      //   });
      // });
      // this.checkedKeys = arr;

      // 下面用递归得方式遍历
      function getcheckedKeys(children) {
        const arr = [];
        (function fn(list) {
          list.forEach((item) => {
            arr.push(item.id);
            if (item.children) {
              fn(item.children);
            }
          });
        })(children);
        return arr;
      }
      this.checkedKeys = getcheckedKeys(role.children);
    },
    async handleSetRights() {
      const arr1 = this.$refs.tree.getCheckedKeys();
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      const rightsIds = arr1.concat(arr2).join(',');
      const {data: resData} = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: rightsIds
      });
      if (resData.meta.status === 200) {
        this.$message.success('分配权限成功');
        this.dialogSetRights = false;
        // 刷新列表
        this.init();
      } else {
        this.$message.error(resData.meta.msg);
      }
    },
    // 添加角色
    async handleAddRoledialog() {
      this.$refs.addRole.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请完善信息');
        } else {
          const {data} = await this.$http.post('roles', this.addFormData);
          if (data.meta.status === 201) {
            // 提示信息
            this.$message.success('添加角色成功');
            this.addRoledialog = false;
            this.init();
          } else {
            this.$message.error(data.meta.msg);
          }
        }
      });
    },
    // 删除角色
    async handleDelete(role) {
      this.$confirm('是否删除该角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除操作
        const {data} = await this.$http.delete(`roles/${role.id}`);
        if (data.meta.status === 200) {
          this.$message.success('用户删除成功');
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
    // 编辑角色
    async handleEditDialog(role) {
      this.editRoleDialog = true;
      this.editRoleId = role.id;
      const {data} = await this.$http.get(`roles/${role.id}`);
      if (data.meta.status === 200) {
        this.addFormData = data.data;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 编辑提交修改角色
    async handleEditRole() {
      const {data} = await this.$http.put(`roles/${this.editRoleId}`, this.addFormData);
      if (data.meta.status === 200) {
        this.$message.success('角色修改成功');
        this.editRoleDialog = false;
        this.init();
        // 清空表单
        for (var key in this.addFormData) {
          this.addFormData[key] = '';
        }
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
.btn {
  margin-top: 10px;
  margin-bottom: 10px;
}
.level1{
  margin-bottom: 10px;
}

.level3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
