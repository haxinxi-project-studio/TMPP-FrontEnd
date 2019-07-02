<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      执行计划：
      <a-select v-model="nowSelectPlanId" @change="handleSelectPlanChange" style="width: 320px;margin-bottom: 15px">
        <a-select-option v-for="planItem in planList" :value="planItem.id" :key="planItem.id">{{planItem.name}}
        </a-select-option>
      </a-select>
      <a-button class="m-l-2" @click="allPass" :disabled="data.length===0">全部审核通过</a-button>
      <a-button class="m-l-2" @click="exportData" :disabled="data.length===0">导出采购教材汇总表</a-button>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               @change="handleTableChange"
               :scroll="{ x: 3240 }"
               class="table-box"
      >
        <template slot="buy" slot-scope="text">
          <a-radio-group :disabled="(text.statusCode===2||text.statusCode===4||!text.bookPurchase)"
                         :defaultValue="text.buyBook.toString()"
                         buttonStyle="solid"
                         @change="buyBook($event,text)">
            <a-radio-button value="true">是</a-radio-button>
            <a-radio-button value="false">否</a-radio-button>
          </a-radio-group>
        </template>
        <template slot="action" slot-scope="text">
          <a @click="handleRejectBook(text)"
             :disabled="(text.statusCode===2||text.statusCode===3||text.statusCode===4)">驳回</a>&nbsp;
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
  import ContentTitle from "@/components/ContentTitle";
  import {Download, Get, Post} from "../../axios";
  import Api from "../../api"
  import dayjs from 'dayjs'

  //表头
  const columns = [
    {
      title: '课程代码',
      dataIndex: 'courseCode',
      width: 200,
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      width: 200,
    },
    {
      title: '书号ISBN',
      dataIndex: 'isbn'
    },
    {
      title: '教材名称',
      dataIndex: 'textBookName',
      width: 200,
    },
    {
      title: '教材类别',
      dataIndex: 'textBookCategory',
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
      dataIndex: 'subscriberTel',
      width: 200,
    },
    {
      title: '未购书原因',
      dataIndex: 'reason',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 160,
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
       * @param obj 某条书籍
       */
      handleRejectBook(obj) {
        Post(Api.postTurnDown)
          .withSuccessCode(201)
          .withURLSearchParams({id: obj.id})
          .do(response => {
            this.fetch();
          })
      },
      /**
       *
       * @param pagination
       * @param filters
       * @param sorter
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
       *
       * @param params
       */
      fetch(params = {}) {
        this.loading = true;
        Get(Api.getMyReview + '?executePlanId=' + this.nowSelectPlanId + '&page=1&size=50')
          .do(response => {
            const pagination = {...this.pagination};
            pagination.total = response.data.data.total;
            this.data = response.data.data.list.filter(d => {
              d.publicationDate = dayjs(d.publicationDate).format("YYYY年MM月");
              if (d.textBookCategory === true || d.textBookCategory === false) {
                d.textBookCategory = d.textBookCategory ? "自编" : "出版";
              }
              d.statusCode = d.status;
              switch (d.status) {
                //（0：未审核，1：办公室主任审核通过，2：教务处审核通过，3：办公室主任驳回，4：教务处驳回）
                case 1:
                  d.status = "办公室主任审核通过";
                  break;
                case 2:
                  d.status = "教务处审核通过";
                  break;
                case 3:
                  d.status = "办公室主任驳回";
                  break;
                case 4:
                  d.status = "教务处驳回";
                  break;
                default :
                  d.status = "未审核";
              }

              if (!d.bookPurchase) {
                d.publicationDate = null;
              }
              return d;
            });
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
            if (response.data.data.length === 0) {
              this.$notification.info({
                message: '没有未完成的执行计划',
                description: '目前没有未完成的执行计划，请添加执行计划或刷新页面后再试！',
              });
            }
            this.planList = response.data.data.map(data => {
              data.name = data.year + ' 第' + (data.term ? "二" : "一") + '学期 ' + data.level + ' ' + data.department;
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
          .withErrorStartMsg("失败：")
          .withSuccessCode(201)
          .withURLSearchParams({executePlanId: this.nowSelectPlanId})
          .do(response => {
            this.$message.success(response.data.msg);
            this.initPlanList();
          })
      },
      /**
       * 导出表格
       */
      exportData() {
        const plan = this.planList.filter(plan => plan.id === this.nowSelectPlanId)[0];
        Download(Api.getProcurementTable + "?execute_plan_id=" + this.nowSelectPlanId, headers => {
          return plan.year + ' 第' + (plan.term ? "二" : "一") + '学期 ' + plan.level + ' ' + plan.department + "采购教材汇总表.xlsx";
        })
      },
      /**
       * 教务处购买样书
       * @param e 事件
       * @param obj 对象
       */
      buyBook(e, obj) {
        Post(Api.postBuySampleBook)
          .withSuccessCode(201)
          .withURLSearchParams({bookId: obj.id, isBuyBook: e.target.value})
          .do(response => {
            this.$message.success("操作成功");
          })
      },
      /**
       * 处理执行计划选择改变
       */
      handleSelectPlanChange() {
        this.fetch();
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
