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
      :windowHeight="300"
      :windowWidth="300"
      :animateType="'flip'"
      :windowType="item.windowType"
      @click="setZIndex"
    >
      <a href="https://bangumi.tv/subject_search/clannad?cat=all" target="_blank"> 跳转至bangumi搜索 </a>
    </move-window>
  </div>
</template>

<script>
import floatBall from '@/components/floatBall'
import moveWindow from '@/components/moveWindow.vue'
export default {
  components: {
    floatBall,
    moveWindow
  },
  data() {
    let ballWidth = window.innerWidth / 6
    let ballTop = window.innerHeight / 3
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

      maxZIndex: 0, //置顶窗口zIndex值
      moveWindowCount: 0, //窗口数量
      windowData: []
    }
  },
  methods: {
    clickBall(item) {
      this.windowData.push({
        title: item.title,
        subTitle: item.subTitle,
        key: item.ballKey,
        top: item.top,
        left: item.left,
        windowType: item.windowType
      })
      this.moveWindowCount++
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

<style lang="scss" scoped></style>
