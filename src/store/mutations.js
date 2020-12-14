import {ADD_COUNTER,ADD_TO_CART} from "@/store/mutations-types";


export default {
  //唯一的目的就是修改state中的状态2.其中的每个方法尽可能完成的事件比较单一一点
  //payload，可以进行传参
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    payload.checked = true
    state.cartList.push(payload)
  }
}
