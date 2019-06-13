import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import User from '@/user'

import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(User)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
