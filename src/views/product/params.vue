<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="分类参数"></my-breadcrumb>
    <!-- 警告信息 -->
    <el-alert
      class="alert"
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      show-icon
      :closable="false">
    </el-alert>
    <!-- 分类参数下拉框 -->
    <el-row>
      <el-col :span="3" class="title">请选择分类参数:</el-col>
      <el-col :span="21">
        <el-cascader
          expand-trigger="hover"
          :options="options"
          v-model="selectedOptions"
          :props="defaultProps"
          :show-all-levels="false"
          @change="handleChange">
        </el-cascader>
      </el-col>
    </el-row>
    <!-- tab栏 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="small" :disabled="isDisabled" class="btn">添加动态参数</el-button>
        <el-table
          border
          :data="dynamicstableData"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row.params"
                :key="index"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, index)">
                {{ item }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            width="40">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="商品参数"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" plain icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-button type="primary" size="small" :disabled="isDisabled" class="btn">添加静态参数</el-button>
        <el-table
          height="400"
          border
          :data="statictableData"
          style="width: 100%">
          <el-table-column
            type="index"
            width="40">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="属性名称"
            width="300">
          </el-table-column>
          <el-table-column
            prop="attr_vals"
            label="属性值"
            width="500">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" plain icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: [],
      activeName: 'many',
      dynamicstableData: [],
      statictableData: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      isDisabled: true,
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const {data: {data, meta}} = await this.$http.get('categories?type=3');
      if (meta.status === 200) {
        this.options = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 加载表格的数据
    async loadTableData() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择三级分类');
        return;
      }
      const {data: {data, meta: {status}}} = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${this.activeName}`);
      if (this.activeName === 'many') {
        if (status === 200) {
          this.dynamicstableData = data;
          // 把动态参数中的attr_vals转化成数组
          // 在动态参数对象上增加一个属性, 记录数组 params
          this.dynamicstableData.forEach((item) => {
            const arr = item.params = item.attr_vals.trim().split(',').length === 0 ? [] : item.attr_vals.trim().split(',');
            // 动态添加的成员，在数据绑定的时候会出现问题
            // 处理方法如下
            this.$set(item, 'params', arr);
          });
        }
      } else {
        this.statictableData = data;
      }
    },
    handleChange() {
      // 如果下拉框里选择三级分类时，添加按钮可用
      if (this.selectedOptions.length === 3) {
        this.isDisabled = false;
        this.loadTableData();
      } else {
        // 否则不可用
        this.isDisabled = true;
      }
    },
    handleClick() {
      this.loadTableData();
    },
    // 点击标签的删除按钮，删除当前的标签
    async handleClose(row, index) {
      // 界面上的处理
      row.params.splice(index, 1);
      // 发送请求前准备数据
      // 两个id
      const catId = row.cat_id;
      const attrId = row.attr_id;
      const putData = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.params.join(',')
      };
      // 让数据一致
      row.attr_vals = row.params.join(',');
      const {data: {meta: {status}}} = await this.$http.put(`categories/${catId}/attributes/${attrId}`, putData);
      if (status === 200) {
        this.$message.success('更新成功');
      }
    },
    async handleInputConfirm(row) {
      if (this.inputValue.length === 0) {
        return;
      }
      row.params.push(this.inputValue);
      // 清空文本框
      this.inputValue = '';
      this.inputVisible = false;
      // 准备发送请求时的数据
      const catId = row.cat_id;
      const attrId = row.attr_id;
      const putData = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.params.join(',')
      };
      // 让数据一致
      row.attr_vals = row.params.join(',');
      const {data} = await this.$http.put(`categories/${catId}/attributes/${attrId}`, putData);
      console.log(data);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  }
};
</script>

<style scoped>
  .alert {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .el-col-3 {
    margin-top: 8px;
    width: 10%;
  }
  .tabs {
    margin-top: 15px;
  }
  .btn {
    margin-bottom: 15px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
