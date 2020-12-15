<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="navbar"/>
    <scroll class="content" ref="scroll"
            @scroll="contentScroll" :probe-type="3">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-if="isshowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";
import {backTopMixin, itemListenerMixin} from "@/common/mixin";
import {debounce} from "@/common/utils";
import {BACKTOP_DISTANCE} from "@/common/const";
import {mapActions} from 'vuex'


export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    Scroll,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: {},
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,

    }
  },

  created() {
    //1.获取保存传入的iid
    this.iid = this.$route.params.iid

    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      console.log(res);
      //1.获取数据
      const data = res.result;

      //2.获取顶图轮播图片
      this.topImages = data.itemInfo.topImages

      //3.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      //4.获取店铺信息
      this.shop = new Shop(data.shopInfo)

      //5.保存商品的详情数据
      this.detailInfo = data.detailInfo

      //6.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      //7.取出评论的信息
      this.commentInfo = data.rate.list && data.rate.list[0]

      //第一次获取：值不对
      //获取失败的原因：this.$refs.params.$el根本没有渲染
      // this.themeTopYs = []
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      // console.log(this.themeToYs)

     /* this.$nextTick( () => {
        //第二次获取：值不对
        //根据最新的数据，对应的DOM是已经被渲染出来
        //但是图片依然是没有加载完(目前获取到offsetTop不包含其中的图片)
        //offset值不对的时候，都是因为图片加载的原因
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        console.log(this.themeToYs)
      })*/

    })


    //3.请求推荐数据
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list
    })

    //4.将getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
    this.getThemeTopY = debounce( () => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
      //hack做法，再添加一个最大值
      this.themeTopYs.push(Number.MAX_VALUE)
      console.log(this.themeTopYs)
    }, 100)

  },
  methods: {
    ...mapActions(['addCart']), //映射actions中的方法
    detailImageLoad() {
      this.newRefresh()
      // this.newRefresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 1000)
    },
    contentScroll(position) {
      // console.log(position);
      //1.获取y值
      const positionY = -position.y

      //2.positionY和主题中值进行对比，index为nav-bar中的titles
      //[0, 7938, 9120, 9452]
      //positionY 在 0 和 7938 之间，index = 0
      //positionY 在 7938 和 9120 之间，index = 1
      //positionY 在 9120 和 9453 之间，index = 2
      //positionY 超过 9120 值，index = 3

      let length = this.themeTopYs.length
      //hack做法需要length-1，不然会越狱
      for(let i = 0; i < length; i++ ) {
        //this.currentIndex !== i && 用来减少打印重复
        //hack做法
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i]
          && positionY < this.themeTopYs[i+1])) {
          this.currentIndex = i
          this.$refs.navbar.currentIndex = this.currentIndex
        }

        //普通做法
        /*if (this.currentIndex !== i && (i < length - 1 && positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))  {
          this.currentIndex = i
          // console.log(this.currentIndex)
          this.$refs.navbar.currentIndex = this.currentIndex
        }*/
      }
      this.isshowBackTop = -(position.y) > BACKTOP_DISTANCE

      //2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    //1.添加购物车
    addToCart() {
      //1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0];
      product.desc = this.goods.desc;
      product.title = this.goods.title;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      //2.将product添加入state，将商品添加到购物车里 // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })(1.Promise 2.映射actions)
      //映射actions之后可以直接调用
      this.addCart(product).then(res => {
        // this.show = true
        // this.message = res
        // setTimeout(() => {
        //   this.show = false
        //   this.message = ''
        // }, 1500)

        this.$toast.show(res, 1500)
        console.log(this.$toast)
      })


    }
  },
  mounted() {
  },
  updated() {
  },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
    height: 100vh;
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #ffffff;
  }
  .content {
    height: calc(100% - 44px - 49px);
  }

</style>
