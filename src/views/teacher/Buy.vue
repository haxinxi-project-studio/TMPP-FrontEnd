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
    name: "Buy",
    components: {ContentTitle},
    data() {
      return {
        titleInfo: {
          title: '我的购书',
          subtitle: '显示购书相关信息',
        },
      };
    },
    methods: {},
  }
</script>

<style scoped>

</style>
