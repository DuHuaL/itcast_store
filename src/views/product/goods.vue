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
         <el-button type="success" plain @click="$router.push({name: 'goodsadd'})">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      height="500"
      stripe
      border
      v-loading="loading"
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
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="handleEditGoodsDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="handleDeleteGoods(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 编辑商品弹框 -->
    <el-dialog title="修改商品" :visible.sync="EditGoodsdialog">
      <el-form :model="form">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.goods_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input v-model="form.goods_price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" :label-width="formLabelWidth">
          <el-input v-model="form.goods_number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" :label-width="formLabelWidth">
          <el-input v-model="form.goods_weight" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-cascader
            expand-trigger="hover"
            :options="options"
            :props="defaultProps"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EditGoodsdialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEditGoods">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      form: {},
      formLabelWidth: '100',
      EditGoodsdialog: false,
      selectedOptions: [],
      options: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const {data} = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      if (data.meta.status === 200) {
        this.tableData = data.data.goods;
        this.total = data.data.total;
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    },
    // 删除商品
    async handleDeleteGoods(goodsId) {
      const {data} = await this.$http.delete(`goods/${goodsId}`);
      if (data.meta.status === 200) {
        this.$message.success('商品删除成功');
        this.loadData();
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 编辑商品
    handleEditGoodsDialog(good) {
      this.EditGoodsdialog = true;
      this.form = good;
      this.loadOptions();
    },
    // 修改提交商品
    async handleEditGoods() {
      const {data: {meta: {status, msg}}} = await this.$http.put(`goods/${this.form.goods_id}`, {
        goods_name: this.form.goods_name,
        goods_price: this.form.goods_price,
        goods_weight: this.form.goods_weight,
        goods_number: this.form.goods_number
      });
      if (status === 200) {
        this.$message.success('商品修改成功');
        this.loadData();
        this.EditGoodsdialog = false;
      } else {
        this.$message.error(msg);
      }
    },
    // 层级下来事件
    handleChange() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择三级分类');
        this.selectedOptions = [];
      }
    },
    // 加载层级下拉框的数据
    async loadOptions() {
      const {data} = await this.$http.get('categories?type=3');
      if (data.meta.status === 200) {
        this.options = data.data;
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
