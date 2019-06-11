<template>
  <div>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="课程名称：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select v-model="bookObj.courseCode" placeholder="选择课程名称">
          <a-select-option value="male">
            male
          </a-select-option>
          <a-select-option value="female">
            female
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="是否购书：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-radio-group :defaultValue="isBuyBook" @change="handleByBookRadio">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <div v-if="isBuyBook">
        <a-form-item label="书号ISBN：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input-number v-model="bookObj.isbn" style="width: 200px"/>
        </a-form-item>
        <a-form-item label="教材名称：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="bookObj.textbookName"/>
        </a-form-item>
        <a-form-item label="教材类别：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-radio-group :defaultValue="1">
            <a-radio :value="1">出版</a-radio>
            <a-radio :value="2">自编</a-radio>
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
          <a-select v-model="bookObj.discount" placeholder="选择折扣">
            <a-select-option value="male">
              1
            </a-select-option>
            <a-select-option value="female">
              0.7
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
          <a-month-picker/>
        </a-form-item>
        <a-form-item label="征订人：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="bookObj.subscriber"/>
        </a-form-item>
        <a-form-item label="联系电话：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input-number style="width: 200px" v-model="bookObj.subscriberNumber"/>
        </a-form-item>
      </div>
      <div v-else>
        <a-form-item label="原因：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-textarea placeholder="输入未购买原因" :autosize="{ minRows: 2, maxRows: 6 }" v-model="bookObj.reason"/>
        </a-form-item>
      </div>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  export default {
    props: ['show', 'value'],
    name: "TeacherModifyBookModal",
    data() {
      return {
        form: this.$form.createForm(this),
        //购买图书
        isBuyBook: true,
        //图书对象
        bookObj: {}
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
          }
        });
      },
      /**
       * 是否购书选择改变
       * @param e 事件
       */
      handleByBookRadio(e) {
        this.isBuyBook = e.target.value;
      }
    },
    mounted() {
      this.bookObj = this.value;
      //是否购书根据传过来的值决定
      this.isBuyBook = this.value.isBookPurchase !== 0;
    }
  }
</script>

<style scoped>

</style>
