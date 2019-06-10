import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            //TODO 根据角色重定向路径
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
            path: '/export',
            name: 'export',
            component: () => import(/* webpackChunkName: "export" */ './views/aao/Export.vue')
        },
        {
            path: '/discount',
            name: 'discount',
            component: () => import(/* webpackChunkName: "discount" */ './views/aao/Discount.vue')
        },
        {
            path: '/buy',
            name: 'buy',
            component: () => import(/* webpackChunkName: "buy" */ './views/teacher/Buy.vue')
        },
        {
            path: '/add',
            name: 'add',
            component: () => import(/* webpackChunkName: "add" */ './views/teacher/Add.vue')
        },
        {
            path: '/review',
            name: 'review',
            component: () => import(/* webpackChunkName: "review" */ './views/Review.vue')
        },
        {
            path: "*",
            redirect: "/"
        }
    ]
})
