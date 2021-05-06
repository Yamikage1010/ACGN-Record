<template>
  <div class="master-index">
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
      @closeWindow="closeWindow(item)"
      @click="setZIndex"
      @clickListItem="clickListItem"
    >
    </move-window>
    <master-user-data ref="masterUserData"></master-user-data>
  </div>
</template>

<script>
import Bus from '@/common/bus'
import floatBall from '@/components/floatBall'
import moveWindow from '@/components/moveWindow.vue'
import { ACGN } from '@/common/acgn'
import masterUserData from '@/components/masterUserData'
export default {
  components: {
    floatBall,
    moveWindow,
    masterUserData
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
          ballKey: 'file',
          title: 'file',
          subTitle: '文件管理',
          top: ballTop * 1.5,
          left: ballWidth,
          width: ballTop,
          height: ballTop,
          windowType: 'master'
        },
        {
          ballKey: 'acgn',
          title: 'acgn',
          subTitle: '管理作品',
          top: ballTop * 1.5,
          left: ballWidth * 4,
          width: ballTop,
          height: ballTop,
          windowType: 'master'
        },
        {
          ballKey: 'user',
          title: 'user',
          subTitle: '用户管理',
          top: ballTop * 0.5,
          left: ballWidth * 2.5,
          width: ballTop,
          height: ballTop,
          windowType: 'master'
        }
      ],
      fileBallData: {
        ballKey: 'file',
        title: 'file',
        subTitle: '图片管理',
        top: ballTop,
        left: ballWidth,
        width: ballTop,
        height: ballTop,
        windowType: 'master'
      },
      acgnBallData: {
        ballKey: 'acgn',
        title: 'acgn',
        subTitle: '管理作品',
        top: ballTop,
        left: ballWidth * 4,
        width: ballTop,
        height: ballTop,
        windowType: 'master'
      },
      userBallData: {
        ballKey: 'user',
        title: 'user',
        subTitle: '用户管理',
        top: ballTop * 0.5,
        left: ballWidth * 2.5,
        width: ballTop,
        height: ballTop,
        windowType: 'master'
      },
      maxZIndex: 0, //置顶窗口zIndex值
      moveWindowCount: 0, //窗口数量
      windowData: []
    }
  },
  mounted() {
    Bus.$on('readUserData', (userData) => {
      console.log(1111)
      this.$refs.masterUserData.openUserDataDialog(userData)
    })
  },
  methods: {
    clickBall(item) {
      if (item.ballKey == 'manage') {
        this.ballData.push(...this.acgnBallData)
      } else {
        let windowId = item.ballKey + '_' + item.windowType
        if (!this.windowData.find((wd) => wd.windowId === windowId)) {
          this.windowData.push({
            title: item.title,
            subTitle: item.subTitle,
            zIndex: ++this.maxZIndex,
            key: item.ballKey,
            top: item.top / 2,
            left: item.left,
            width: 1000,
            height: 600,
            windowType: item.windowType,
            windowId: windowId
          })
          this.moveWindowCount++
        } else {
          this.$message.warning('已打开该窗口')
        }
      }
    },
    closeWindow(windowData) {
      if (windowData.key === 'acgn') {
        this.ballData.push(this.acgnBallData)
      } else if (windowData.key === 'file') {
        this.ballData.push(this.fileBallData)
      } else if (windowData.key === 'user') {
        this.ballData.push(this.userBallData)
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
      if (value.windowType === 'handleList') {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.master-index {
  width: 100%;
  height: 100%;
}
</style>
