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
      <div>{{ title }}</div>
      <a @click.stop="closeWindow" style="cursor: pointer">关闭</a>
    </div>
    <div class="move-window-main" :style="{ top: 40 + 'px' }">
      <acgn-config v-if="windowType === 'config'"></acgn-config>
      <acgn-list v-else-if="windowType === 'list'" :windowKey="windowKey" @clickListItem="clickListItem"></acgn-list>
      <acgn-handle-list
        v-else-if="windowType === 'handleList'"
        :windowKey="windowKey"
        @clickListItem="clickListItem"
      ></acgn-handle-list>
      <acgn-handle v-else-if="windowType === 'dataHandle'" :acgnEditData="acgnEditData"></acgn-handle>
      <acgn-content v-else :windowType="windowType"></acgn-content>
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
      windowShow: true
    }
  },
  methods: {
    click(e) {
      this.$emit('click', e)
    },
    closeWindow() {
      this.$refs['moveWindow' + this.title].classList.remove('window-animate-flip')
      if (this.animateType == 'bounceIn') {
        this.$refs['moveWindow' + this.title].classList.add('animate__bounceOut')
      } else {
        this.$refs['moveWindow' + this.title].classList.add('animate__bounceOut')
      }
      // this.windowShow = false;
      this.$emit('closeWindow')
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
    justify-content: space-around;
    align-items: center;
    background-color: $acgnThemeColor;
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
.window-animate-flip {
  -webkit-backface-visibility: visible !important;
  backface-visibility: visible !important;
  -webkit-animation-name: windowFlip;
  animation-name: windowFlip;
  animation-delay: 0.5s;
  -webkit-animation-delay: 0.5s;
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
