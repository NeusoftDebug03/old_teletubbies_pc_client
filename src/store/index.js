import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new 

Vuex.Store({
  state: {
    num: 0,
  },
  mutations: {
    changeNum(state, data) {
      // 设置购物车状态
      state.num = data;
    },
  },
  actions: {},
  modules: {},
})
