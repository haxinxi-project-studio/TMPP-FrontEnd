<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      <a-radio-group defaultValue="all" v-model="filterRadioGroupValue" @change="handleFilterRadioChange">
        <a-radio-button value="all">全部</a-radio-button>
        <a-radio-button value="processing">进行中</a-radio-button>
        <a-radio-button value="done">已完成</a-radio-button>
      </a-radio-group>

      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               @change="handleTableChange"
               :scroll="{ x: 1000 }"
               class="table-box"
      >
        <template slot="action" slot-scope="text">
          <a v-if="text.status==='未完成'" @click="del(text.id)">删除</a>&nbsp;
          <a @click="down(text)">下载执行计划</a>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
  import ContentTitle from "@/components/ContentTitle";
  import {Del, Download, Get} from "../../axios";
  import Api from "../../api";
  import moment from 'moment';
  import 'moment/locale/zh-cn';

  moment.locale('zh-cn');

  //表头
  const columns = [
    {
      title: '学年',
      dataIndex: 'year'
    },
    {
      title: '学期',
      dataIndex: 'term'
    },
    {
      title: '授课部门',
      dataIndex: 'department'
    },
    {
      title: '教育层次',
      dataIndex: 'level'
    },
    {
      title: '计划创建时间',
      dataIndex: 'gmtCreate'
    },
    {
      title: '计划完成时间',
      dataIndex: 'gmtModified'
    },
    {
      title: '状态',
      dataIndex: 'status'
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 155,
      scopedSlots: {customRender: 'action'}
    },
  ];

  export default {
    name: "PlanList",
    components: {ContentTitle},
    data() {
      return {
        titleInfo: {
          title: '计划列表',
          subtitle: '展示历史完成的执行计划和目前正在进的计划，并展示计划状态',
        },
        //筛选按钮值
        filterRadioGroupValue: 'all',
        //原始表格展示数据（未使用过滤按钮过滤）
        noneFilterData: [],
        //表格展示数据
        data: [],
        pagination: {
          //是否可以快速跳转至某页
          showQuickJumper: true,
          //是否可以改变 pageSize
          showSizeChanger: true,
          //默认的每页条数
          defaultPageSize: 50,
          //分页下拉框数据
          pageSizeOptions: ['10', '30', '50', '70', '100']
        },
        loading: false,
        columns,
      };
    },
    methods: {
      /**
       *
       */
      handleTableChange(pagination, filters, sorter) {
        const pager = {...this.pagination};
        pager.current = pagination.current;
        this.pagination = pager;
        this.fetch({
          results: pagination.pageSize,
          page: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters,
        });
      },
      /**
       * 表数据
       */
      fetch(params = {page: 1, results: 50}) {
        this.loading = true;
        Get(Api.getPlans + '/?page=' + params.page + '&size=' + params.results)
          .do(response => {
            const pagination = {...this.pagination};
            // Read total count from server
            // pagination.total = data.totalCount;
            pagination.total = response.data.data.total;
            this.data = response.data.data.list.map(m => {
              m.term = m.term ? "第二学期" : "第一学期";
              m.status = m.status ? "完成" : "未完成";
              m.gmtCreate = moment(m.gmtCreate).format("YYYY年MM月DD日 HH:mm:ss");
              m.gmtModified = moment(m.gmtModified).format("YYYY年MM月DD日 HH:mm:ss");
              return m;
            });
            this.pagination = pagination;
            this.noneFilterData = this.data;
          })
          .doAfter(() => {
            this.loading = false;
          });
      },
      /**
       * 过滤按钮更新
       * @param e 事件
       */
      handleFilterRadioChange(e) {
        switch (e.target.value) {
          case 'all':
            this.data = this.noneFilterData;
            break;
          case 'processing':
            this.data = this.noneFilterData.filter(d => d.status === '未完成');
            break;
          case 'done':
            this.data = this.noneFilterData.filter(d => d.status === '完成');
            break;
        }
      },
      /**
       * 下载执行计划
       * @param data 执行计划
       */
      down(data) {
        Download(Api.getDownPlan + '?executePlanId=' + data.id, headers => {
          let ext = '.xlsx';
          if (headers['content-type'] === "application/vnd.ms-excel") {
            ext = '.xls';
          }
          return data.year + data.term + data.level + data.department + '执行计划' + ext
        });
      },
      /**
       * 删除执行计划
       * @param id
       */
      del(id) {
        Del(Api.deletePlans + "?id=" + id)
          .withErrorStartMsg("删除失败：")
          .withSuccessCode(204)
          .do(response => {
            this.fetch();
          })
      }
    },
    mounted() {
      this.fetch();
    },
  }
</script>

<style scoped>
  .table-box {
    margin-top: 20px;
  }
</style>
