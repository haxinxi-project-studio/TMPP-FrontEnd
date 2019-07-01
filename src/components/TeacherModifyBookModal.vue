<template>
  <div>
    <a-form :form="form">
      <a-form-item label="课程名称：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select v-model="bookObj.courseCode" placeholder="选择课程名称">
          placeholder="选择课程名称">
          <a-select-option v-for="courseTitle in courseTitleList" :key="courseTitle.id" :value="courseTitle.courseCode">
            {{courseTitle.courseCode+'-'+courseTitle.courseName}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="是否购书：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-radio-group v-model="bookObj.bookPurchase" @change="handleByBookRadio">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <div v-if="isBuyBook">
        <a-form-item label="书号ISBN：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input-number v-model="bookObj.isbn" style="width: 200px"/>
        </a-form-item>
        <a-form-item label="教材名称：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="bookObj.textBookName"/>
        </a-form-item>
        <a-form-item label="教材类别：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-radio-group v-model="bookObj.textBookCategory">
            <a-radio value="出版">出版</a-radio>
            <a-radio value="自编">自编</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="出版社：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="bookObj.press"/>
        </a-form-item>
        <a-form-item label="作者：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="bookObj.author"/>
        </a-form-item>
        <a-form-item label="价格：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input-number style="width: 200px" :value="bookObj.unitPrice"/>
        </a-form-item>
        <a-form-item label="折扣：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select v-model="bookObj.discount">
            <a-select-option v-for="discount in discountList" placeholder="选择折扣" :key="discount.id"
                             :value="discount.discount">
              {{discount.discount}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="教师样书数量：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input-number style="width: 200px" v-model="bookObj.teacherBookNumber"/>
        </a-form-item>
        <a-form-item label="获奖信息和丛书名称：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="bookObj.awardInformation"/>
        </a-form-item>
        <a-form-item label="出版日期：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-month-picker v-model="defaultPublicationDate" @change="handlePublicationDateChange"/>
        </a-form-item>
        <a-form-item label="征订人：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="bookObj.subscriber"/>
        </a-form-item>
        <a-form-item label="联系电话：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input-number style="width: 200px" v-model="bookObj.subscriberTel"/>
        </a-form-item>
      </div>
      <div v-else>
        <a-form-item label="原因：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-textarea placeholder="输入未购买原因" :autosize="{ minRows: 2, maxRows: 6 }" v-model="bookObj.reason"/>
        </a-form-item>
      </div>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="button" @click="handleSubmit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import {Get, Patch} from "../axios";
  import Api from "../api";
  import moment from 'moment';
  import 'moment/locale/zh-cn';

  export default {
    props: ['show', 'value', 'planId'],
    name: "TeacherModifyBookModal",
    data() {
      return {
        form: this.$form.createForm(this),
        //购买图书
        isBuyBook: true,
        //图书对象
        bookObj: {},
        //折扣下拉框数据
        discountList: [],
        //目前选择的折扣
        nowSelectDiscount: null,
        //课程名称下拉框数据
        courseTitleList: [],
        //默认出版日期
        defaultPublicationDate: null
      };
    },
    methods: {
      /**
       * 处理表单提交
       * @param e event
       */
      handleSubmit(e) {
        let submitObj = {
          ...this.bookObj, isBookPurchase: this.bookObj.bookPurchase, bookId: this.bookObj.id
        };
        this.bookObj.textBookCategory === "自编" ? submitObj.textBookCategory = true : submitObj.textBookCategory = false;
        if (submitObj.isBookPurchase) {
          //买书
          submitObj.publicationDate = submitObj.publicationDate.replace("年", "-").replace("月", "");
          delete submitObj.reason;
        } else {
          submitObj = {
            isBookPurchase: submitObj.isBookPurchase,
            bookId: submitObj.bookId,
            courseCode: submitObj.courseCode,
            executePlanId: submitObj.executePlanId,
            reason: submitObj.reason
          }
        }
        console.log(submitObj);
        Patch(Api.patchPurchase)
          .withSuccessCode(204)
          .withErrorStartMsg("修改失败：")
          .withURLSearchParams(submitObj)
          .do(response => {
            this.$emit("successSave");
          })
      },
      /**
       * 是否购书选择改变
       * @param e 事件
       */
      handleByBookRadio(e) {
        this.isBuyBook = e.target.value;
      },
      handlePublicationDateChange(date, dateString) {
        this.bookObj.publicationDate = dateString;
      }
    },
    mounted() {
      this.bookObj = this.value;
      this.bookObj.executePlanId = this.planId;
      this.defaultPublicationDate = moment(this.bookObj.publicationDate, 'YYYY年MM月');
      //是否购书根据传过来的值决定
      this.isBuyBook = this.bookObj.bookPurchase;
      Get(Api.getDiscounts)
        .do(response => {
          this.discountList = response.data.data;
          this.nowSelectDiscount = this.discountList[0].discount;
        });
      Get(Api.getCourseTitles + '?execute_plan_id=' + this.planId)
        .do(response => {
          this.courseTitleList = response.data.data;
        });
    }
  }
</script>

<style scoped>

</style>
