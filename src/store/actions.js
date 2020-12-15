import {ADD_COUNTER,ADD_TO_CART} from "@/store/mutations-types";

export default  {
  addCart(context, payload) {
    //1.遍历cartlist中是否有iid，如果有就count加一，没有就往里面添加count
    /*let oldProduct = null
    for (let item of state.cartList) {
      if (item.iid === payload.iid)
        oldProduct = item
    }*/
    //查找之前的数组是否有该商品(iid)
    // find() 方法返回通过测试（函数内判断）的数组的第一个元素的值。
    return new Promise((resolve, reject) => {
      //1.查找之前数组中是否有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      //2.判断oldProduct
      if (oldProduct){
        // payload.count += 1
        context.commit(ADD_COUNTER, oldProduct)
        resolve('当前的商品数量+1')
      }
      else {  //添加新的商品
        payload.count =1
        // state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
        resolve('添加了新的商品')
      }
    })
  }
}
