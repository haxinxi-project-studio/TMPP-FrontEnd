<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="执行计划：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select v-model="nowSelectPlanId" @change="handlePlanChange" placeholder="选择执行计划">
            <a-select-option v-for="planItem in planList" :key="planItem.id" :value="planItem.id">{{planItem.name}}</a-select-option>
          </a-select>
          <a href="">下载该执行计划</a>
        </a-form-item>
        <a-form-item label="课程名称：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select v-decorator="['courseCode',{rules: [{ required: true, message: '请选择课程名称！' }]}]"
                    placeholder="选择课程名称">
            <a-select-option v-for="courseTitle in courseTitleList" :key="courseTitle.id" :value="courseTitle.id">
              {{courseTitle.courseCode+'-'+courseTitle.courseTitle}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否购书：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-radio-group v-model="submitForm.bookPurchase" @change="handleByBookRadio">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <div v-if="isBuyBook">
          <a-form-item label="书号ISBN：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number style="width: 200px"
                            v-decorator="['isbn',{rules: [{ required: true, message: '请输入正确的书号ISBN!',validator:valueMustThan0Validator }]}]"/>
          </a-form-item>
          <a-form-item label="教材名称：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input v-decorator="['textBookName',{rules: [{ required: true, message: '请输入教材名称!' }]}]"/>
          </a-form-item>
          <a-form-item label="教材类别：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-radio-group v-model="submitForm.textBookCategory">
              <a-radio :value="0">出版</a-radio>
              <a-radio :value="1">自编</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="出版社：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input v-decorator="['press',{rules: [{ required: true, message: '请输入出版社!' }]}]"/>
          </a-form-item>
          <a-form-item label="作者：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input v-decorator="['author',{rules: [{ required: true, message: '请输入作者!' }]}]"/>
          </a-form-item>
          <a-form-item label="单价：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number style="width: 200px"
                            v-decorator="['unitPrice',{rules: [{ required: true, message: '请输入正确的价格!',validator:valueMustThan0Validator }]}]"/>
          </a-form-item>
          <a-form-item label="折扣：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-select v-model="nowSelectDiscountId">
              <a-select-option v-for="discount in discountList" :key="discount.id" :value="discount.id">{{discount.discount}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="教师样书数量：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number style="width: 200px"
                            v-decorator="['teacherBookNumber',{rules: [{ required: true, message: '请输入正确的教师样书数量!',validator:valueMustThan0Validator }]}]"/>
          </a-form-item>
          <a-form-item label="获奖信息和丛书名称：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input v-decorator="['awardInformation',{rules: [{ required: true, message: '请输入获奖信息和丛书名称!' }]}]"/>
          </a-form-item>
          <a-form-item label="出版日期：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-month-picker @change="handlePublicationDateChange" :defaultValue="defaultPublicationDate"/>
          </a-form-item>
          <a-form-item label="征订人：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input v-decorator="['subscriber',{rules: [{ required: true, message: '请输入征订人!' }]}]"/>
          </a-form-item>
          <a-form-item label="联系电话：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number style="width: 200px"
                            v-decorator="['subscriberNumber',{rules: [{ required: true, message: '请输入正确的联系电话!',len:11 ,transform:value=>value.toString()}]}]"/>
          </a-form-item>
        </div>
        <div v-else>
          <a-form-item label="原因：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-textarea placeholder="输入未购买原因"
                        :autosize="{ minRows: 2, maxRows: 6 }"
                        v-decorator="['reason',{rules: [{ required: true, message: '请输入未购买原因!' }]}]"/>
          </a-form-item>
        </div>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
  import ContentTitle from "@/components/ContentTitle";
  import {Get, Post} from "../../axios";
  import Api from "../../api";
  import moment from 'moment';
  import 'moment/locale/zh-cn';

  moment.locale('zh-cn');

  export default {
    name: "Add",
    components: {ContentTitle},
    data() {
      return {
        form: this.$form.createForm(this),
        titleInfo: {
          title: '填写购书信息',
          subtitle: '填写购书信息表单',
        },
        //购买图书
        isBuyBook: true,
        //执行计划下拉框数据
        planList: [],
        //目前选择的执行计划ID
        nowSelectPlanId: '',
        //课程名称下拉框数据
        courseTitleList: [],
        //目前选择的课程名称ID
        nowSelectCourseTitleId: '',
        //折扣下拉框数据
        discountList: [],
        //目前选择的折扣ID
        nowSelectDiscountId: '',
        submitForm: {
          //教材类别
          textBookCategory: 0,
          //是否购书
          bookPurchase: true,
          //出版日期
          publicationDate: '2019-01'
        },
        //默认出版日期
        defaultPublicationDate: moment('2019-01', 'YYYY-MM')
      };
    },
    methods: {
      /**
       * 处理表单提交
       * @param e event
       */
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            const s = this.submitForm;
            this.submitForm = {...s, ...values, discountId: this.nowSelectDiscountId};
            Post(Api.postBookPurchaseInformation)
              .withSuccessCode(201)
              .withURLSearchParams(this.submitForm)
              .do(response => {
                console.log(response);
              })
          }
        });
      },
      /**
       * 是否购书选择改变
       * @param e 事件
       */
      handleByBookRadio(e) {
        this.isBuyBook = e.target.value;
      },
      /**
       * 初始化数据
       */
      initData() {
        Get(Api.getUndonePlan)
          .do(response => {
            this.planList = response.data.data.map(data => {
              data.name = data.year + ' 第' + data.term + '学期 ' + data.educationalLevel + ' ' + data.teachingDepartment;
              return data;
            });
            this.nowSelectPlanId = this.planList[0].id;
          })
          .doAfter(() => {
            this.initCourseTitles(this.nowSelectPlanId);
          });
        Get(Api.getDiscounts)
          .do(response => {
            this.discountList = response.data.data;
            this.nowSelectDiscountId = this.discountList[0].id;
          })
      },
      /**
       * 初始化课程名称数据
       * @param planId 执行计划ID
       */
      initCourseTitles(planId) {
        Get(Api.getCourseTitles + '/' + planId)
          .do(response => {
            this.courseTitleList = response.data.data;
            this.nowSelectCourseTitleId = this.courseTitleList[0].id
          })
      },
      /**
       * 处理执行计划下拉改变
       * @param id 执行计划ID
       */
      handlePlanChange(id) {
        this.initCourseTitles(id);
      },
      /**
       * 处理出版日期更新
       * @param date {moment}
       * @param dateString 日期
       */
      handlePublicationDateChange(date, dateString) {
        this.submitForm.publicationDate = dateString;
      },
      /**
       * 数值必须大于0校验
       * @param rule 校验规则
       * @param value 值
       * @param callback 回调
       */
      valueMustThan0Validator(rule, value, callback) {
        if (value < 1) {
          callback(value);
        } else {
          callback();
        }
      }
    },
    created() {
      this.initData();
    }
  }
</script>

<style scoped>

</style>
