//该文件用于创建vuex中最为核心的store

import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
//应用vuex
Vue.use(Vuex);
//准备actions--用于响应组件中的动作
const actions = {}
    //准备mutations--用于操作数据（state）
const mutations = {
        UPDATEPROJECTNAME(state, value) {
            state.projectNameState = value;
        },
        GETMAINHEIGHT(state, value) {
            state.mainHeight = value;
        },
        GETMENUHEIGHT(state, value) {
            state.menuHeight = value;
        },

    }
    //准备state--用于存储数据
const state = {
    projectNameState: '', //项目详情页的项目名称
    mainHeight: 0, //el-main的高度
    menuHeight: 0, //el-menu所占据的空间高度包括margin-top
}

//创建并暴露store
export default new Vuex.Store({
    actions,
    mutations,
    state,
})