import request from '@/utils/request.js';

/**
 * 获取项目列表
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function getProjectLists(param) {
    return request({
        url: '/aigid/v1/project/list',
        method: 'get',
        params: param,
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
 * @param projectId 项目id
 * @returns 返回接口数据
 */
export function getProjectDetail(projectId) {
    return request({
        url: '/aigid/v1/project/detail?projectId=' + projectId,
        method: 'get',
    })
}

/**
 * 获取组件库的类别名
 * @returns 组件库类别的id和name
 */
export function getComponentClass(){
    return request({
        url: '/aigid/v1/project/component/class/list',
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

/**
 * 保存项目
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function projectSave(params) {
    return request({
        url: '/aigid/v1/project/save',
        method: 'post',
        data: params,
    });
}

/**
 * 发起生成任务（确认生成）
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function taskGenerate(params) {
    return request({
        url: '/aigid/v1/task/generate',
        method: 'post',
        data: params,
    });
}

/**
 * 上传文件
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function uploadFile(url, params) {
    return request({
        url: url,
        method: 'put',
        data: params,
        headers: {
            'Content-Type': 'image/png'
        }
    });
}

export function uploadModelFile(url, params) {
    return request({
        url: url,
        method: 'put',
        data: params,
        headers: {
            'Content-Type': 'model/gltf-binary'
        }
    })
}

/**
 * 文件上传完成通告（确认生成）
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function fileFinish(params) {
    return request({
        url: '/aigid/v1/project/file/finish',
        method: 'post',
        data: params,
    });
}

/**
 * 文件上传完成通告（确认生成）
 * @param tid 要传的参数值
 * @returns 返回接口数据
 */
export function cancelTask(tid) {
    return request({
        url: '/aigid/v1/task/cancel?tid=' + tid,
        method: 'delete',
    });
}

/**
 * 查询任务状态详情
 * @param tid 要传的参数值
 * @returns 返回接口数据
 */
export function findTaskStatus(tid) {
    return request({
        url: '/aigid/v1/task/status?tid=' + tid,
        method: 'get',
    });
}

/**
 * 使用上次生成结果覆盖当前画布请求
 * @returns 返回接口数据
 * @param param
 */
export function fileOverwrite(param) {
    return request({
        url: '/aigid/v1/project/file/overwrite',
        method: 'post',
        params: param,
    });
}

/**
 * 取消本次生成结果
 * @returns 返回接口数据
 * @param param
 */
export function fileRelease(param) {
    return request({
        url: '/aigid/v1/project/file/release',
        method: 'post',
        params: param
    });
}

/**
 * 删除项目
 * @param params 要传的参数值 是body参数而不是params参数
 * @returns 返回接口数据
 */
export function projectDelete(params) {
    return request({
        url: '/aigid/v1/project/del',
        method: 'delete',
        data: params,
    });
}
