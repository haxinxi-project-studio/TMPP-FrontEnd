<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
    <div class="content-style">
    </div>
  </div>
</template>

<script>
  import ContentTitle from "@/components/ContentTitle";

  export default {
    name: "Review",
    components: {ContentTitle},
    data() {
      return {
        titleInfo: {
          title: '我的审核',
          subtitle: '填写购书信息表单',
        },
      };
    },
    methods: {},
  }
</script>

<style scoped>

</style>
