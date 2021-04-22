<template>
  <div class="readerIndex">
    <float-ball
      v-for="(item, index) in ballData"
      :key="item.ballKey + index"
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
      :zIndex="item.zIndex"
      :title="item.title"
      :top="item.top"
      :left="item.left"
      :acgnReadData="item.acgnReadData"
      :windowHeight="item.height"
      :windowWidth="item.width"
      :animateType="item.animateType"
      :windowType="item.windowType"
      :windowKey="item.key"
      @closeWindow="closeWindow(item)"
      @click="setZIndex"
      @clickListItem="clickListItem"
    >
    </move-window>
  </div>
</template>

<script>
import Bus from '@/common/bus'
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
    let ballTop = window.innerHeight / 10
    return {
      ballWidth,
      ballTop,
      ballData: [
        {
          ballKey: ACGN.A,
          title: 'Anime',
          subTitle: '动画',
          top: ballTop,
          left: ballWidth,
          width: ballWidth,
          height: ballWidth,
          windowType: 'list'
        },
        {
          ballKey: ACGN.C,
          title: 'Comic',
          subTitle: '漫画',
          top: ballTop,
          left: ballWidth * 4,
          width: ballWidth,
          height: ballWidth,
          windowType: 'list'
        },
        {
          ballKey: ACGN.G,
          title: 'Game',
          subTitle: '游戏',
          top: ballTop * 3 + ballWidth,
          left: ballWidth,
          width: ballWidth,
          height: ballWidth,
          windowType: 'list'
        },
        {
          ballKey: ACGN.N,
          title: 'Novel',
          subTitle: '小说',
          top: ballTop * 3 + ballWidth,
          left: ballWidth * 4,
          width: ballWidth,
          height: ballWidth,
          windowType: 'list'
        }
      ],
      AnimeBallData: {
        ballKey: ACGN.A,
        title: 'Anime',
        subTitle: '动画',
        top: ballTop,
        left: ballWidth,
        width: ballWidth,
        height: ballWidth,
        windowType: 'list'
      },
      ComicBallData: {
        ballKey: ACGN.C,
        title: 'Comic',
        subTitle: '漫画',
        top: ballTop,
        left: ballWidth * 4,
        width: ballWidth,
        height: ballWidth,
        windowType: 'list'
      },
      GameBallData: {
        ballKey: ACGN.G,
        title: 'Game',
        subTitle: '游戏',
        top: ballTop * 3 + ballWidth,
        left: ballWidth,
        width: ballWidth,
        height: ballWidth,
        windowType: 'list'
      },
      NovelBallData: {
        ballKey: ACGN.N,
        title: 'Novel',
        subTitle: '小说',
        top: ballTop * 3 + ballWidth,
        left: ballWidth * 4,
        width: ballWidth,
        height: ballWidth,
        windowType: 'list'
      },
      maxZIndex: 0, //置顶窗口zIndex值
      moveWindowCount: 0, //窗口数量
      windowData: []
    }
  },
  created() {
    Bus.$on('openTomoAcgnContentList', (tomoData) => {
      let windowId = 'tomo_' + tomoData.acgnUid
      if (!this.windowData.find((wd) => wd.windowId === windowId)) {
        this.windowData.push({
          title: tomoData.acgnUserName + '记录的作品',
          zIndex: ++this.maxZIndex,
          key: 'tomo_' + tomoData.acgnUid,
          top: 0,
          left: 100,
          width: 600,
          height: 800,
          windowType: 'list',
          windowId: windowId
        })
        this.moveWindowCount++
      } else {
        this.$message.warning('已打开该窗口')
      }
    })
  },
  methods: {
    clickBall(item) {
      let windowId = item.ballKey + '_' + item.windowType
      if (!this.windowData.find((wd) => wd.windowId === windowId)) {
        this.windowData.push({
          title: item.title,
          subTitle: item.subTitle,
          zIndex: ++this.maxZIndex,
          key: item.ballKey,
          top: item.top,
          left: item.left,
          width: 400,
          height: 400,
          windowType: item.windowType,
          animateType: 'flip',
          windowId: windowId
        })
        this.moveWindowCount++
      } else {
        this.$message.warning('已打开该窗口')
      }
    },
    closeWindow(windowData) {
      if (windowData.windowType === 'list') {
        let acgnBallData = { ...this.ballData.find((item) => item.ballKey === windowData.key) }
        this.ballData.push(acgnBallData)
      }
      this.windowData.find((wd) => wd.windowId === windowData.windowId).windowId = ''
    },
    //点击窗口置顶
    setZIndex(e) {
      let getMoveWindow = (element) => {
        if (element.id === 'moveWindow') {
          return element
        } else {
          return getMoveWindow(element.parentElement)
        }
      }
      getMoveWindow(e.srcElement).style.zIndex = ++this.maxZIndex
    },
    clickListItem(value) {
      console.log(value)
      if (value.windowType === 'list') {
        let acgnReadData = value.acgnContent
        let windowId = acgnReadData.acgnId + '_' + value.windowType
        if (!this.windowData.find((wd) => wd.windowId === windowId)) {
          this.windowData.push({
            acgnReadData: acgnReadData,
            title: acgnReadData.acgnTitle,
            subTitle: acgnReadData.acgnSubTitle,
            zIndex: ++this.maxZIndex,
            key: value.windowKey,
            windowType: acgnReadData.acgnType,
            windowId: windowId,
            top: 0,
            left: this.ballWidth,
            width: 800,
            height: 800
          })
          this.moveWindowCount++
        } else {
          this.$message.warning('已打开该窗口')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
