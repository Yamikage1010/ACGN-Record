<template>
  <div
    ref="moveMenu"
    class="move-menu animate__animated animate__bounceIn"
    :style="{
      height: windowHeight + 'px',
      width: windowWidth + 'px',
      top: top + 'px',
      left: left + 'px'
    }"
    @click="click"
  >
    <div class="move-menu-header" :style="{ height: windowHFHeight + 'px' }">
      <div>config</div>
      <a @click="closeMenu" style="cursor:pointer">关闭</a>
    </div>
    <div class="move-menu-main" :style="{ top: windowHFHeight + 'px' }">
      <slot></slot>
    </div>
    <!-- <div class="move-menu-footer" :style="{height:windowHFHeight+'px'}"></div> -->
  </div>
</template>

<script>
export default {
  props: {
    zIndex: {
      type: Number,
      default: 0
    },
    top: {
      default: 0
    },
    left: {
      default: 0
    }
  },
  mounted() {
    this.$refs.moveMenu.style.zIndex = this.zIndex;
  },
  computed: {
    windowHFHeight() {
      return this.windowHeight / 10;
    }
  },
  data() {
    return {
      windowHeight: 300,
      windowWidth: 150
    };
  },
  methods: {
    click(e) {
      this.$emit('click', e);
    },
    closeMenu(e) {
      this.$emit('closeMenu', e);
    }
  }
};
</script>

<style lang="scss" scoped>
.move-menu {
  position: fixed;
  background-color: $bgColor;
  border-radius: 3px;
  .move-menu-header,
  .move-menu-footer {
    width: 100%;
    position: absolute;
    background-color: $fontColor;
  }
  .move-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .move-menu-main {
    width: 100%;
    position: relative;
  }
  .move-menu-footer {
    bottom: 0;
  }
}
</style>
