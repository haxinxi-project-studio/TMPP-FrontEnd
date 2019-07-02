<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      <a-button type="primary" style="margin-bottom: 20px" @click="visible=true">新增折扣</a-button>
      <a-modal title="新增折扣" :visible="visible" @ok="newDiscount" @cancel="visible=false"
               :confirmLoading="confirmLoading">
        <a-input-number :min="0" :max="1" :step="0.01" :defaultValue="discount" @change="onNewDiscountChange"/>
      </a-modal>
      <a-table :columns="columns" :dataSource="discountData" :rowKey="record => record.id" :pagination="false"
               :loading="loading"
               bordered>
        <template slot="discount" slot-scope="text, record, index">
          <div key="discount">
            <a-input v-if="record.editable" style="margin: -5px 0" :value="text"
                     @change="e => handleChange(e.target.value, record.id, 'discount')"/>
            <template v-else>{{text}}</template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <div>
            <span v-if="record.editable">
              <a @click="() => save(record.id)">保存</a>&nbsp;
              <a-popconfirm title='确定取消保存？' @confirm="() => cancel(record.id)"><a>取消</a></a-popconfirm>
            </span>
            <span v-else>
              <a @click="() => edit(record.id)">修改</a>&nbsp;
              <a @click="() => del(record.id)">删除</a>
            </span>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
  import ContentTitle from "@/components/ContentTitle";
  import {Del, Get, Patch, Post} from "../../axios";
  import Api from "../../api";

  const columns = [
    {
      title: '折扣',
      dataIndex: 'discount',
      width: '25%',
      scopedSlots: {customRender: 'discount'},
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    }
  ];

  export default {
    name: "Discount",
    components: {ContentTitle},
    data() {
      return {
        titleInfo: {
          title: '折扣管理',
          subtitle: '管理教师可以选择的折扣信息',
        },
        discountData: [],
        columns,
        visible: false,
        confirmLoading: false,
        discount: 1,
        loading: false
      };
    },
    methods: {
      /**
       * 处理更改
       * @param value
       * @param key
       * @param column
       */
      handleChange(value, key, column) {
        if (isNaN(Number(value))) {
          return;
        }
        const newData = [...this.discountData];
        const target = newData.filter(item => key === item.id)[0];
        if (target) {
          target[column] = value;
          this.discountData = newData
        }
      },
      /**
       * 修改
       * @param key
       */
      edit(key) {
        const newData = [...this.discountData];
        const target = newData.filter(item => key === item.id)[0];
        if (target) {
          target.editable = true;
          this.discountData = newData
        }
      },
      /**
       * 删除
       * @param key
       */
      del(key) {
        Del(Api.deleteDiscount + '?id=' + key)
          .withErrorStartMsg("删除失败：")
          .withSuccessCode(204)
          .do(response => {
            this.$message.success('删除成功');
            this.initData();
          })
      },
      /**
       * 修改折扣
       * @param key
       */
      save(key) {
        const newData = [...this.discountData];
        const target = newData.filter(item => key === item.id)[0];
        if (target) {
          delete target.editable;
          this.discountData = newData;
          this.cacheData = newData.map(item => ({...item}));
          Patch(Api.patchDiscount)
            .withSuccessCode(204)
            .withErrorStartMsg("修改失败：")
            .withURLSearchParams({id: target.id, discount: target.discount})
            .do(response => {
              this.$message.success('修改成功');
            })
        }
      },
      /**
       * 取消
       * @param key
       */
      cancel(key) {
        const newData = [...this.discountData];
        const target = newData.filter(item => key === item.id)[0];
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.id)[0]);
          delete target.editable;
          this.discountData = newData
        }
      },
      /**
       * 初始化数据
       */
      initData() {
        this.loading = true;
        Get(Api.getDiscounts)
          .do(response => {
            this.discountData = response.data.data;
          })
          .doAfter(() => {
            this.loading = false;
          })
      },
      /**
       * 新增折扣输入框值改变
       * @param discount 折扣数
       */
      onNewDiscountChange(discount) {
        this.discount = discount;
      },
      /**
       * 保存新的折扣
       */
      newDiscount() {
        this.confirmLoading = true;
        Post(Api.postDiscount)
          .withSuccessCode(201)
          .withErrorStartMsg("保存失败：")
          .withURLSearchParams({discount: this.discount})
          .do(response => {
            this.$message.success('保存成功');
            this.initData();
          })
          .doAfter(() => {
            this.visible = false;
            this.confirmLoading = false;
          })
      }
    },
    created() {
      this.initData();
    }
  }
</script>

<style scoped>

</style>
