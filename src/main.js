import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// elementui
import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css" 
Vue.use(Element)
// axios
import axios from 'axios'
import "./axios"
// markdown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)
// 权限
import "./permission"

Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
