<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      学院：
      <a-select v-model="nowSelectCollegeId" style="width: 120px">
        <a-select-option v-for="college in collegeList" :value="college.id">{{college.name}}</a-select-option>
      </a-select>
      &nbsp;开设院系部：
      <a-select v-model="nowTeachingDepartmentListId" style="width: 120px">
        <a-select-option v-for="teachingDepartment in teachingDepartmentList" :value="teachingDepartment.id">
          {{teachingDepartment.name}}
        </a-select-option>
      </a-select>
      &nbsp;学年：
      <a-select v-model="nowSelectYearId" @change="handleYearChange" style="width: 120px">
        <a-select-option v-for="year in yearList" :value="year">{{year}}</a-select-option>
      </a-select>
      &nbsp;学期：
      <a-select v-model="nowSelectTermId" style="width: 120px">
        <a-select-option v-for="term in termList" :value="term">{{term}}</a-select-option>
      </a-select>
      <br/>
      <a-button @click="exportDownBookMaterials" type="primary" icon="download" class="m-t-2">导出征订教材汇总表 ↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/zhengdingjiaocaihuizongbiao.png`" alt="征订教材汇总表图片">
      <a-divider/>
      执行计划：
      <a-select v-model="nowSelectPlanId" style="width: 320px">
        <a-select-option v-for="planItem in planList" :value="planItem.id">{{planItem.name}}</a-select-option>
      </a-select>
      <br/>
      <a-button @click="exportTable(1)" type="primary" icon="download" class="m-t-2">导出考试/考查/总体订书率表 ↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/kaoshikaochazongtidingshulv.png`" alt="考试/考查/总体订书率图片">
      <br/>
      <a-button @click="exportTable(2)" type="primary" icon="download" class="m-t-2">导出出版社统计数量表 ↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/chubanshetongjishuliangbiao.png`" alt="出版社统计数量图片">
      <br/>
      <a-button @click="exportTable(3)" type="primary" icon="download" class="m-t-2">导出征订教材样书汇总表 ↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/zhengdingjiaocaiyangshuhuizongbiao.png`" alt="征订教材样书汇总图片">
      <br/>
      <a-button @click="exportTable(4)" type="primary" icon="download" class="m-t-2">导出教师领取教材汇总表 ↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/jiaoshilingqujiaocaihuizongbiao.png`" alt="教师领取教材汇总图片">
      <br/>
      <a-button @click="exportTable(5)" type="primary" icon="download" class="m-t-2">导出学生班级领取教材反馈表 ↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/xueshengbanjilingqujiaocaifankuibiao.png`" alt="学生班级领取教材反馈图片">
      <br/>
      <a-button @click="exportTable(6)" type="primary" icon="download" class="m-t-2">导出采购教材汇总表↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/caigoujiaocaihuizongbiao.png`" alt="采购教材汇总图片">
    </div>
  </div>
</template>

<script>
  import ContentTitle from "@/components/ContentTitle";
  import {Get} from "../../axios";
  import Api from "../../api";

  export default {
    name: "Export",
    components: {ContentTitle},
    data() {
      return {
        publicPath: process.env.BASE_URL,
        titleInfo: {
          title: '导出表格',
          subtitle: '导出计划相关的表格',
        },
        //执行计划下拉框数据
        planList: [],
        //目前选择的执行计划ID
        nowSelectPlanId: '',
        //学院下拉框数据
        collegeList: [],
        //目前选择的学院ID
        nowSelectCollegeId: '',
        //学年下拉框数据
        yearList: [],
        //目前选择的学年ID
        nowSelectYearId: '',
        //学期下拉框数据
        termList: [],
        //目前选择的学期ID
        nowSelectTermId: '',
        //开设院系部下拉框数据
        teachingDepartmentList: [],
        //目前选择的开设院系部ID
        nowTeachingDepartmentListId: '',
      };
    },
    methods: {
      /**
       * 初始化数据
       */
      initData() {
        //获取已完成执行计划
        Get(Api.getDonePlan)
          .do(response => {
            this.planList = response.data.data.map(data => {
              data.name = data.year + ' 第' + data.term + '学期 ' + data.educationalLevel + ' ' + data.teachingDepartment;
              return data;
            });
            this.nowSelectPlanId = this.planList[0].id;
          });
        //获取所有学院
        Get(Api.getColleges)
          .do(response => {
            this.collegeList = response.data.data;
            this.nowSelectCollegeId = this.collegeList[0].id;
          });
        //获取开设院系部
        Get(Api.getTeachingDepartments)
          .do(response => {
            this.teachingDepartmentList = response.data.data;
            this.nowTeachingDepartmentListId = this.teachingDepartmentList[0].id;
          });
        //获取学年
        Get(Api.getYear)
          .do(response => {
            this.yearList = response.data.data;
            this.nowSelectYearId = this.yearList[0];
          })
          .doAfter(() => {
            this.getTerm(this.nowSelectYearId);
          })
      },
      /**
       * 根据学年获取有哪些学期
       * @param year 学年
       */
      getTerm(year) {
        //TODO 删除？id
        Get(Api.getTerm + '/?id' + year)
          .do(response => {
            this.termList = response.data.data;
            this.nowSelectTermId = this.termList[0];
          })
      },
      /**
       * 处理学年更新
       * @param v 新值
       */
      handleYearChange(v) {
        this.getTerm(v);
      },
      /**
       * 导出征订教材汇总表
       */
      exportDownBookMaterials() {
        window.open(Api.getDownBookMaterials + '?year=' + this.nowSelectYearId + '&college=' + this.nowSelectCollegeId + '&teachingDepartment=' + this.nowTeachingDepartmentListId + '&term=' + this.nowSelectTermId);
      },
      /**
       * 通用导出
       * @param which 导出哪个
       */
      exportTable(which) {
        const planId = this.nowSelectPlanId;
        let url = '';
        switch (which) {
          case 1:
            url = Api.getSummaryTable;
            break;
          case 2:
            url = Api.getPublishingHouseStatistics;
            break;
          case 3:
            url = Api.getSubscriptionBook;
            break;
          case 4:
            url = Api.getTeacherReceivingTextbook;
            break;
          case 5:
            url = Api.getStudentTextbook;
            break;
          case 6:
            url = Api.getProcurementTable;
            break;
        }
        window.open(url + '/' + planId);
      }
    },
    created() {
      this.initData();
    }
  }
</script>

<style scoped>
  .m-t-2 {
    margin-top: 20px;
  }
</style>
