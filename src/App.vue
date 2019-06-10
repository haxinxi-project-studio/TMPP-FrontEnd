<template>
  <a-layout style="height: 100%">
    <a-layout-sider
      :trigger="null"
      collapsible
      v-model="collapsed"
    >
      <div class="logo-box">
        <img class="logo" :src="`${publicPath}logo.png`" alt="logo img"/>
      </div>
      <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['3']">
        <a-menu-item key="1">
          <a-icon type="plus"/>
          <span>新增计划</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="profile"/>
          <span>我的审核</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="align-left"/>
          <span>计划列表</span>
        </a-menu-item>
        <a-menu-item key="4">
          <a-icon type="download"/>
          <span>导出表格</span>
        </a-menu-item>
        <a-menu-item key="5">
          <a-icon type="edit"/>
          <span>折扣管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
        <a-dropdown class="user-btn">
          <a class="ant-dropdown-link">
            {{loginUser}}
            <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">注销登录</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        Content
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
  export default {
    name: 'App',
    data: () => ({
      publicPath: process.env.BASE_URL,
      //关闭菜单栏
      collapsed: false,
      //登录用户
      loginUser: "教务处：舒露"
    }),
  }
</script>

<style scoped>
  /*调整菜单栏开关按钮位置*/
  .trigger {
    padding: 20px;
  }

  /*logo盒子*/
  .logo-box {
    padding: 0 10px;
    line-height: 64px;
    height: 64px;
    overflow: hidden;
  }

  .logo-box img {
    width: 180px;
  }

  /*用户操作按钮*/
  .user-btn {
    padding-right: 24px;
    float: right;
  }
</style>

<style>

</style>
