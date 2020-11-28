<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="getemitScroll"
            :pull-up-load="true"
            >
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']" class="tab-control"
                   @tabClick="tabClick"/>
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
import BackTop from "@/components/content/backTop/BackTop";

import Scroll from "@/components/common/scroll/Scroll";

import {getHomeMultidata,getHomeGoods} from "@/network/home";

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
    BackTop
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
      isshowBackTop: false
    }
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
    // this.$refs.scroll.refresh，refresh不能带括号，否则就不是函数了，是返回值
    const refresh = this.debounce(this.$refs.scroll.refresh, 500)
    //3.监听item中的图片加载完成
    //默认情况下$bus是没有值的，需要在main.js中添加vue实例
    this.$bus.$on('itemImageLoad', () => {
      refresh()
    })


  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  methods: {
    //防抖函数
    debounce(func, delay) {
      let timer = null
      return function (...args) {
        if(timer) clearTimeout(timer)
        //setTimeout有一个事件循环的概念，加入到下一次执行循环的尾部执行
        timer = setTimeout( () => {
          func.apply(this, args)

        }, delay)
      }

    },
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
    },
    /*
    网络请求的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // this.results = res
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type) {
      //当前页码加一
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        // console.log(res);
        this.goods[type].list.push(...res.data.list) //将服务器中的获取的所有list都添加
        this.goods[type].page += 1 //页数加一

        // this.$refs.scroll.finishPullUp()
      })
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0) //Scroll中的方法，scrollTo
    },
    getemitScroll(position) {
      this.isshowBackTop = -(position.y) > 1000
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

  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 9;
}
.tab-control {
  position: sticky;
  top: 44px;
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
