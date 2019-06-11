<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
      学院：
      <a-select defaultValue="lucy" style="width: 120px">
        <a-select-option value="jack">Jack</a-select-option>
        <a-select-option value="lucy">Lucy</a-select-option>
      </a-select>
      开设院系部：
      <a-select defaultValue="lucy" style="width: 120px">
        <a-select-option value="jack">Jack</a-select-option>
        <a-select-option value="lucy">Lucy</a-select-option>
      </a-select>
      学年：
      <a-select defaultValue="lucy" style="width: 120px">
        <a-select-option value="jack">Jack</a-select-option>
        <a-select-option value="lucy">Lucy</a-select-option>
      </a-select>
      学期：
      <a-select defaultValue="lucy" style="width: 120px">
        <a-select-option value="jack">Jack</a-select-option>
        <a-select-option value="lucy">Lucy</a-select-option>
      </a-select>
      <br/>
      <a-button type="primary" icon="download" class="m-t-2">导出征订教材汇总表 ↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/zhengdingjiaocaihuizongbiao.png`" alt="征订教材汇总表图片">
      <a-divider/>
      执行计划：
      <a-select defaultValue="lucy" style="width: 320px">
        <a-select-option value="jack">2018-2019 第一学期 本科 软件学院</a-select-option>
        <a-select-option value="lucy">2018-2019 第一学期 本科 软件学院</a-select-option>
      </a-select>
      <br/>
      <a-button type="primary" icon="download" class="m-t-2">导出考试/考查/总体订书率表 ↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/kaoshikaochazongtidingshulv.png`" alt="考试/考查/总体订书率图片">
      <br/>
      <a-button type="primary" icon="download" class="m-t-2">导出出版社统计数量表 ↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/chubanshetongjishuliangbiao.png`" alt="出版社统计数量图片">
      <br/>
      <a-button type="primary" icon="download" class="m-t-2">导出征订教材样书汇总表 ↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/zhengdingjiaocaiyangshuhuizongbiao.png`" alt="征订教材样书汇总图片">
      <br/>
      <a-button type="primary" icon="download" class="m-t-2">导出教师领取教材汇总表 ↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/jiaoshilingqujiaocaihuizongbiao.png`" alt="教师领取教材汇总图片">
      <br/>
      <a-button type="primary" icon="download" class="m-t-2">导出学生班级领取教材反馈表 ↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/xueshengbanjilingqujiaocaifankuibiao.png`" alt="学生班级领取教材反馈图片">
      <br/>
      <a-button type="primary" icon="download" class="m-t-2">导出采购教材汇总表↓</a-button>
      <br/>
      <img class="m-t-2" :src="`${publicPath}export/caigoujiaocaihuizongbiao.png`" alt="采购教材汇总图片">
    </div>
  </div>
</template>

<script>
  import ContentTitle from "@/components/ContentTitle";

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
      };
    },
    methods: {},
  }
</script>

<style scoped>
  .m-t-2 {
    margin-top: 20px;
  }
</style>
