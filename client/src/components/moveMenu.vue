<template>
  <div
    ref="moveMenu"
    class="move-menu animate__animated animate__bounceIn"
    :style="{
      height: windowHeight + 'px',
      width: windowWidth + 'px',
      top: windowTop + 'px',
      left: windowLeft + 'px'
    }"
    @click="click"
  >
    <img :src="imgSrc" />
    <div class="move-menu-header" :style="{ height: windowHFHeight + 'px' }">
      <div class="window-title">{{ title }}</div>
      <div class="window-handle" v-if="hasClose || hasReduce">
        <div class="window-reduce" v-if="hasReduce" @click.stop="reduceWindow">一</div>
        <div class="window-close" v-if="hasClose" @click.stop="closeMenu">X</div>
      </div>
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
    },
    title: {
      default: 'title'
    },
    height: {
      default: 400
    },
    width: {
      default: 200
    },
    hasClose: {
      default: false
    },
    hasReduce: {
      default: false
    },
    imgSrc: {
      default: 'http://localhost:9810/acgnrecord/defaultImage/menuBg001.jpg'
    }
  },
  created() {},
  mounted() {
    this.$refs.moveMenu.style.zIndex = this.zIndex
    this.windowTop = this.top
    this.windowLeft = this.left
    this.windowHeight = this.height
    this.windowWidth = this.width
  },
  computed: {
    windowHFHeight() {
      return 40
    }
  },
  data() {
    return {
      windowTop: 0,
      windowLeft: 0,
      windowHeight: 400,
      windowWidth: 200,
      reduceWindowHeight: ''
    }
  },
  methods: {
    click(e) {
      this.$emit('click', e)
    },

    reduceWindow() {
      let moveMenu = this.$refs.moveMenu
      if (this.reduceWindowHeight) {
        moveMenu.style.height = this.reduceWindowHeight
        this.reduceWindowHeight = ''
      } else {
        this.reduceWindowHeight = moveMenu.style.height
        moveMenu.style.height = '40px'
      }
    },
    closeMenu(e) {
      this.$emit('closeMenu', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.move-menu {
  position: fixed;
  background-color: $bgColor;
  border-radius: 3px;
  transition: height 0.5s ease-in-out;
  overflow: hidden;
  img {
    opacity: 0.5;
    width: 100%;
    position: absolute;
    transform: translate(-50%, 0);
  }
  .move-menu-header,
  .move-menu-footer {
    width: 100%;
    position: absolute;
    background-color: $acgnThemeColor;
  }
  .move-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    .window-title {
      margin-left: 20px;
    }
    .window-handle {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 80px;
      margin-right: 20px;
      .window-reduce,
      .window-close {
        width: 30px;
        height: 30px;
        line-height: 30px;
        position: relative;
        background-color: $acgnThemeColorHover;
        color: $fontColor;
        border-radius: 15px;
        transition: 0.3s ease;
        cursor: pointer;
        &:hover {
          background-color: $bgColor;
          transform: rotate(180deg);
        }
      }
      .window-close {
      }
    }
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
