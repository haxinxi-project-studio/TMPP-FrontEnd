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
    name: "NewPlan",
    components: {ContentTitle},
    data: () => ({
      titleInfo: {
        title: '新增计划',
        subtitle: '新增一个教材执行计划'
      }
    }),
  }
</script>

<style scoped>

</style>
