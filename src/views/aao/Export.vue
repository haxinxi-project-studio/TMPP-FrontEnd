<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      学院：
      <a-select v-model="nowSelectCollegeId" style="width: 120px">
        <a-select-option v-for="college in collegeList" :key="college.id" :value="college.id">{{college.name}}
        </a-select-option>
      </a-select>
      &nbsp;开设院系部：
      <a-select v-model="nowTeachingDepartmentListId" style="width: 120px">
        <a-select-option v-for="teachingDepartment in teachingDepartmentList" :key="teachingDepartment.id"
                         :value="teachingDepartment.id">
          {{teachingDepartment.name}}
        </a-select-option>
      </a-select>
      &nbsp;学年：
      <a-select v-model="nowSelectYearId" @change="handleYearChange" style="width: 120px">
        <a-select-option v-for="year in yearList" :key="year" :value="year">{{year}}</a-select-option>
      </a-select>
      &nbsp;学期：
      <a-select v-model="nowSelectTermId" style="width: 120px">
        <a-select-option v-for="term in termList" :key="term" :value="term">{{term===0?'第一学期':'第二学期'}}</a-select-option>
      </a-select>
      <br/>
      <a-button :disabled="yearList.length===0" @click="exportDownBookMaterials" type="primary" icon="download"
                class="m-t-2">导出征订教材汇总表 ↓
      </a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/zhengdingjiaocaihuizongbiao.png`" alt="征订教材汇总表图片">
      <a-divider/>
      执行计划：
      <a-select v-model="nowSelectPlanId" style="width: 320px">
        <a-select-option v-for="planItem in planList" :key="planItem.id" :value="planItem.id">{{planItem.name}}
        </a-select-option>
      </a-select>
      <br/>
      <a-button :disabled="planList.length===0" @click="exportTable(1)" type="primary" icon="download" class="m-t-2">
        导出考试/考查/总体订书率表 ↓
      </a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/kaoshikaochazongtidingshulv.png`" alt="考试/考查/总体订书率图片">
      <br/>
      <a-button :disabled="planList.length===0" @click="exportTable(2)" type="primary" icon="download" class="m-t-2">
        导出出版社统计数量表 ↓
      </a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/chubanshetongjishuliangbiao.png`" alt="出版社统计数量图片">
      <br/>
      <a-button :disabled="planList.length===0" @click="exportTable(3)" type="primary" icon="download" class="m-t-2">
        导出征订教材样书汇总表 ↓
      </a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/zhengdingjiaocaiyangshuhuizongbiao.png`" alt="征订教材样书汇总图片">
      <br/>
      <a-button :disabled="planList.length===0" @click="exportTable(4)" type="primary" icon="download" class="m-t-2">
        导出教师领取教材汇总表 ↓
      </a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/jiaoshilingqujiaocaihuizongbiao.png`" alt="教师领取教材汇总图片">
      <br/>
      <a-button :disabled="planList.length===0" @click="exportTable(5)" type="primary" icon="download" class="m-t-2">
        导出学生班级领取教材反馈表 ↓
      </a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/xueshengbanjilingqujiaocaifankuibiao.png`" alt="学生班级领取教材反馈图片">
      <br/>
      <a-button :disabled="planList.length===0" @click="exportTable(6)" type="primary" icon="download" class="m-t-2">
        导出采购教材汇总表↓
      </a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/caigoujiaocaihuizongbiao.png`" alt="采购教材汇总图片">
    </div>
  </div>
</template>

<script>
  import ContentTitle from "@/components/ContentTitle";
  import {Download, Get} from "../../axios";
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
              data.name = data.year + ' 第' + (data.term ? "二" : "一") + '学期 ' + data.level + ' ' + data.department;
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
        Get(Api.getTerm + '?year=' + year)
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
        const teachingDepartmentList = this.teachingDepartmentList;
        const collegeList = this.collegeList;
        let teachingDepartmentName;
        let collegeName;
        for (let i = 0; i < teachingDepartmentList.length; i++) {
          if (teachingDepartmentList[i].id === this.nowTeachingDepartmentListId) {
            teachingDepartmentName = teachingDepartmentList[i].name;
          }
        }
        for (let i = 0; i < collegeList.length; i++) {
          if (collegeList[i].id === this.nowSelectCollegeId) {
            collegeName = collegeList[i].name;
          }
        }
        Download(Api.getDownBookMaterials + '?year=' + this.nowSelectYearId + '&college=' + this.nowSelectCollegeId + '&teachingDepartment=' + this.nowTeachingDepartmentListId + '&term=' + this.nowSelectTermId, headers => {
          return this.nowSelectYearId + "第" + (this.nowSelectTermId ? "二学期" : "一学期-") + teachingDepartmentName + "-" + collegeName + "-征订教材汇总表.xlsx";
        });
      },
      /**
       * 通用导出
       * @param which 导出哪个
       */
      exportTable(which) {
        const planId = this.nowSelectPlanId;
        let planName = this.planList.filter(p => p.id === planId).map(data => data.year + '第' + (data.term ? "二" : "一") + '学期-' + data.level + '-' + data.department + ' ')[0];
        let url = '';
        let name = planName;
        switch (which) {
          case 1:
            url = Api.getSummaryTable;
            name += '考试-考察-总体订书率表';
            break;
          case 2:
            url = Api.getPublishingHouseStatistics;
            name += '出版社统计数量表';
            break;
          case 3:
            url = Api.getSubscriptionBook;
            name += '征订教材样书统计表';
            break;
          case 4:
            url = Api.getTeacherReceivingTextbook;
            name += '教师领取教材汇总表';
            break;
          case 5:
            url = Api.getStudentTextbook;
            name += '学生班级领取教材反馈表';
            break;
          case 6:
            url = Api.getProcurementTable;
            name += '导出采购教材汇总表';
            break;
        }
        Download(url + "?execute_plan_id=" + planId, headers => {
          return name + ".xlsx";
        });
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
