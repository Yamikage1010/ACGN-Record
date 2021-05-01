<template>
  <div class="acgnLoading" v-if="loaded !== loadSize">
    <div class="loading-anime">
      <img :src="'http://localhost:9810/acgnrecord/defaultImage/loading.gif'" />
      <!-- <span>{{ loadingNum }}%</span> -->
      <span>加载中...</span>
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
      default: 0
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
  background-color: #ffffff00;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
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
      color: $fontColor;
      font-size: 30px;
      -webkit-text-stroke: 1px #000;
      text-stroke: 1px #000;
    }
  }
}
</style>