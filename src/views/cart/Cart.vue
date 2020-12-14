<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center" >购物车({{length}})</div>
    </nav-bar>

<!--    商品列表-->
    <cart-list />


<!--    底部-->
    <cart-bottom-bar class="bottom-bar"/>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import CartList from "@/views/cart/childComps/CartList";
import CartBottomBar from "@/views/cart/childComps/CartBottomBar";

import {mapGetters} from 'vuex'

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    //可以直接将getters转换为computed
    //1.数组语法
    // ...mapGetters(["cartLength","cartList"])
    //2.对象语法，可以自定义名称
    ...mapGetters({
      length: "cartLength",
      // list: "cartList"
    })
  }
}
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }
  .bottom-bar {
    height: 44px;
    position: relative;
  }
</style>
