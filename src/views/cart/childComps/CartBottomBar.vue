<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button"/>
      <span>全选</span>
    </div>
    <div class="cart-total">
      <span>总计:{{totalPrice}}</span>
    </div>
    <div class="calculate">
      <span>
        去计算:({{checkLength}})
      </span>
    </div>
  </div>
</template>

<script>
import CheckButton from "@/components/content/checkButton/CheckButton";

import {mapGetters} from 'vuex'

export default {
  name: "CartBottomBar",
  components: {CheckButton},
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue,item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    }
  }
}
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;

    height: 40px;
    background-color: #eee;

    line-height: 44px;
    font-size: 14px;
  }
  .check-content {
    display: flex;
    align-items: center;
    margin-left: 5px;

   width: 60px;
  }
  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .cart-total {
    margin-left: 15px;
    flex: 1;

  }
  .calculate {
    background-color: red;
    width: 90px;
    text-align: center;
  }
</style>
