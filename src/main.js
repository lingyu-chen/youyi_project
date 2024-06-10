import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
//引入VueRouter
import VueRouter from 'vue-router';
//引入路由器
import router from './router'
//引入fabric
import { fabric } from 'fabric';

Vue.config.productionTip = false

Vue.use(ElementUI);
//应用vue-router
Vue.use(VueRouter);
//应用fabric
Vue.use(fabric);

new Vue({
    render: h => h(App),
    beforeCreate() {
        Vue.prototype.$bus = this; //全局事件总线
    },
    router,
}).$mount('#app')