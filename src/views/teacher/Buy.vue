<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      执行计划：
      <a-select v-model="nowSelectPlanId" style="width: 320px;margin-bottom: 15px">
        <a-select-option v-for="planItem in planList" :value="planItem.id">{{planItem.name}}</a-select-option>
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
          <a @click="handleEditBook(text)">修改</a>&nbsp;
        </template>
      </a-table>
    </div>
    <a-modal title="修改" :width="750" :maskClosable="false" :footer="null" v-model="isModalVisible"
             @cancel="handleModalCancel">
      <teacher-modify-book-modal v-if="isModalVisible" v-model="editObj"/>
    </a-modal>
  </div>
</template>

<script>
  import ContentTitle from "@/components/ContentTitle";
  import TeacherModifyBookModal from "@/components/TeacherModifyBookModal";
  import {Get} from "../../axios";
  import Api from "../../api";
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
       *
       * @param params
       */
      fetch(params = {}) {
        console.log('params:', params);
        Get(Api.getPurchaseBook + '/' + this.nowSelectPlanId + '?page=1&size=50')
          .do(response => {
            const pagination = {...this.pagination};
            // Read total count from server
            // pagination.total = data.totalCount;
            pagination.total = response.data.data.total;
            this.loading = false;
            this.data = response.data.data.list;
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
              data.name = data.year + ' 第' + data.term + '学期 ' + data.educationalLevel + ' ' + data.teachingDepartment;
              return data;
            });
            this.nowSelectPlanId = this.planList[0].id;
          })
          .doAfter(() => {
            this.fetch();
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
