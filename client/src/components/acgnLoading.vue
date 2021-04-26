<template>
  <div class="acgnLoading">
    <div class="loading-anime">
      <span>{{ loadingNum }}%</span>
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
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  .loading-anime {
    span {
      color: $fontColor;
      font-size: 30px;
    }
  }
}
</style>