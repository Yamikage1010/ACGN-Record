<template>
  <div class="acgnContent">
    <!-- <el-carousel trigger="click" v-if="acgnReadData.acgnMemoryImage.length > 0" :indicator-position="'none'">
      <el-carousel-item v-for="(item, index) in acgnReadData.acgnMemoryImage" :key="index">
        <img class="album-image" :src="'http://localhost:9810/acgnrecord/image/' + item" />
      </el-carousel-item>
    </el-carousel> -->
    <div class="acgn-slide" v-if="acgnReadData.acgnMemoryImage.length > 0">
      <div
        class="slide-item"
        :class="activeIndex === index ? 'slide-item-active' : 'slide-item-hidden'"
        :data-index="index"
        v-for="(item, index) in acgnReadData.acgnMemoryImage"
        :key="index"
      >
        <img :src="'http://localhost:9810/acgnrecord/image/' + item" />
      </div>
    </div>

    <img
      class="acgn-image"
      style="max-width: 100%; max-height: 600px"
      v-else
      :src="'http://localhost:9810/acgnrecord/defaultImage/sora.png'"
    />

    <div class="slide-switch" ref="slideSwitch" @mousewheel="scrollSlideSwich">
      <div
        class="slide-switch-item"
        :class="{ 'slide-switch-item-active': activeIndex === index }"
        v-for="(item, index) in acgnReadData.acgnMemoryImage"
        :key="index"
        @click="clickSlideSwichItem(index)"
      >
        <img class="slide-switch-image" :src="'http://localhost:9810/acgnrecord/image/' + item" />
      </div>
    </div>
    <div class="image-blur">
      <img :src="'http://localhost:9810/acgnrecord/image/' + acgnReadData.acgnMemoryImage[activeIndex]" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    windowType: {
      default: 'Animetion'
    },
    acgnReadData: Object
  },
  data() {
    return {
      activeIndex: 0
    }
  },
  mounted() {
    console.log(this.acgnReadData)
  },
  methods: {
    clickSlideSwichItem(itemIndex) {
      this.activeIndex = itemIndex
    },
    scrollSlideSwich(event) {
      var slideSwitch = this.$refs.slideSwitch
      var scroll_width = 50 //滚动一下的距离
      var event = event || window.event,
        v
      event.wheelDelta ? (v = event.wheelDelta) : (v = event.detail)
      if (v > 3 || -v > 3) v = -v
      v > 0 ? (slideSwitch.scrollLeft += scroll_width) : (slideSwitch.scrollLeft -= scroll_width)

      event.preventDefault() //阻止浏览器的默认滚动
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnContent {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-items: center;
  flex-direction: column;
  overflow: auto;
  .image-blur {
    width: 100%;
    height: 700px;
    overflow: hidden;
    position: absolute;
    img {
      max-width: 100%;
      min-height: 700px;
      filter: blur(10px);
    }
  }

  .acgn-slide {
    width: calc(100% - 6px);
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    .slide-item {
      position: absolute;
      transition: 0.5s ease;
      z-index: 2;
      img {
        border: 4px solid #ffffffc5;
        border-radius: 3px;
        max-width: calc(100% - 3px);
        max-height: 590px;
      }
    }
    .slide-item-active {
      opacity: 1;
    }
    .slide-item-hidden {
      opacity: 0;
    }
  }

  .slide-switch {
    height: 100px;
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    overflow-x: auto;
    z-index: 2;
    .slide-switch-item {
      border: 2px solid rgba(255, 255, 255, 0.5);
      display: flex;
      align-items: center;
      transition: 0.2s ease;
      &:hover {
        cursor: pointer;
        border-color: #ffffff;
      }
      .slide-switch-image {
        height: 56px;
        transition: 0.2s ease;
      }
    }
    .slide-switch-item-active {
      border: 2px solid $acgnThemeColor;
      .slide-switch-image {
        height: 80px;
      }
    }
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
    }
  }
}
</style>