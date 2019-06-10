import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: '/plan_list'
        },
        {
            path: '/plan_list',
            name: 'planList',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "planList" */ './views/aao/PlanList.vue')
        },
        {
            path: '/new_plan',
            name: 'newPlan',
            component: () => import(/* webpackChunkName: "newPlan" */ './views/aao/NewPlan.vue')
        },
        {
            path: "*",
            redirect: "/"
        }
    ]
})
