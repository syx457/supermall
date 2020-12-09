<template>
  <Swiper>
    <swiper-item v-for="(item,index) in banners" :key="index.id">
      <a :href="item.link">
        <img :src="item.image" @load="imageLoad">
      </a>
    </swiper-item>
  </Swiper>
</template>

<script>
import {Swiper,SwiperItem} from '@/components/common/swiper'

export default {
  name: "homeSwiper",
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods: {
    imageLoad() {
      this.$emit('swiperImageLoad')
    }
  }
}
</script>

<style scoped>

</style>
