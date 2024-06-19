//该文件用于创建整个应用的路由器
import VueRouter from "vue-router";

import Login from '../components/Login'
import Home from '../components/Home'
import Index from '../components/Index'
import Generation from '../components/TwoDGeneration'
import CanvasTest from '../components/CanvasTest'
import CanvasTestTwo from '../components/CanvasTestTwo'

//创建并暴露一个路由器
export default new VueRouter({
    routes: [{
            path: '/login',
            name: 'Login',
            component: Login,
        },
        {
            path: '/home',
            name: 'Home',
            component: Home,
            children: [{
                    path: '', // 这里设置默认路径，将展示第一个子路由
                    component: Index
                }, {
                    path: 'index',
                    name: 'Index',
                    component: Index,
                },
                {
                    path: 'generation',
                    name: 'Generation',
                    component: Generation
                },
                // {
                //     path: 'generation/:type',
                //     name: 'Generation',
                //     component: Generation
                // },
            ]
        },
        {
            path: '/canvasTest',
            name: 'CanvasTest',
            component: CanvasTest
        },
        {
            path: '/canvasTestTwo',
            name: 'CanvasTestTwo',
            component: CanvasTestTwo
        }

    ]
})