<template>
  <div class="float-ball" :style="{ top: top + 'px', left: left + 'px' }">
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
      default: 150
    },
    left: {
      type: Number || String,
      default: 150
    },
    title: {
      default: 'title'
    },
    subTitle: {
      default: 'subTitle'
    }
  },
  mounted() {
    this.floatBallFloat();
  },
  methods: {
    floatBallFloat() {
      // const floatKetframes =
      //   '@keyframes ballFloat{ 0%{ left:' + this.left + 'px;top:' + this.top + 'px;}100%{left:100px;top:100px;}';
      // // 创建style标签
      // const style = document.createElement('style');
      // // 设置style属性
      // style.type = 'text/css';
      // // 将 keyframes样式写入style内
      // style.innerHTML = floatKetframes;
      // // 将style样式存放到head标签
      // document.getElementsByTagName('head')[0].appendChild(style);
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
  animation: ballFloat linear infinite 10s;
  .float-ball-title {
    font-size: 70px;
    color: $fontColor;
  }
  .float-ball-subTitle {
    font-size: 25px;
    color: $fontColor;
  }
}
@keyframes ballFloat {
}
</style>
