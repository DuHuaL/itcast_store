<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
    <!-- 添加分类按钮 -->
    <el-row class="btn">
      <el-col :span="24">
        <el-button type="success" plain="">添加分类</el-button>
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
          <el-button type="primary" icon="el-icon-edit" plain="" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain="" size="mini"></el-button>
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
      total: 0
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
      this.pagenum = val;
      this.loadData();
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
