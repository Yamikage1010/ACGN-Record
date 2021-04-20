<template>
  <div
    :ref="'moveWindow' + title"
    v-if="windowShow"
    id="moveWindow"
    class="move-window animate__animated"
    :class="{ 'window-animate-flip': animateType === 'flip', animate__bounceIn: animateType === 'bounceIn' }"
    :style="{
      height: windowHeight + 'px',
      width: windowWidth + 'px',
      top: top + 'px',
      left: left + 'px'
    }"
    @click="click"
  >
    <div class="move-window-header" :style="{ height: 40 + 'px' }">
      <div class="window-title">{{ title }}</div>
      <div class="window-handle">
        <div class="window-reduce" @click.stop="reduceWindow">一</div>
        <div class="window-close" @click.stop="closeWindow">X</div>
      </div>
    </div>
    <div class="move-window-main" :style="{ top: 40 + 'px' }" ref="moveWindowMain">
      <acgn-config v-if="windowType === 'config'"></acgn-config>
      <acgn-list v-else-if="windowType === 'list'" :windowKey="windowKey" @clickListItem="clickListItem"></acgn-list>
      <acgn-handle-list
        v-else-if="windowType === 'handleList'"
        :windowKey="windowKey"
        @clickListItem="clickListItem"
      ></acgn-handle-list>
      <acgn-handle
        v-else-if="windowType === 'dataHandle'"
        :acgnEditData="acgnEditData"
        @closeWindow="closeWindow"
      ></acgn-handle>
      <acgn-content
        v-else
        :windowKey="windowKey"
        @clickListItem="clickListItem"
        :acgnReadData="acgnReadData"
      ></acgn-content>
      <slot></slot>
    </div>
    <!-- <div class="move-window-footer" :style="{ height: windowHFHeight + 'px' }"></div> -->
    <div class="move-window-footer"></div>
  </div>
</template>

<script>
import acgnContent from '@/components/acgnContent'
import acgnHandle from '@/components/acgnHandle'
import acgnList from '@/components/acgnList'
import acgnHandleList from '@/components/acgnHandleList'
import acgnConfig from '@/components/acgnConfig'
export default {
  components: {
    acgnContent,
    acgnList,
    acgnHandleList,
    acgnConfig,
    acgnHandle
  },
  props: {
    acgnEditData: {
      default: null
    },
    acgnReadData: {
      default: null
    },
    zIndex: {
      type: Number,
      default: 0
    },
    title: {
      default: ''
    },
    windowKey: {
      default: ''
    },
    windowType: {
      default: 'list'
    },
    animateType: {
      default: 'bounceIn'
    },
    top: {
      default: 300
    },
    left: {
      default: 300
    },
    windowHeight: {
      default: 600
    },
    windowWidth: {
      default: 500
    }
  },
  mounted() {
    this.$refs['moveWindow' + this.title].style.zIndex = this.zIndex
  },
  computed: {
    windowHFHeight() {
      return this.windowHeight / 15
    }
  },
  data() {
    return {
      windowShow: true,
      reduceWindowHeight: 0
    }
  },
  methods: {
    click(e) {
      this.$emit('click', e)
    },
    closeWindow() {
      this.$refs['moveWindow' + this.title].classList.remove(
        'window-animate-flip',
        'reduce-window-animetion',
        'enlarge-window-animetion'
      )
      if (this.animateType == 'bounceIn') {
        this.$refs['moveWindow' + this.title].classList.add('animate__bounceOut')
      } else {
        this.$refs['moveWindow' + this.title].classList.add('animate__bounceOut')
      }
      setTimeout(() => {
        this.windowShow = false
      }, 1000)
      this.$emit('closeWindow')
    },
    reduceWindow() {
      let moveWindow = this.$refs['moveWindow' + this.title]
      moveWindow.classList.remove('window-animate-flip', 'animate__bounceIn')
      if (moveWindow.classList.contains('reduce-window-animetion')) {
        moveWindow.classList.remove('reduce-window-animetion')
        let enlargeWindow = `
        @keyframes enlargeWindow {
          from {
            height:50px;
          }
          to {
            height: ${this.reduceWindowHeight}px;
          }
        }`
        let windowStyle = document.createElement('style')
        document.getElementsByTagName('head')[0].appendChild(windowStyle)
        windowStyle.appendChild(document.createTextNode(enlargeWindow))
        moveWindow.classList.add('enlarge-window-animetion')
      } else {
        this.reduceWindowHeight = moveWindow.style.height
        moveWindow.classList.remove('enlarge-window-animetion')
        moveWindow.classList.add('reduce-window-animetion')
      }
    },
    clickListItem(acgnContent) {
      this.$emit('clickListItem', {
        acgnContent: acgnContent,
        windowType: this.windowType
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.move-window {
  top: 0;
  left: 0;
  position: fixed;
  border-radius: 5px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);
  .move-window-header,
  .move-window-footer {
    width: 100%;
    position: absolute;
  }
  .move-window-header {
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
      justify-content: space-between;
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
      .window-reduce {
      }
      .window-close {
      }
    }
  }
  .move-window-main {
    width: 100%;
    height: calc(100% - 50px);
    position: absolute;
    overflow: auto;
    bottom: 10px;
    background-color: $bgColor;
  }
  .move-window-footer {
    height: 10px;
    bottom: 0%;
    background-color: $bgColor;
  }
}
.reduce-window-animetion {
  animation-name: reduceWindow;
  animation-timing-function: linear;
  animation-duration: 0.3s;
  // animation: 0.5s linear reduceWindow !important;
}
.enlarge-window-animetion {
  animation-name: enlargeWindow;
  animation-timing-function: linear;
  animation-duration: 0.3s;
  // animation: 0.5s linear enlargeWindow !important;
}
.window-animate-flip {
  -webkit-backface-visibility: visible !important;
  backface-visibility: visible !important;
  -webkit-animation-name: windowFlip;
  animation-name: windowFlip;
  animation-delay: 0.5s;
  -webkit-animation-delay: 0.5s;
}

@keyframes reduceWindow {
  from {
  }
  to {
    height: 50px;
  }
}
@keyframes windowFlip {
  from {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -90deg);
    transform: perspective(400px) rotate3d(0, 1, 0, -90deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 20deg);
    transform: perspective(400px) rotate3d(0, 1, 0, 20deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }

  60% {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -10deg);
    transform: perspective(400px) rotate3d(0, 1, 0, -10deg);
    opacity: 1;
  }

  80% {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 5deg);
    transform: perspective(400px) rotate3d(0, 1, 0, 5deg);
  }

  to {
    -webkit-transform: perspective(400px);
    transform: perspective(400px);
  }
}
</style>
