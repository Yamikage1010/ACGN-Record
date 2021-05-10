<template>
  <div
    ref="moveMessage"
    v-if="windowShow"
    class="move-message animate__animated animate__bounceIn"
    :style="{
      height: windowHeight + 'px',
      width: windowWidth + 'px',
      top: windowTop + 'px',
      left: windowLeft + 'px'
    }"
    @click="click"
  >
    <div class="move-message-header" :style="{ height: 40 + 'px' }">
      <div class="window-title">{{ title }}</div>
      <div class="window-handle">
        <div class="window-close" @click.stop="closeMessage">X</div>
      </div>
    </div>
    <div class="move-message-main">
      <slot></slot>
      <div class="message-btnGroup">
        <acgn-button :buttonType="'danger'" @click="closeMessage">取消</acgn-button>
        <acgn-button @click="confirmMessage">确定</acgn-button>
      </div>
    </div>
    <!-- <div class="move-message-footer" :style="{height:windowHFHeight+'px'}"></div> -->
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
    height: {
      default: 300
    },
    width: {
      default: 400
    },
    title: {
      default: 'title'
    }
  },
  mounted() {
    this.$refs.moveMessage.style.zIndex = this.zIndex
    this.windowTop = this.top
    this.windowLeft = this.left
    this.windowHeight = this.height
    this.windowWidth = this.width
  },
  computed: {
    windowHFHeight() {
      return this.windowHeight / 10
    }
  },
  data() {
    return {
      windowShow: true,
      windowTop: 0,
      windowLeft: 0,
      windowHeight: 300,
      windowWidth: 400
    }
  },
  methods: {
    click(e) {
      this.$emit('click', e)
    },

    close() {
      this.windowShow = false
    },
    closeMessage() {
      this.windowShow = false
      this.$emit('closeMessage')
    },
    confirmMessage() {
      this.$emit('confirmMessage')
    }
  }
}
</script>

<style lang="scss" scoped>
.move-message {
  position: fixed;
  background-color: $bgColor;
  border-radius: 3px;
  img {
    opacity: 0.5;
    width: 200px;
    position: absolute;
    transform: translate(-50%, 0);
  }
  .move-message-header,
  .move-message-footer {
    width: 100%;
    position: absolute;
    background-color: $acgnThemeColor;
  }
  .move-message-header {
    top: 0%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $acgnThemeColor;
    .window-title {
      margin-left: 20px;
    }
    .window-handle {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 80px;
      margin-right: 20px;
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
  .move-message-main {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-top: 40px;
    .message-btnGroup {
      position: relative;
      display: flex;
      justify-content: space-around;
    }
  }
  .move-message-footer {
    bottom: 0;
  }
}
</style>
