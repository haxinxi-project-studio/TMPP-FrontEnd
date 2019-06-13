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
          <a href="">删除</a>&nbsp;
          <a href="">下载执行计划</a>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
  import ContentTitle from "@/components/ContentTitle";
  import {Get} from "../../axios";
  import Api from "../../api";

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
      dataIndex: 'teachingDepartment'
    },
    {
      title: '教育层次',
      dataIndex: 'educationalLevel'
    },
    {
      title: '计划创建时间',
      dataIndex: 'startTime'
    },
    {
      title: '计划完成时间',
      dataIndex: 'endTime'
    },
    {
      title: '状态',
      dataIndex: 'approvalStatus'
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
        console.log(pagination);
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
      fetch(params = {}) {
        console.log('params:', params);
        this.loading = true;
        Get(Api.getPlans)
          .do(response => {
            const pagination = {...this.pagination};
            // Read total count from server
            // pagination.total = data.totalCount;
            pagination.total = response.data.data.total;
            this.data = response.data.data.list;
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
            this.data = this.noneFilterData.filter(d => d.approvalStatus === '进行中');
            break;
          case 'done':
            this.data = this.noneFilterData.filter(d => d.approvalStatus === '已完成');
            break;
        }
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
