<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      执行计划：
      <a-select v-model="nowSelectPlanId" style="width: 320px;margin-bottom: 15px">
        <a-select-option v-for="planItem in planList" :value="planItem.id">{{planItem.name}}</a-select-option>
      </a-select>
      <a-button class="m-l-2" @click="allPass">全部审核通过</a-button>
      <a-button class="m-l-2" @click="exportData">导出采购教材汇总表</a-button>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               @change="handleTableChange"
               :scroll="{ x: 3000 }"
               class="table-box"
      >
        <template slot="buy" slot-scope="text">
          <a-button-group>
            <a-button @click="buyBook(true)">是</a-button>
            <a-button @click="buyBook(false)">否</a-button>
          </a-button-group>
        </template>
        <template slot="action" slot-scope="text">
          <a @click="handleRejectBook(text)">驳回</a>&nbsp;
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
  import ContentTitle from "@/components/ContentTitle";
  import {Get, Post} from "../../axios";
  import Api from "../../api"
  //表头
  const columns = [
    {
      title: '课程代码',
      dataIndex: 'courseCode',
      width: 200,
    },
    {
      title: '课程名称',
      dataIndex: 'courseTitle',
      width: 200,
    },
    {
      title: '书号ISBN',
      dataIndex: 'isbn'
    },
    {
      title: '教材名称',
      dataIndex: 'textbookName',
      width: 200,
    },
    {
      title: '教材类别',
      dataIndex: 'textbookCategory',
      width: 200,
    },
    {
      title: '出版社',
      dataIndex: 'press',
      width: 200,
    },
    {
      title: '作者',
      dataIndex: 'author',
      width: 200,
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 200,
    },
    {
      title: '教师样书数量',
      dataIndex: 'teacherBookNumber',
      width: 200,
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      width: 200,
    },
    {
      title: '获奖信息和丛书名称',
      dataIndex: 'awardInformation',
      width: 300,
    },
    {
      title: '出版日期',
      dataIndex: 'publicationDate',
      width: 200,
    },
    {
      title: '征订人',
      dataIndex: 'subscriber',
      width: 200,
    },
    {
      title: '联系电话',
      dataIndex: 'subscriberNumber',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'approvalStatus',
      width: 100,
      fixed: 'right',
    },
    {
      title: '购买样书',
      key: 'buy',
      width: 125,
      fixed: 'right',
      scopedSlots: {customRender: 'buy'}
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      scopedSlots: {customRender: 'action'}
    },
  ];

  export default {
    name: "Review",
    components: {ContentTitle},
    data() {
      return {
        titleInfo: {
          title: '我的审核',
          subtitle: '对办公室主任审核通过的书籍进行审核',
        },
        //执行计划下拉框数据
        planList: [],
        //目前选择的执行计划ID
        nowSelectPlanId: '',
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
       * 驳回处理
       */
      handleRejectBook(obj) {
        console.log(obj);
        Post(Api.postTurnDown)
          .withSuccessCode(201)
          .withURLSearchParams({id: obj.id})
          .do(response => {
            console.log(response);
          })
      },
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
      fetch(params = {}) {
        console.log('params:', params);
        this.loading = true;
        Get(Api.getMyReview + '/' + this.nowSelectPlanId + '?page=1&size=50')
          .do(response => {
            const pagination = {...this.pagination};
            pagination.total = response.data.data.total;
            this.data = response.data.data.list;
            this.pagination = pagination;
          })
          .doAfter(() => {
            this.loading = false;
          });
      },
      /**
       * 初始化执行计划下拉数据
       */
      initPlanList() {
        Get(Api.getUndonePlan)
          .do(response => {
            this.planList = response.data.data.map(data => {
              data.name = data.year + ' 第' + data.term + '学期 ' + data.educationalLevel + ' ' + data.teachingDepartment;
              return data;
            });
            this.nowSelectPlanId = this.planList[0].id;
          })
          .doAfter(() => {
            this.fetch();
          })
      },
      /**
       * 一键审核通过
       */
      allPass() {
        Post(Api.postExaminationPassed)
          .withSuccessCode(201)
          .withURLSearchParams({planId: this.nowSelectPlanId})
          .do(response => {
            console.log(response)
          })
      },
      /**
       * 导出表格
       */
      exportData() {
        window.open(Api.getExportPurchaseTeachingMaterialsSummaryTable);
      },
      /**
       * 教务处购买样书
       * @param isBuy 是否买
       */
      buyBook(isBuy) {
        Post(Api.postBuySampleBook)
          .withSuccessCode(201)
          .withURLSearchParams({id: this.nowSelectPlanId, isBuyBook: isBuy})
          .do(response => {
            console.log(response);
          })
      }
    },
    created() {
      this.initPlanList();
    }
  }
</script>

<style scoped>
  .m-l-2 {
    margin-left: 12px;
  }
</style>
