<template>
  <a-locale-provider :locale="locale">
    <a-layout style="height: 100%">
      <a-layout-sider
        :trigger="null"
        collapsible
        v-model="collapsed"
      >
        <div class="logo-box">
          <img class="logo" :src="`${publicPath}logo.png`" alt="logo img"/>
        </div>
        <a-menu theme="dark" mode="inline" v-model="selectedMenuKeys">
          <a-menu-item key="new_plan" @click="pushRouter('/new_plan')" v-if="this.$user.user_is_aao">
            <a-icon type="plus"/>
            <span>新增计划</span>
          </a-menu-item>
          <a-menu-item key="review" @click="pushRouter('/review')" v-if="this.$user.user_is_aao">
            <a-icon type="profile"/>
            <span>我的审核</span>
          </a-menu-item>
          <a-menu-item key="plan_list" @click="pushRouter('/plan_list')" v-if="this.$user.user_is_aao">
            <a-icon type="align-left"/>
            <span>计划列表</span>
          </a-menu-item>
          <a-menu-item key="export" @click="pushRouter('/export')" v-if="this.$user.user_is_aao">
            <a-icon type="download"/>
            <span>导出表格</span>
          </a-menu-item>
          <a-menu-item key="discount" @click="pushRouter('/discount')" v-if="this.$user.user_is_aao">
            <a-icon type="edit"/>
            <span>折扣管理</span>
          </a-menu-item>
          <!--START：只有办公室主任角色才显示-->
          <a-menu-item key="office_review" @click="pushRouter('/office_review')"
                       v-if="this.$user.user_is_office_manager">
            <a-icon type="profile"/>
            <span>我的审核</span>
          </a-menu-item>
          <!--END：只有办公室主任角色才显示-->
          <!--START：只有教师角色才显示-->
          <a-menu-item key="buy" @click="pushRouter('/buy')" v-if="this.$user.user_is_teacher">
            <a-icon type="profile"/>
            <span>我的购书</span>
          </a-menu-item>
          <a-menu-item key="add" @click="pushRouter('/add')" v-if="this.$user.user_is_teacher">
            <a-icon type="edit"/>
            <span>填写购书信息</span>
          </a-menu-item>
          <!--END：只有教师角色才显示-->
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
                <a @click="logout">注销登录</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-layout-header>
        <a-layout-content>
          <router-view/>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-locale-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import {CAS_LOGOUT_URL} from "./api"

  export default {
    name: 'App',
    data: () => ({
      publicPath: process.env.BASE_URL,
      locale: zhCN,
      //关闭菜单栏
      collapsed: false,
      //登录用户
      loginUser: '',
      //当前选中菜单
      selectedMenuKeys: ['plan_list'],
    }),
    methods: {
      /**
       * 更改路由
       * @param path 路由路径
       */
      pushRouter(path) {
        this.$router.push(path);
      },
      /**
       * 注销登录
       */
      logout() {
        window.localStorage.removeItem('authorization_token');
        window.location.href = CAS_LOGOUT_URL;
      }
    },
    created() {
      this.$store.watch((state, getters) => state.now_path, (value, oldValue) => {
        this.selectedMenuKeys = [value.replace(/[^a-zA-Z_]/g, '')];
      });
      this.loginUser = this.$user.userTypeName() + '：' + this.$user.loginName;
    }
  }
</script>

<style scoped>
  /*调整菜单栏开关按钮位置和鼠标样式*/
  .trigger {
    padding: 20px;
    cursor: pointer;
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
  /*内容*/
  .content-style {
    margin: 24px 16px;
    padding: 24px;
    background: #fff;
    min-height: 280px;
  }
</style>
