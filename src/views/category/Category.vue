<template>
  <div>
    <h2>分类</h2>
    <back-top @click.native="backClick" v-if="isshowBackTop" />
  </div>
</template>

<script>
import {backTopMixin} from "@/common/mixin";

export default {
  name: "Profile",
  mixins: [backTopMixin]
}
</script>

<style scoped>

</style>
