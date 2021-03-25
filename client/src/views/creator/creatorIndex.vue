<template>
  <div>
    <float-ball
      v-for="item in ballData"
      :key="item.ballKey"
      :ballKey="item.ballKey"
      :title="item.title"
      :subTitle="item.subTitle"
      :top="item.top"
      :left="item.left"
      :width="item.width"
      :height="item.height"
      @clickBall="clickBall(item)"
    ></float-ball>
    <move-window
      v-dialogDrag
      v-for="(item, index) in windowData"
      :key="index"
      :zIndex="index"
      :title="item.title"
      :top="item.top"
      :left="item.left"
      :windowHeight="item.height"
      :windowWidth="item.width"
      :animateType="'flip'"
      :windowType="item.windowType"
      :windowKey="item.key"
      @click="setZIndex"
    >
    </move-window>
  </div>
</template>

<script>
import floatBall from '@/components/floatBall'
import moveWindow from '@/components/moveWindow.vue'
import { ACGN } from '@/common/acgn'
export default {
  components: {
    floatBall,
    moveWindow
  },
  data() {
    let ballWidth = window.innerWidth / 6
    let ballTop = window.innerHeight / 3
    let ballTop2 = window.innerHeight / 10
    return {
      ballWidth,
      ballTop,
      ballData: [
        {
          ballKey: 'add',
          title: 'add',
          subTitle: '新增作品',
          top: ballTop,
          left: ballWidth,
          width: ballTop,
          height: ballTop,
          windowType: 'dataHandle'
        },
        {
          ballKey: 'manage',
          title: 'manage',
          subTitle: '管理作品',
          top: ballTop,
          left: ballWidth * 4,
          width: ballTop,
          height: ballTop
        }
      ],
      acgnBallData: [
        {
          ballKey: ACGN.A,
          title: 'Anime',
          subTitle: '动画',
          top: ballTop2,
          left: ballWidth * 2.5,
          width: ballWidth,
          height: ballWidth
        },
        {
          ballKey: ACGN.C,
          title: 'Comic',
          subTitle: '漫画',
          top: ballTop2,
          left: ballWidth * 4.5,
          width: ballWidth,
          height: ballWidth
        },
        {
          ballKey: ACGN.G,
          title: 'Game',
          subTitle: '游戏',
          top: ballTop2 * 3 + ballWidth,
          left: ballWidth * 2.5,
          width: ballWidth,
          height: ballWidth
        },
        {
          ballKey: ACGN.N,
          title: 'Novel',
          subTitle: '小说',
          top: ballTop2 * 3 + ballWidth,
          left: ballWidth * 4.5,
          width: ballWidth,
          height: ballWidth
        }
      ],
      maxZIndex: 0, //置顶窗口zIndex值
      moveWindowCount: 0, //窗口数量
      windowData: []
    }
  },
  methods: {
    clickBall(item) {
      if (item.ballKey == 'manage') {
        this.ballData.push(...this.acgnBallData)
      } else {
        this.windowData.push({
          title: item.title,
          subTitle: item.subTitle,
          key: item.ballKey,
          top: item.top,
          left: item.left,
          width: item.width,
          height: item.height,
          windowType: item.windowType
        })
        this.moveWindowCount++
      }
    },
    // closeWindow(windowItemKey) {
    //   console.log(this.windowData.findIndex(item => item.key == windowItemKey));
    //   this.windowData.splice(this.windowData.findIndex(item => item.key == windowItemKey) - 1, 1);
    //   this.windowData = this.windowData.filter(item => item.key);
    // },
    //点击窗口置顶
    setZIndex(e) {
      if (e.srcElement.parentElement.className.toString().includes('move-window')) {
        console.log(e.srcElement.parentElement.style.zIndex)
        e.srcElement.parentElement.style.zIndex = ++this.maxZIndex
      } else {
        e.srcElement.style.zIndex = ++this.maxZIndex
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
