<template>
  <div class="creator-index">
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
      :acgnEditData="item.acgnEditData"
      :windowHeight="item.height"
      :windowWidth="item.width"
      :animateType="item.animateType"
      :windowType="item.windowType"
      :windowKey="item.key"
      @closeWindow="closeWindow(item.key, item.windowType)"
      @click="setZIndex"
      @clickListItem="clickListItem"
    >
    </move-window>
    <image-manage ref="imageManage"></image-manage>
  </div>
</template>

<script>
import Bus from '@/common/bus'
import floatBall from '@/components/floatBall'
import moveWindow from '@/components/moveWindow.vue'
import { ACGN } from '@/common/acgn'
import imageManage from '@/components/imageManage.vue'
export default {
  components: {
    floatBall,
    moveWindow,
    imageManage
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
      addBallData: {
        ballKey: 'add',
        title: 'add',
        subTitle: '新增作品',
        top: ballTop,
        left: ballWidth,
        width: ballTop,
        height: ballTop,
        windowType: 'dataHandle'
      },
      acgnBallData: [
        {
          ballKey: ACGN.A,
          title: 'Anime',
          subTitle: '动画',
          top: ballTop2,
          left: ballWidth * 2.5,
          width: ballWidth,
          height: ballWidth,
          windowType: 'handleList'
        },
        {
          ballKey: ACGN.C,
          title: 'Comic',
          subTitle: '漫画',
          top: ballTop2,
          left: ballWidth * 4.5,
          width: ballWidth,
          height: ballWidth,
          windowType: 'handleList'
        },
        {
          ballKey: ACGN.G,
          title: 'Game',
          subTitle: '游戏',
          top: ballTop2 * 3 + ballWidth,
          left: ballWidth * 2.5,
          width: ballWidth,
          height: ballWidth,
          windowType: 'handleList'
        },
        {
          ballKey: ACGN.N,
          title: 'Novel',
          subTitle: '小说',
          top: ballTop2 * 3 + ballWidth,
          left: ballWidth * 4.5,
          width: ballWidth,
          height: ballWidth,
          windowType: 'handleList'
        }
      ],
      maxZIndex: 0, //置顶窗口zIndex值
      moveWindowCount: 0, //窗口数量
      windowData: []
    }
  },
  mounted() {
    Bus.$on('openImageManage', (imageList) => {
      console.log(1111)
      this.$refs.imageManage.openImageManage(imageList)
    })
  },
  methods: {
    clickBall(item) {
      if (item.ballKey == 'manage') {
        this.ballData.push(...this.acgnBallData)
      } else {
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
          animateType: 'flip'
        })
        this.moveWindowCount++
      }
    },
    closeWindow(windowKey, windowType) {
      if (windowType === 'handleList') {
        let acgnBallData = { ...this.acgnBallData.find((item) => item.ballKey === windowKey) }
        this.ballData.push(acgnBallData)
      } else if (windowKey === 'add') {
        this.ballData.push(this.addBallData)
      }
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
      if (value.windowType === 'handleList') {
        let acgnEditData = value.acgnContent
        this.windowData.push({
          acgnEditData: acgnEditData,
          title: acgnEditData.acgnTitle,
          subTitle: acgnEditData.acgnSubTitle,
          zIndex: ++this.maxZIndex,
          key: acgnEditData.acgnType,
          windowType: 'dataHandle'
        })
        this.moveWindowCount++
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.creator-index {
  width: 100%;
  height: 100%;
}
</style>
