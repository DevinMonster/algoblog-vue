import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: JSON.parse(sessionStorage.getItem("userInfo"))
  },
  mutations: { // setter
    SET_TOKEN: (state, token) => {
      state.token = token;
      localStorage.setItem("token", token);
    },
    SET_USER_INFO: (state, info) => {
      state.userInfo = info;
      // 一次会话
      sessionStorage.setItem("userInfo", JSON.stringify(info));
    },
    REMOVE_INFO: (state, token) => {
      state.token = '';
      state.userInfo = {};
      localStorage.setItem("token", '');
      sessionStorage.setItem("userInfo", JSON.stringify('{}'));
    },

  },
  getters: { // getter
    getUser: state => {
      return state.userInfo
    }
  },
  actions: {
  },
  modules: {
  }
})
