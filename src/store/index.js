import Vuex from 'vuex'
import Vue from 'vue'

import mutations from "@/store/mutations";
import actions from "@/store/actions";
import getters from '@/store/getters'

//安装插件，执行它的install方法
Vue.use(Vuex)

//创建对象
const store = new Vuex.Store({
  state: {
    cartList: []
  },
  mutations,
  actions,
  getters,
  modules: {

  }
})

//导出store独享
export default store
