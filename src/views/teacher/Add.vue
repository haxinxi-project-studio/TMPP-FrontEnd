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
    name: "Add",
    components: {ContentTitle},
    data() {
      return {
        titleInfo: {
          title: '填写购书信息',
          subtitle: '填写购书信息表单',
        },
      };
    },
    methods: {},
  }
</script>

<style scoped>

</style>
