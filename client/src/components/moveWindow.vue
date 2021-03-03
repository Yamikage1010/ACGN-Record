<template>
  <div
    ref="moveWindow"
    class="move-window"
    :style="{ height: windowHeight + 'px', width: windowWidth + 'px' }"
    @click="click"
  >
    <div class="move-window-header" :style="{ height: windowHFHeight + 'px' }"></div>
    <div class="move-window-main" :style="{ top: windowHFHeight + 'px' }">
      <slot></slot>
    </div>
    <!-- <div class="move-window-footer" :style="{height:windowHFHeight+'px'}"></div> -->
  </div>
</template>

<script>
export default {
  props: {
    zIndex: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.$refs.moveWindow.style.zIndex = this.zIndex;
  },
  computed: {
    windowHFHeight() {
      return this.windowHeight / 15;
    }
  },
  data() {
    return {
      windowHeight: 600,
      windowWidth: 500
    };
  },
  methods: {
    click(e) {
      this.$emit('click', e);
    }
  }
};
</script>

<style lang="scss" scoped>
.move-window {
  top: 0;
  left: 0;
  position: fixed;
  background-color: $bgColor;
  border-radius: 3px;
  .move-window-header,
  .move-window-footer {
    width: 100%;
    position: absolute;
    background-color: $fontColor;
  }
  .move-window-main {
    width: 100%;
    position: relative;
  }
  .move-window-footer {
    bottom: 0;
  }
}
</style>
