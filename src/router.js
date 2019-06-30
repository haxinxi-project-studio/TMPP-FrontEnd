import Vue from 'vue'
import Router from 'vue-router'
import Vuex from './store'
import {CAS_LOGIN_URL} from "./api";

Vue.use(Router)

let router = new Router({
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
            component: () => import(/* webpackChunkName: "review" */ './views/aao/Review.vue')
        },
        {
            path: '/office_review',
            name: 'officeReview',
            component: () => import(/* webpackChunkName: "officeReview" */ './views/om/Review.vue')
        },
        {
            path: '/token/:id',
            name: 'token',
            component: () => import(/* webpackChunkName: "planList" */ './views/aao/PlanList.vue'),
            beforeEnter: (to, from, next) => {
                window.localStorage.setItem('authorization_token', to.params.id);
                window.location.href = window.location.protocol + '//' + window.location.host;
                next(false);
            }
        },
        {
            path: "*",
            redirect: "/"
        }
    ]
});
//T 教师  A 教务处  O 办公室主任
const A = ['plan_list', 'new_plan', 'export', 'discount', 'review'];
const O = ['office_review'];
const T = ['buy', 'add'];

/**
 * 检查用户是否有当前路由权限
 * @param path 路径
 * @returns {boolean} 是否有权限
 */
function havePermission(path) {
    const p = path.replace(/[^a-zA-Z_]/g, '');
    switch (Vue.prototype.$user.loginUser.userType) {
        //教务处
        case 'A':
            return A.includes(p);
        //办公室主任
        case 'O':
            return O.includes(p);
        //教师
        case 'T':
            return T.includes(p);
    }
}

/***
 * 跳转到用户正确的路径
 * @param next 路由回调
 */
function route2TruePath(next) {
    if (Vue.prototype.$user.user_is_office_manager) {
        next('/office_review');
    } else if (Vue.prototype.$user.user_is_teacher) {
        next('/buy');
    } else if (Vue.prototype.$user.user_is_aao) {
        next('/plan_list');
    } else {
        next(false);
    }
}

/**
 * 路由全局守卫
 * 1.如果Url以'/token'开头，放行
 * 2.如果localStorage中last_path key 有值则放弃当前路由跳至last_path路径
 */
router.beforeEach((to, from, next) => {
    if (!to.path.startsWith('/token') && window.localStorage.getItem('authorization_token') == null) {
        window.location.href = CAS_LOGIN_URL;
        return;
    }
    if (to.path.startsWith('/token')) {
        next();
        return;
    }
    if (!havePermission(to.path)) {
        route2TruePath(next);
        return;
    }
    let path = window.localStorage.getItem('last_path');
    if (path !== null) {
        window.localStorage.removeItem('last_path');
        next(path);
    } else {
        next();
    }
});
/***
 * 全局后置钩子
 */
router.afterEach((to, from) => {
    Vuex.state.now_path = to.path;
});

export default router;
