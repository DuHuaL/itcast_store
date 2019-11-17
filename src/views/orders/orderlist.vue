<template>
  <el-card class="box-card">
    <my-breadcrumb level1="订单管理" level2="订单列表"></my-breadcrumb>
    <!-- 表格 -->
    <el-table
      class="table"
      height="550"
      border
      stripe
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="180">
      </el-table-column>
      <el-table-column
        prop="order_pay"
        label="是否付款"
        width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay === '0'" type="danger">未付款</el-tag>
          <el-tag v-else-if="scope.row.order_pay === '1'" type="success">已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货"
        width="180">
      </el-table-column>
      <el-table-column
        label="下单时间">
        <template slot-scope="scope">
           {{ scope.row.create_time | fomDate('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" plain @click="orderEditDialog = true"></el-button>
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
    <!-- 编辑弹框 -->
    <el-dialog title="收货地址" :visible.sync="orderEditDialog">
      <el-form :model="form" label-position="left">
        <el-form-item label="省市区/县" label-width="80px">
          <el-cascader
            style="width: 500px"
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="80px">
          <el-input v-model="form.address" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleOrderEdit">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 导入数据模块
import data from './city_data2017_element.js';
export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: -1,
      orderEditDialog: false,
      form: {
        address: ''
      },
      options: [],
      selectedOptions: []
    };
  },
  created() {
    this.options = data;
    this.loadData();
  },
  methods: {
    async loadData() {
      const {data: {data, meta: {status}}} = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      if (status === 200) {
        this.total = data.total;
        this.tableData = data.goods;
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    },
    handleChange() {},
    async handleOrderEdit() {
      console.log(this.selectedOptions);
      const {data} = await this.$http.put(`orders/${this.tableData.order_id}`);
      console.log(data);
    }
  }
};
</script>

<style scoped>
  .table{
    margin-top: 15px;
  }
</style>
