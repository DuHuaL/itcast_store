<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="search">
      <el-col :span="6">
        <el-input placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">
         <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      height="560"
      stripe
      border
      :data="tableData"
      style="width: 100%"
      class="table">
      <el-table-column
        type="index"
        >
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="500">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goods_number"
        label="商品数量"
        width="80">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="80">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间">
        <template slot-scope="scope">
          {{scope.row.add_time | fomDate('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const {data} = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      if (data.meta.status === 200) {
        this.tableData = data.data.goods;
      }
    }
  }
};
</script>

<style>
.search {
  margin-top: 10px;
}
.table {
  margin-top: 10px;
}
</style>
