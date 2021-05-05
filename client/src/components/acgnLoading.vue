<template>
  <div class="acgnLoading" v-if="!loadSuccess && loaded !== loadSize">
    <div class="loading-anime">
      <img :src="'http://localhost:9810/acgnrecord/defaultImage/loading.gif'" />
      <!-- <span>{{ loadingNum }}%</span> -->
      <span>{{ loadingText + '...' }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loaded: {
      type: Number,
      default: 0
    },
    loadSize: {
      type: Number,
      default: 1
    },
    loadSuccess: {
      default: false
    },
    loadingText: {
      default: '加载中'
    }
  },
  watch: {
    loaded(newValue) {
      this.dataLoaded = newValue
    }
  },
  computed: {
    loadingNum() {
      return Math.ceil((this.dataLoaded / this.loadSize) * 100)
    }
  },
  data() {
    return {
      dataLoaded: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnLoading {
  position: fixed;
  width: 100%;
  height: calc(100% - 40px);
  top: 40px;
  left: 0;
  // background-color: #ffffff00;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2021;
  // -webkit-backdrop-filter: blur(7px);
  // backdrop-filter: blur(7px);
  .loading-anime {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    img {
      width: 200px;
    }
    span {
      color: $acgnThemeColor;
      font-size: 25px;
      font-weight: 800;
      -webkit-text-stroke: 1.5px #ffffff;
      text-stroke: 1.5px #ffffff;
    }
  }
}
</style>