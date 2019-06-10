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
    name: "Export",
    components: {ContentTitle},
    data() {
      return {
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

</style>
