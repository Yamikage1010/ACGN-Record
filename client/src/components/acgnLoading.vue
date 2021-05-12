<template>
  <div class="acgnLoading" v-if="!loadSuccess && loaded !== loadSize" :class="{ 'acgnLoading-bg': showBackground }">
    <div class="loading-anime">
      <template v-if="showBackground">
        <div class="loading-anime-bg">
          <img :src="'http://localhost:9810/acgnrecord/defaultImage/loading.gif'" />
          <!-- <span>{{ loadingNum }}%</span> -->
          <span>{{ loadingText + '...' }}</span>
        </div>
      </template>
      <template v-else>
        <img :src="'http://localhost:9810/acgnrecord/defaultImage/loading.gif'" />
        <!-- <span>{{ loadingNum }}%</span> -->
        <span>{{ loadingText + '...' }}</span>
      </template>
    </div>
    <div class="img-mask"></div>
    <img
      style="width: 100%"
      v-if="showBackground"
      src="http://localhost:9810/acgnrecord/defaultImage/sakuraBg001.jpg"
    />
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
    },
    showBackground: {
      default: false
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
    z-index: 2022;
    .loading-anime-bg {
      width: 350px;
      height: 350px;
      background-color: #ffffffa1;
      border: 3px $acgnThemeColor solid;
      border-radius: 175px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7);
      img {
        width: 300px;
      }
      span {
        font-size: 28px;
      }
    }
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
  .img-mask {
    width: 100%;
    height: 100%;
    background-color: #ffffff62;
    position: absolute;
    top: 0;
    left: 0;
  }
}
.acgnLoading-bg {
  height: 100%;
  top: 0;
}
</style>