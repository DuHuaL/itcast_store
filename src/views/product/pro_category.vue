<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
    <!-- 添加分类按钮 -->
    <el-row class="btn">
      <el-col :span="24">
        <el-button type="success" plain @click="handleShowAdd">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
     <el-table
      height="473"
      :data="tableData"
      style="width: 100%"
      border
      stripe
      v-loading="loading">
      <!-- <el-table-column
        prop="cat_name"
        label="分类名称"
        width="180">
      </el-table-column> -->
      <el-tree-grid
        label="分类名称"
        prop="cat_name"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        :indentSize="20">

      </el-tree-grid>
      <el-table-column
        label="级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level == 0">一级</span>
          <span v-else-if="scope.row.cat_level == 1">二级</span>
          <span v-else-if="scope.row.cat_level == 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_deleted"
        label="是否有效">
        <template slot-scope="scope">
          <span>{{scope.row.cat_deleted ? '无效': '有效'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain="" size="mini" @click="handleOpenEdit(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain="" size="mini" @click="handleDelete(scope.row.cat_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[8, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="addGoodsDialog">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="分类名称" >
          <el-input style="width: 300px" v-model="formData.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader
            placeholder="默认添加一级分类"
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            :props="defaultProps"
            clearable
            change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGoodsDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="editGoodsDialog">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="分类名称" >
          <el-input style="width: 300px" v-model="formData.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 导入tree-column组件
import ElTreeGrid from 'element-tree-grid';
export default {
  data() {
    return {
      tableData: [],
      loading: true,
      pagenum: 1,
      pagesize: 8,
      total: 0,
      addGoodsDialog: false,
      formData: {
        cat_pid: -1,
        cat_name: '',
        cat_level: 0
      },
      // 选中项的id
      selectedOptions: [],
      options: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      editGoodsDialog: false
    };
  },
  components: {
    'el-tree-grid': ElTreeGrid
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const {data: resData} = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      this.total = resData.data.total;
      this.tableData = resData.data.result;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.loading = true;
      this.pagenum = val;
      this.loadData();
    },
    // 弹出添加商品的对话框，并获取层级数据
    async handleShowAdd() {
      this.addGoodsDialog = true;
      const {data} = await this.$http.get('categories?type=2');
      this.options = data.data;
    },
    // 提交添加的分类
    async handleAdd() {
      // 给cat_pid和cat_level赋值
      // 如果级联下拉框没有选中 cat_pid = 0
      // 如果级联下拉框选中一级 cat_pid = selectOptions[0]
      // 如果级联下拉框选中二级分类 cat_pid = selectOptions[1]
      if (this.selectedOptions.length === 0) {
        this.formData.cat_pid = 0;
      } else if (this.selectedOptions.length === 1) {
        this.formData.cat_pid = this.selectedOptions[0];
      } else if (this.selectedOptions.length === 2) {
        this.formData.cat_pid = this.selectedOptions[1];
      }
      this.formData.cat_level = this.selectedOptions.length;
      // 发送请求添加数据
      const {data} = await this.$http.post('categories', this.formData);
      if (data.meta.status === 201) {
        this.$message.success('商品添加成功');
        this.addGoodsDialog = false;
        this.loadData();
        // 清空表单内容
        for (var key in this.formData) {
          this.formData[key] = '';
        }
        this.selectedOptions = [];
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 删除分类
    async handleDelete(catId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data} = await this.$http.delete(`categories/${catId}`);
        if (data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.loadData();
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
    // 打开编辑对话框
    handleOpenEdit(cat) {
      this.editGoodsDialog = true;
      this.formData.cat_name = cat.cat_name;
      this.formData.cat_id = cat.cat_id;
    },
    // 编辑提交分类
    async handleEdit() {
      const {data} = await this.$http.put(`categories/${this.formData.cat_id}`, {
        cat_name: this.formData.cat_name
      });
      if (data.meta.status === 200) {
        this.$message.success('分类修改成功');
        this.loadData();
        this.editGoodsDialog = false;
      } else {
        this.$message.error(data.meta.msg);
      }
    }
  }
};
</script>

<style>
.btn {
  margin-top: 10px;
  margin-bottom: 10px;
}
.pagination {
  margin-top: 10px;
}
</style>
