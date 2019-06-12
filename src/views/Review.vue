<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      执行计划：
      <a-select v-model="nowSelectPlanId" style="width: 320px;margin-bottom: 15px">
        <a-select-option v-for="planItem in planList" :value="planItem.id">{{planItem.name}}</a-select-option>
      </a-select>
      <a-button class="m-l-2" @click="allPass">全部审核通过</a-button>
      <a-button class="m-l-2" @click="exportData">{{exportBtnValue}}</a-button>
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
            <a-button>是</a-button>
            <a-button>否</a-button>
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
  import {Get, Post} from "../axios";
  import Api from "../api"
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
          subtitle: '填写购书信息表单',
        },
        //执行计划下拉框数据
        planList: [],
        //目前选择的执行计划ID
        nowSelectPlanId: '',
        //导出表格按钮值
        exportBtnValue: '',
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
      handleRejectBook(obj) {

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

        const json = {
          "code": 200,
          "msg": "查询成功",
          "data": {
            "pageNum": 1,
            "pageSize": 2,
            "size": 5,
            "orderBy": null,
            "startRow": 1,
            "endRow": 5,
            "total": 11,
            "pages": 3,
            "list": [
              {
                "id": "1",
                "courseCode": "B001",
                "courseTitle": 1,
                "isbn": "9789993700142",
                "textbookName": "阿里技术参考图册",
                "textbookCategory": "出版",
                "press": "清华大学出版社",
                "author": "某某",
                "unitPrice": 15.00,
                "teacherBookNumber": 1,
                "discount": 0.76,
                "awardInformation": "获奖信息",
                "publicationDate": "2018-09",
                "subscriber": "周老师",
                "subscriberNumber": "17645532255",
                "approvalStatus": "审核通过"
              },
              {
                "id": "2",
                "courseCode": "B001",
                "courseTitle": 1,
                "isbn": "9789993700142",
                "textbookName": "阿里技术参考图册",
                "textbookCategory": "出版",
                "press": "清华大学出版社",
                "author": "某某",
                "unitPrice": 15.00,
                "teacherBookNumber": 1,
                "discount": 0.76,
                "awardInformation": "获奖信息",
                "publicationDate": "2018-09",
                "subscriber": "周老师",
                "subscriberNumber": "17645532255",
                "approvalStatus": "审核通过"
              }],
            "prePage": 0,
            "nextPage": 2,
            "isFirstPage": true,
            "isLastPage": false,
            "hasPreviousPage": false,
            "hasNextPage": true,
            "navigatePages": 8,
            "navigatepageNums": [
              1,
              2,
              3
            ],
            "navigateFirstPage": 1,
            "navigateLastPage": 3,
            "firstPage": 1,
            "lastPage": 3
          }
        };

        const pagination = {...this.pagination};
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = json.data.total;
        this.loading = false;
        this.data = json.data.list;
        this.pagination = pagination;
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
        //TODO 根据用户角色
        //window.open()
      }
    },
    created() {
      console.log('created');
      //TODO 根据用户角色判断显示
      this.exportBtnValue = '导出征订教材计划统计表';
      this.exportBtnValue = '导出采购教材汇总表';
      let user = true;
      //确保只添加一次
      if (user && this.columns.filter(o => o.key === 'buy').length === 0) {
        this.columns.splice(columns.length - 1, 0, {
          title: '购买样书',
          key: 'buy',
          width: 125,
          fixed: 'right',
          scopedSlots: {customRender: 'buy'}
        });
      }
      this.initPlanList();
    },
    mounted() {
      this.fetch();
    },
  }
</script>

<style scoped>
  .m-l-2 {
    margin-left: 12px;
  }
</style>
