import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld';
import Header from '../components/header/Header';
import Test from '../components/test/Test.vue';
import Topics from '../components/Topics';
Vue.use(Router);

export function createRouter() {
    const router = new Router({
        mode:'history',
        routes: [{
            path: '/',
            component: Header
        }, {
            path: '/test',
            component: Test
        },{
            path: '/about',
            component: () => import('../components/About.vue')
        },{
           path: '/topics',
           component:Topics
        }]
    })
    return router;
}
