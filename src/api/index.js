import request from '@/utils/request.js';

/**
 * 获取项目列表
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function getProjectLists(type) {
    return request({
        url: '/aigid/v1/project/list?type=' + type,
        method: 'get'
    })
}

/**
 * 登录接口
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function userLogin(params) {
    return request({
        url: '/aigid/v1/user/login',
        method: 'post',
        data: params,
    });
}

/**
 * 创建项目接口
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function projectCreate(params) {
    return request({
        url: '/aigid/v1/project/create',
        method: 'post',
        data: params,
    });
}

/**
 * 获取功能列表
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function getFeatureLists() {
    return request({
        url: '/aigid/v1/user/feature',
        method: 'get'
    })
}

/**
 * 获取用户信息
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function getUserInfo() {
    return request({
        url: '/aigid/v1/user/info',
        method: 'get'
    })
}

/**
 * 获取风格列表（TwoGenneration页面）
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function getStyleList() {
    return request({
        url: '/aigid/v1/project/style/list',
        method: 'get'
    })
}

/**
 * 获取项目详情（TwoGenneration页面）
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function getProjectDetail(projectId) {
    return request({
        url: '/aigid/v1/project/detail?projectId=' + projectId,
        method: 'get',
    })
}

/**
 * 获取历史记录图片（TwoGenneration页面）
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function getHistoryList(id) {
    return request({
        url: '/aigid/v1/project/history/list?id=' + id,
        method: 'get',
    })
}