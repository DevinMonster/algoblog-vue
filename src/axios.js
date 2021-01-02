import axios from 'axios'
import Element from 'element-ui'
import store from './store'
import router from './router'

axios.defaults.baseURL="http://localhost:8081/"

// 前置拦截
axios.interceptors.request.use(config => {
    return config;
})

// 后置拦截
axios.interceptors.response.use(response => {
    let res = response.data;
    // console.log(res.code);
    if (res.code === 200) return response;
    Element.Message.error(res.message);
    // 在用户错误区间内
    if (res.code >= 10000 && res.code < 20000) {
        store.commit("REMOVE_INFO");
        router.push("/login");
    }

    return Promise.reject(res.message);
})
