<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      <a-table :columns="columns" :dataSource="discountData" :rowKey="record => record.id" :pagination="pagination"
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
  import {Del, Get} from "../../axios";
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
        pagination: {
          //是否可以快速跳转至某页
          showQuickJumper: true,
          //是否可以改变 pageSize
          showSizeChanger: true,
          //默认的每页条数
          defaultPageSize: 50,
          //分页下拉框数据
          pageSizeOptions: ['10', '30', '50', '70', '100']
        }
      };
    },
    methods: {
      handleChange(value, key, column) {
        const newData = [...this.discountData];
        const target = newData.filter(item => key === item.id)[0];
        if (target) {
          target[column] = value;
          this.discountData = newData
        }
      },
      edit(key) {
        const newData = [...this.discountData];
        const target = newData.filter(item => key === item.id)[0];
        if (target) {
          target.editable = true;
          this.discountData = newData
        }
      },
      del(key) {
        console.log(key);
        Del(Api.deleteDiscount + '?id=' + key)
          .withSuccessCode(204)
          .do(response => {
            console.log(response);
          })
      },
      save(key) {
        const newData = [...this.discountData];
        const target = newData.filter(item => key === item.id)[0];
        if (target) {
          delete target.editable;
          this.discountData = newData;
          this.cacheData = newData.map(item => ({...item}));

        }
      },
      cancel(key) {
        const newData = [...this.discountData];
        const target = newData.filter(item => key === item.id)[0];
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.id)[0]);
          delete target.editable;
          this.discountData = newData
        }
      },
      initData() {
        Get(Api.getDiscounts)
          .do(response => {
            console.log(response.data.data);
            this.discountData = response.data.data.list;
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
