<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" class="tab-control"
                 @tabClick="tabClick" ref="tabControl1" v-show="isTabFixed"/>
    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="getemitScroll"
            :pull-up-load="true"
            @pullingUp="loadMore"
            >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']" class="tab-control"
                   @tabClick="tabClick" ref="tabControl2"/>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
<!--    因为在自定义组件上注册的事件触发的是组件自定义的事件，根本不是原生的dom事件，既然不是，当然不会触发喽-->
<!--    加上.native点击事件就可以触发了，.native修饰符就是用来注册元素的原生事件而不是组件自定义事件的-->
    <back-top @click.native="backClick" v-show="isshowBackTop" />
  </div>
</template>
<!--back-top，如果要在组件上进行事件，需要加native-->
<script>
import homeSwiper from "@/views/home/childComps/homeSwiper";
import RecommendView from "@/views/home/childComps/RecommendView";
import FeatureView from "@/views/home/childComps/FeatureView";

import NavBar from "@/components/common/navbar/NavBar";
import TabControl from "@/components/content/tabControl/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";


import Scroll from "@/components/common/scroll/Scroll";

import {getHomeMultidata,getHomeGoods} from "@/network/home";
import {debounce} from '@/common/utils'
import {itemListenerMixin} from "@/common/mixin";
import {backTopMixin} from "@/common/mixin";

export default {
  name: "Home",
  components: {
    homeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,

  },
  data() {
    return {
      // results: null
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      isload: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  mixins: [itemListenerMixin, backTopMixin],
  destroyed() {
    console.log('销毁');
  },
  // 进入页面时滚动到上次离开时的位置
  activated() {
    // console.log('设置位置');
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0)

  },
  // 记录页面离开时的位置
  deactivated() {
    // 保存页面位置
    this.saveY = this.$refs.scroll.getScrollY()
    console.log(this.saveY);
    // 取消全局事件的监听
    this.$bus.$off('imageLoad', this.itemImgListener)
  },
  created() {
    //1.请求多个数据,this指向的是该组件
    this.getHomeMultidata()

    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

  },
  mounted() {
    //1.图片加载完成的事件监听
    // this.$refs.scroll.refresh，refresh不能带括号，否则就不是函数了，是返回值
    //refresh是func的返回值(scroll中的refresh'-----')
    let newRefresh = debounce(this.$refs.scroll.refresh, 500)
    //监听GoodsListItem中的图片加载完成
    //默认情况下$bus是没有值的，需要在main.js中添加vue实例

    //对监听的事件进行保存
    //这个refresh是防抖函数的返回值,debounce中的...arg,表示refresh可以进行传参
    //...意味着不止传一个参数，可以传多个
    this.itemImgListener = () => {
      newRefresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  methods: {
    /*
    * 事件监听相关方法
    * */
    tabClick(index) {
      switch (index){
        case 0: this.currentType = 'pop'
          break
        case 1: this.currentType = 'new'
          break
        case 2: this.currentType = 'sell'
          break
      }
      //将两个tabControl的点击index设为一样
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index

    },

    getemitScroll(position) {
      //1.判断BackTop是否显示
      this.isshowBackTop = -(position.y) > 1000

      //2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },

    //2.获取tabControl的offsetTop
    //所有的组件都有一个属性$el: 用于获取组件中的元素
    swiperImageLoad() {
      if (!this.isload){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
        this.isload = true
      }
    },
    /*
    网络请求的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // this.results = res
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
        // console.log(res);
      })
    },
    getHomeGoods(type) {
      //当前页码加一
      const page = this.goods[type].page + 1
      //获取下一页的数据
      getHomeGoods(type, page).then(res => {
        // console.log(res);
        this.goods[type].list.push(...res.data.list) //将服务器中的获取的所有list都添加
        this.goods[type].page += 1 //页数加一

        //默认只能加载一次，要使用finish完成加载更多
        this.$refs.scroll.finishPullUp()
      })
    },

  }
}
</script>

<style scoped>
#home {
  /*padding-top: 44px;*/
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #f6f6f6;

  /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
  /*position: fixed;*/
  /*left: 0px;*/
  /*top: 0px;*/
  /*bottom: 0px;*/
  /*right: 0px;*/
  /*z-index: 9;*/
}
.tab-control {
  position: relative;
  z-index: 9;
}
.content{
  /*1.第一种,calc新增的*/
  /*height: calc(100% - 93px);*/
  /*margin-top: 44px;*/

  /*第二种*/
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0px;
  right: 0px;
}
</style>
