<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <home-swiper :banners="banners"/>
    <recommend-view :recommends="recommends"/>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import homeSwiper from "@/views/home/childComps/homeSwiper";
import RecommendView from "@/views/home/childComps/RecommendView";


import {getHomeMultidata} from "@/network/home";

export default {
  name: "Home",
  components: {
    NavBar,homeSwiper,RecommendView
  },
  data() {
    return {
      // results: null
      banners: [],
      recommends: []
    }
  },
  created() {
    //1.请求多个数据,this指向的是该组件
    getHomeMultidata().then(res => {
      // this.results = res
      // console.log(res);
      this.banners = res.data.banner.list
      this.recommends = res.data.recommend.list
    })
  }
}
</script>

<style scoped>
.home-nav {
  background-color: var(--color-tint);
  color: #f6f6f6;
}
</style>
