import Vuex from 'vuex'
import Vue from 'vue'

//安装插件，执行它的install方法
Vue.use(Vuex)

//创建对象
const store = new Vuex.Store({
  state: {

  },
  actions: {

  },
  mutations: {
    //方法，在其他组件中调用方法，只需要commit('方法名'),就可以实现了
  },
  getters: {

  },
  modules: {

  }
})

//导出store独享
export default store
