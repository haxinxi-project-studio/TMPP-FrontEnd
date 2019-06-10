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
    name: "PlanList",
    components: {ContentTitle},
    data() {
      return {
        titleInfo: {
          title: '计划列表',
          subtitle: '展示历史完成的执行计划和目前正在进的计划，并展示计划状态',
        },
      };
    },
    methods: {},
  }
</script>

<style scoped>

</style>
