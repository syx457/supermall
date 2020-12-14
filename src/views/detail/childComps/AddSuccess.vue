<template>
  <div :class="{addSuccess: isaddSuccess}">
    <span>添加购物车成功</span>
  </div>
</template>

<script>
export default {
  name: "AddSuccess",
  props: {
    isaddSuccess: {
      type: Boolean,
      default() {
        return false
      }
    }
  }
}
</script>

<style scoped>
  .addSuccess {
    position: relative;
    bottom: 284px;
    text-align: center;
    background-color: #f6f6f6;
  }
</style>
