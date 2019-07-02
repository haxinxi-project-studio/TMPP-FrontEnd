<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      执行计划：
      <a-select v-model="nowSelectPlanId" @change="onPlanSelectChange" style="width: 320px;margin-bottom: 15px">
        <a-select-option v-for="planItem in planList" :key="planItem.id" :value="planItem.id">{{planItem.name}}
        </a-select-option>
      </a-select>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               @change="handleTableChange"
               :scroll="{ x: 3000 }"
               class="table-box"
      >
        <template slot="action" slot-scope="text">
          <a @click="handleEditBook(text)" :disabled="(text.statusCode===1||text.statusCode===2||text.statusCode===4)">修改</a>&nbsp;
        </template>
      </a-table>
    </div>
    <a-modal title="修改" :width="750" :maskClosable="false" :footer="null" v-model="isModalVisible"
             @cancel="handleModalCancel">
      <teacher-modify-book-modal v-if="isModalVisible" v-model="editObj" :planId="nowSelectPlanId"
                                 @successSave="onEditOk"/>
    </a-modal>
  </div>
</template>

<script>
  import ContentTitle from "@/components/ContentTitle";
  import TeacherModifyBookModal from "@/components/TeacherModifyBookModal";
  import {Get} from "../../axios";
  import Api from "../../api";
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
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      scopedSlots: {customRender: 'action'}
    },
  ];

  export default {
    name: "Buy",
    components: {TeacherModifyBookModal, ContentTitle},
    data() {
      return {
        titleInfo: {
          title: '我的购书',
          subtitle: '显示购书相关信息',
        },
        //显示模态框
        isModalVisible: false,
        //修改的图书对象
        editObj: {},
        //表格展示数据
        data: [],
        //执行计划下拉框数据
        planList: [],
        //目前选择的执行计划ID
        nowSelectPlanId: '',
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
      fetch(params = {page: 1, results: 50}) {
        Get(Api.getPurchaseBook + '/' + this.nowSelectPlanId + '?page=' + params.page + '&size=' + params.results)
          .do(response => {
            const pagination = {...this.pagination};
            // Read total count from server
            // pagination.total = data.totalCount;
            pagination.total = response.data.data.total;
            this.loading = false;
            this.data = response.data.data.list.map(d => {
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
          });
      },
      /**
       * 处理修改按钮
       * @param obj 条目对象
       */
      handleEditBook(obj) {
        this.editObj = obj;
        this.isModalVisible = true;
      },
      /**
       * 处理模态框关闭回调
       * @param e 事件
       */
      handleModalCancel(e) {
        this.editObj = {};
      },
      /**
       * 初始化数据
       */
      initData() {
        this.loading = true;
        Get(Api.getUndonePlan)
          .do(response => {
            this.planList = response.data.data.map(data => {
              data.name = data.year + ' 第' + (data.term ? "二" : "一") + '学期 ' + data.level + ' ' + data.department;
              return data;
            });
            this.nowSelectPlanId = this.planList[0].id;
          })
          .doAfter(() => {
            if (this.planList.length === 0) {
              this.loading = false;
              this.$notification.info({
                message: '没有未完成的执行计划',
                description: '目前没有未完成的执行计划，请等待教务处添加执行计划或刷新页面后再试！',
              });
            } else {
              this.fetch();
            }
          })
      },
      onPlanSelectChange() {
        this.loading = true;
        this.fetch();
      },
      onEditOk() {
        this.isModalVisible = false;
        this.loading = true;
        this.fetch();
      }
    },
    created() {
      this.initData();
    }
  }
</script>

<style scoped>

</style>
