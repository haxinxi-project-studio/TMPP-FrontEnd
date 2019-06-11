<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      执行计划：
      <a-select defaultValue="lucy" style="width: 320px;margin-bottom: 15px">
        <a-select-option value="jack">2018-2019 第一学期 本科 软件学院</a-select-option>
        <a-select-option value="lucy">2018-2019 第一学期 本科 软件学院</a-select-option>
      </a-select>
      <a-table :columns="columns"
               :rowKey="record => record.id"
               :dataSource="data"
               :pagination="pagination"
               :loading="loading"
               @change="handleTableChange"
               :scroll="{ x: 2000 }"
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
                "subscriberNumber": "13333333333",
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
                "subscriberNumber": "13333333333",
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
      }
    },
    mounted() {
      this.fetch();
    },
  }
</script>

<style scoped>

</style>
