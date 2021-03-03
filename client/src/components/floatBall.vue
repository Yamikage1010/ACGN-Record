<template>
  <div class="float-ball" :ref="ref" :style="{ top: top + 'px', left: left + 'px' }">
    <img src="" />
    <div class="float-ball-title">{{ title }}</div>
    <div class="float-ball-subTitle">{{ subTitle }}</div>
  </div>
</template>

<script>
export default {
  props: {
    top: {
      type: Number || String,
      default: 300
    },
    left: {
      type: Number || String,
      default: 300
    },
    title: {
      default: 'title'
    },
    subTitle: {
      default: 'subTitle'
    }
  },
  created() {
    this.ref = 'floatBall' + this.title;
    this.createStlye();
  },
  mounted() {
    this.floatBallFloat();
  },
  data() {
    return {
      ref: null,
      floatBallCssAnime: null
    };
  },
  methods: {
    //浮动球浮动
    floatBallFloat() {
      const title = this.title;
      const originalTop = Number(this.top);
      const originalLeft = Number(this.left);
      let top = Number(this.top);
      let left = Number(this.left);
      const floatBall = this.$refs[this.ref];
      floatBall.classList.add('float-ball-' + title);
      const floatKetframes = `@keyframes ballFloat${title}{
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
        .float-ball-${title}{
          animation: ballFloat${title} linear infinite 10s;
        }`;
      floatBallCssAnime.appendChild(document.createTextNode(floatKetframes));
    },
    createStlye() {
      // 将style样式存放到head标签
      this.floatBallCssAnime = document.getElementById('floatBallCssAnime');
      if (!this.floatBallCssAnime) {
        const style = document.createElement('style');
        style.id = 'floatBallCssAnime';
        document.getElementsByTagName('head')[0].appendChild(style);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.float-ball {
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 150px;
  background-color: $bgColor;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  .float-ball-title {
    font-size: 70px;
    color: $fontColor;
  }
  .float-ball-subTitle {
    font-size: 25px;
    color: $fontColor;
  }
}
</style>
