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
    <master-acgn-data ref="masterAcgnData"></master-acgn-data>

    <move-message
      v-moveMessage
      :zIndex="1000"
      :height="360"
      :top="item.top"
      :left="item.left"
      :title="item.title"
      :ref="'banReason' + index"
      v-for="(item, index) in messageData"
      :key="'banReason' + index"
      @closeMessage="closeMessage(index)"
      @confirmMessage="confirmMessage(index)"
    >
      <div style="margin-top: 10px">
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">请输入封禁原因</label>
          <textarea style="min-height: 100px; font-size: 17px" v-model="banReason" />
        </div>
      </div>
    </move-message>
  </div>
</template>

<script>
import Bus from '@/common/bus'
import floatBall from '@/components/floatBall'
import moveWindow from '@/components/moveWindow.vue'
import { ACGN } from '@/common/acgn'
import masterUserData from '@/components/masterUserData'
import masterAcgnData from '@/components/masterAcgnData'
import { getAcgnContentData, changeAcgnContentStatus } from '@/api/master'
export default {
  components: {
    floatBall,
    moveWindow,
    masterUserData,
    masterAcgnData
  },
  data() {
    let ballWidth = window.innerWidth / 6
    let ballTop = window.innerHeight / 3
    let ballTop2 = window.innerHeight / 10
    return {
      messageData: [],
      banReason: '因神秘力量该作品记录被封印了',
      acgnId: ' ',
      acgnStatus: ' ',
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
    Bus.$on('readAcgnData', (acgnData) => {
      console.log(2222)
      this.$refs.masterAcgnData.openAcgnDataDialog(acgnData)
    })

    Bus.$on('changeAcgnStatus', (data) => {
      if (this.messageData.find((item) => item.messageType === 'banReason')) {
        this.$message.warning('已打开该窗口,请完成上个操作')
      } else {
        this.messageData.push({
          top: data.event.clientY - 150,
          left: data.event.clientX - 200,
          title: '封禁原因',
          messageType: 'banReason'
        })
        this.acgnId = data.acgnId
        this.acgnStatus = data.acgnStatus
      }
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
            top: item.top / 2 - 100,
            left: item.left - 300,
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
    },
    closeMessage(dataIndex) {
      this.messageData[dataIndex].messageType = ''
    },
    confirmMessage(dataIndex) {
      changeAcgnContentStatus({
        acgnId: this.acgnId,
        acgnStatus: this.acgnStatus,
        banReason: this.banReason
      })
        .then((res) => {
          if (res.code === 200) {
            Bus.$emit('refreshAcgnTable')
            this.$refs['banReason' + dataIndex][0].close()
            this.$message.success(res.msg)
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('前端出bug啦')
        })
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
