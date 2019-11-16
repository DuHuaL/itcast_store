import { defaults } from 'autoprefixer';
<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
    <el-alert
      class="alert"
      :closable="false"
      title="添加商品信息"
      type="info"
      center
      show-icon>
    </el-alert>
    <!-- 步骤条 -->
    <el-steps
      :active="active - 0"
      finish-status="success"
      align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-form ref="form" :model="form" label-width="100px" label-position="top" style="height: 500px; overflow: auto">
      <el-tabs tab-position="left" class="tabs" v-model="active" @tab-click="handleTabClick">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称">
            <el-input style="width: 800px" v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input style="width: 800px" v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input style="width: 800px" v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input style="width: 800px" v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              :props="defaultProps"
              @change="handlechange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item
            v-for="item in dynamicsParams"
            :key="item.attr_id"
            :label="item.attr_name">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                :label="val"
                v-for="val in item.attr_vals"
                :key="val">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item
            :label="item.attr_name"
            v-for="item in staticParams"
            :key="item.attr_id">
            <el-input style="width: 800px" v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-form-item>
            <!-- action的路径必须是全路径
            此处必须携带token -->
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="tokenHeader">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <el-button type="primary" @click="handleAdd">添加商品</el-button>
          <quillEditor v-model="form.goods_introduce"></quillEditor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
// 导入富文本框
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import { quillEditor } from 'vue-quill-editor';
export default {
  data() {
    return {
      active: '0',
      form: {
        goods_name: '',
        goods_weight: '',
        goods_number: '',
        goods_price: '',
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        arrts: []
      },
      options: [],
      selectedOptions: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      checkList: [],
      // 动态数据
      dynamicsParams: [],
      // 静态数据
      staticParams: [],
      // 上传图片时设置token
      tokenHeader: {
        'Authorization': sessionStorage.getItem('token')
      }
    };
  },
  created() {
    this.loadOptions();
  },
  components: {
    quillEditor
  },
  methods: {
    async handleAdd() {
      // 准备数据
      this.form.goods_cat = this.selectedOptions.join(',');
      // 所有的分类参数 this.dynamicsParams(动态参数) this.staticParams(静态参数)
      const arr1 = this.dynamicsParams.map((item) => {
        item.attr_vals = item.attr_vals.join(',');
        return {attr_id: item.attr_id, attr_value: item.attr_vals};
      });
      const arr2 = this.staticParams.map((item) => {
        return {attr_id: item.attr_id, attr_value: item.attr_vals};
      });
      // 合并数组
      this.form.attrs = [...arr1, ...arr2];
      // 发送请求
      const {data: {meta: {status, msg}}} = await this.$http.post('goods', this.form);
      if (status === 201) {
        this.$message.success('添加商品成功');
        this.$router.push({
          name: 'goods'
        });
      } else {
        this.$message.error(msg);
      }
    },
    // 加载层级下拉框的数据
    async loadOptions() {
      const {data} = await this.$http.get('categories?type=3');
      if (data.meta.status === 200) {
        this.options = data.data;
      }
    },
    // 层级下拉框发生变化的时候出发
    handlechange() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择三级分类');
        this.selectedOptions = [];
      }
    },
    // tab切换时执行
    async handleTabClick() {
      // 判断tab栏是否是 商品参数或商品属性
      if (this.active === '1' || this.active === '2') {
        // 如果没有选中三级分类，告诉用户选择三级分类
        if (this.selectedOptions.length !== 3) {
          this.$message.error('请选择商品的三级分类');
          return;
        }
      }
      // 根据当前tab栏点击的是商品参数还是商品属性发送请求
      const sel = this.active === '1' ? 'many' : 'only';
      const {data} = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`);
      if (this.active === '1') {
        if (data.meta.status === 200) {
          this.dynamicsParams = data.data;
          // 把拿到的attr_vals的数据格式改成数组
          this.dynamicsParams.forEach((item) => {
            item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',');
          });
        }
      } else {
        // 静态参数赋值
        this.staticParams = data.data;
      }
    },
    // 上传图片
    // 删除图片
    handleRemove(file) {
      // file.response
      // console.log(file);
      // pics数组中的图片移除
      // 根据路径找到删除对象的索引
      const index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(index, 1);
    },
    // 上传成功
    handleSuccess(response) {
      // console.log(response);
      const {meta, data} = response;
      if (meta.status === 200) {
        // 图片上传成功
        this.$message.success('图片上传成功');
        this.form.pics.push({
          pic: data.tmp_path
        });
      } else {
        this.$$message.error(meta.msg);
      }
    }
  }
};
</script>

<style scoped>
  .alert{
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .tabs {
    margin-top: 20px;
  }
</style>
