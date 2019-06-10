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
    name: "Discount",
    components: {ContentTitle},
    data() {
      return {
        titleInfo: {
          title: '折扣管理',
          subtitle: '管理教师可以选择的折扣信息',
        },
      };
    },
    methods: {},
  }
</script>

<style scoped>

</style>
