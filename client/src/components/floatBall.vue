<template>
  <div
    class="float-ball animate__animated"
    :ref="ref"
    :style="{ top: top + 'px', left: left + 'px', width: width + 'px', height: height + 'px' }"
    @click="clickBall"
  >
    <img src="@/assets/noania.png" />
    <div class="float-ball-title">{{ title }}</div>
    <div class="float-ball-subTitle">{{ subTitle }}</div>
  </div>
</template>

<script>
export default {
  props: {
    top: {
      default: 300
    },
    left: {
      default: 300
    },
    width: {
      default: 300
    },
    height: {
      default: 300
    },
    ballKey: {
      default: 'ballKey'
    },
    title: {
      default: 'title'
    },
    subTitle: {
      default: 'subTitle'
    }
  },
  created() {
    this.ref = 'floatBall' + this.ballKey
    this.createStlye()
  },
  mounted() {
    this.floatBallFloat()
  },
  data() {
    return {
      ref: null,
      floatBallCssAnime: null
    }
  },
  methods: {
    //浮动球浮动
    floatBallFloat() {
      const ballKey = this.ballKey
      const originalTop = Number(this.top)
      const originalLeft = Number(this.left)
      let top = Number(this.top)
      let left = Number(this.left)
      const floatBall = this.$refs[this.ref]
      floatBall.classList.add('float-ball-' + ballKey)
      const floatKetframes = `@keyframes ballFloat${ballKey}{
        20% {
          top: ${Math.random() > 0.5 ? (top = top + Math.random() * 30) : (top = top - Math.random() * 30)}px;
          left: ${Math.random() > 0.5 ? (left = left + Math.random() * 30) : (left = left - Math.random() * 30)}px;
        }
        40% {
          top: ${Math.random() > 0.5 ? (top = top + Math.random() * 30) : (top = top - Math.random() * 30)}px;
          left: ${Math.random() > 0.5 ? (left = left + Math.random() * 30) : (left = left - Math.random() * 30)}px;
        }
        60% {
          top: ${Math.random() > 0.5 ? (top = top + Math.random() * 30) : (top = top - Math.random() * 30)}px;
          left: ${Math.random() > 0.5 ? (left = left + Math.random() * 30) : (left = left - Math.random() * 30)}px;
        }
        80% {
          top: ${Math.random() > 0.5 ? (top = top + Math.random() * 30) : (top = top - Math.random() * 30)}px;
          left: ${Math.random() > 0.5 ? (left = left + Math.random() * 30) : (left = left - Math.random() * 30)}px;
        }
        100% {
          top: ${originalTop}px;
          left: ${originalLeft}px;
        }}
        .float-ball-${ballKey}{
          animation: ballFloat${ballKey} linear infinite 10s;
        }`
      if (this.floatBallCssAnime) {
        this.floatBallCssAnime.appendChild(document.createTextNode(floatKetframes))
      } else {
        this.floatBallCssAnime = document.getElementById('floatBallCssAnime')
        this.floatBallCssAnime.appendChild(document.createTextNode(floatKetframes))
      }
    },
    createStlye() {
      // 将style样式存放到head标签
      this.floatBallCssAnime = document.getElementById('floatBallCssAnime')
      if (!this.floatBallCssAnime) {
        const style = document.createElement('style')
        style.id = 'floatBallCssAnime'
        document.getElementsByTagName('head')[0].appendChild(style)
      }
    },
    clickBall() {
      const floatBall = this.$refs[this.ref]
      floatBall.classList.remove('float-ball-' + this.ballKey)
      floatBall.classList.add('animate__flipOutY')
      this.$emit('clickBall')
      // let floatBallChild = Array.apply({}, floatBall.children);
      // let floatBallTitle = floatBallChild.find(item => item.classList.toString().includes('float-ball-title'));
      // floatBallTitle.style.marginTop = '-50px';
    }
  }
}
</script>

<style lang="scss" scoped>
.float-ball {
  position: fixed;
  width: 300px;
  height: 300px;
  transition: 0.3s ease;
  border-radius: 150px;
  background-color: $bgColor;
  color: $fontColor;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  .float-ball-title {
    font-size: 70px;
    transition: 0.3s ease;
  }
  .float-ball-subTitle {
    transition: 0.3s ease;
    font-size: 25px;
  }
  img {
    opacity: 0.5;
    width: 300px;
    position: absolute;
    border-radius: 150px;
  }
}
.float-ball:hover {
  background-color: $hoverBgColor;
  color: $hoverFontColor;
  transform: scale(1.05);
}
.destruction-ball {
  opacity: 0;
}
</style>
