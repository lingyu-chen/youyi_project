import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import { Session } from './storage';

// 配置新建一个 axios 实例
const service = axios.create({
    baseURL: 'http://116.62.112.11:8081',
    //  baseURL: 'http://localhost:8081',
    timeout: 50000,
    headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么 token
        if (Session.get('token')) {
            config.headers['Authorization'] = `${Session.get('token')}`;
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        const res = response.data;
        if (res.code == 2) {
            // `token` 过期或者账号已在别处登录
            Session.clear(); // 清除浏览器全部临时缓存
            // router.push('/login');
            window.location.href = '#/login'; // 去登录页
            MessageBox.alert('你已被登出，请重新登录', '提示', {})

            return Promise.reject(service.interceptors.response);
        } else {
            if (res.code == 0)
                return response.data;
            else if (res.code == null) {
                return response;
            } else {
                MessageBox.alert("123", res.msg);
                return Promise.reject(service.interceptors.response);
            }

        }
    },
    (error) => {
        // 对响应错误做点什么
        if (error.message.indexOf('timeout') != -1) {
            Message.error('网络超时');
        } else if (error.message == 'Network Error') {
            Message.error('网络连接错误');
        } else {
            if (error.response.data) Message.error(error.response.statusText);
            else Message.error('接口路径找不到');
        }
        return Promise.reject(error);
    }
);

// 导出 axios 实例
export default service;