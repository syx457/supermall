<template>
  <div id="detail">
    <detail-nav-bar></detail-nav-bar>
    <detail-swiper :top-images="topImages"></detail-swiper>
    <detail-base-info :goods="goods"></detail-base-info>
    <detail-shop-info :shop="shop"></detail-shop-info>
  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";

import {getDetail,Goods,Shop} from "@/network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo
  },
  data() {
    return {
      iid: {},
      topImages: [],
      goods: {},
      shop: {}
    }
  },
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid

    //2.根据iid获取数据详情
    getDetail(this.iid).then(res => {
      console.log(res);
      //1.获取顶图轮播图片
      const data = res.result;
      this.topImages = data.itemInfo.topImages

      //2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      //
      this.shop = new Shop(data.shopInfo)
    })
  }
}
</script>

<style scoped>

</style>
