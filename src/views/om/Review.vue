<template>
  <div>
    <content-title :title="titleInfo.title" :subtitle="titleInfo.subtitle"/>
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
          subtitle: '审核教师提供的购书信息',
        },
      }
    }
  }
</script>

<style scoped>

</style>
