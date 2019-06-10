<template>
  <div class="title-info">
    <h1>{{title}}</h1>
    <h2>{{subtitle}}</h2>
  </div>
</template>

<script>
  export default {
    props: ['title', 'subtitle'],
    name: "ContentTitle"
  }
</script>

<style scoped>
  /*内容标题*/
  .title-info {
    padding: 24px;
    width: 100%;
    background-color: #fff;
    height: 110px;
    border-top: 1px solid rgba(233, 233, 233, 1);
  }

  h1 {
    font-weight: 600;
    font-style: normal;
    font-size: 20px;
  }

  h2 {
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
  }
</style>
