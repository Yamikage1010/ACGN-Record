<template>
  <div class="sourse-manage">
    <el-dialog
      :visible.sync="sourseManageVisible"
      width="1100px"
      :top="'80px'"
      :show-close="false"
      :close-on-click-modal="false"
      :modal="false"
    >
      <div slot="title" style="font-size: 25px; letter-spacing: 10px">资源管理</div>
      <div class="close-manage" v-if="sourseManageVisible" @click="closeSourseManage">X</div>
      <div class="sourse-manage-left">
        <acgn-content-audio v-if="leftSourse.fileType === 'music'" :musicData="leftSourse"></acgn-content-audio>
        <acgn-content-video v-if="leftSourse.fileType === 'video'" :videoData="leftSourse"></acgn-content-video>
      </div>
      <div class="sourse-manage-right">
        <div
          class="sourse-box"
          v-for="(sourseItem, index) in sourseManageList"
          :key="index"
          @click="clickSourse(sourseItem)"
        >
          <p v-if="!changeTitles[index]">{{ sourseItem.title }}</p>
          <div v-else><input v-model="sourseItem.title" /><span @click="changeTitleConfirm(index)">√</span></div>
          <div class="setting-sourse">
            <acgn-button
              v-if="!changeTitles[index]"
              :fontSize="10"
              :width="50"
              :buttonType="'danger'"
              @click="changeTitle(index)"
            >
              修改标题
            </acgn-button>
            <acgn-button :fontSize="10" :width="50" :buttonType="'danger'" @click="deleteSourse(index)">
              删除
            </acgn-button>
          </div>
        </div>
        <div class="sourse-box" v-if="addSourseVisible" style="cursor: default">
          <input v-model="addSourseData.title" placeholder="请输入标题" />
          <select v-model="addSourseData.fileType">
            <option :value="'music'">音乐</option>
            <option :value="'video'">视频</option>
          </select>
          <div class="sourse-box-mask" v-if="addSourseData.status !== 'noNowUpData'">
            <!-- {{ sourseItem.status === 'success' ? '上传成功' : '上传失败' }} -->
            <el-progress
              type="circle"
              :width="70"
              :percentage="addSourseData.loaded"
              :stroke-width="3"
              :status="addSourseData.status"
            ></el-progress>
          </div>
          <el-upload
            class="upload-pic"
            action="http://localhost:9810/acgnrecord/picUpload"
            :show-file-list="false"
            :auto-upload="true"
            :list-type="'picture'"
            :headers="requesHeaders"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-progress="uploadProgress"
            v-if="addSourseData.fileType === 'music' && !addSourseData.image"
          >
            <acgn-button :noStop="true">上传封面</acgn-button>
          </el-upload>
          <img v-else :src="addSourseData.imageSrc" />
          <el-upload
            class="upload-demo"
            action="http://localhost:9810/acgnrecord/musicUpload"
            :headers="requesHeaders"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-progress="uploadProgress"
            v-if="addSourseData.fileType === 'music' && !addSourseData.music"
          >
            <acgn-button :noStop="true">上传音乐</acgn-button>
          </el-upload>
          <div v-else>{{ addSourseData.music }}</div>
          <el-upload
            class="upload-demo"
            action="http://localhost:9810/acgnrecord/videoUpload"
            :headers="requesHeaders"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-progress="uploadProgress"
            v-if="addSourseData.fileType === 'video' && !addSourseData.video"
          >
            <acgn-button :noStop="true" :disabled="!!addSourseData.video">上传视频</acgn-button>
          </el-upload>
          <div v-else>{{ addSourseData.video }}</div>
          <acgn-button @click="addSourseConfirm">确认新增</acgn-button>
        </div>
      </div>
      <div slot="footer">
        <acgn-button @click="addSourse">{{ addSourseVisible ? '取消' : '新增资源' }}</acgn-button>
        <acgn-button @click="saveSourseManage">保存</acgn-button>
      </div>
    </el-dialog>
    <div class="image-manage-mask" v-if="sourseManageVisible"></div>
  </div>
</template>

<script>
import acgnContentAudio from './acgnContentAudio.vue'
import acgnContentVideo from './acgnContentVideo.vue'
export default {
  components: { acgnContentAudio, acgnContentVideo },
  data() {
    return {
      userData: {},
      sourseManageList: [],
      sourseList: [],
      leftSourse: '',
      sourseManageVisible: false,
      requesHeaders: {},
      addSourseVisible: false,
      addSourseData: {
        fileType: 'music',
        title: '',
        image: '',
        music: '',
        video: '',
        content: '',
        status: 'noNowUpData',
        loaded: 0
      },
      changeTitles: []
    }
  },
  mounted() {
    this.requesHeaders.token = this.$localStorage.get('Token')
    this.userData = this.$localStorage.get('userData') || { acgnUid: null }
  },
  methods: {
    openSourseManage(sourseList) {
      console.log(sourseList)
      this.sourseManageVisible = true
      this.sourseList = sourseList
      if (sourseList.length && sourseList.length > 0) {
        this.sourseManageList = sourseList.map((item) => {
          item.status = 'noNowUpData'
          return item
        })
        this.leftSourse = this.sourseManageList[0]
      } else {
        this.sourseManageList = []
        this.leftSourse = {}
      }
    },
    closeSourseManage() {
      this.sourseManageVisible = false
      this.addSourseData = {
        fileType: 'music',
        title: '',
        image: '',
        music: '',
        video: '',
        content: '',
        status: 'noNowUpData',
        loaded: 0
      }
      console.log(this.sourseList)
    },
    clickSourse(sourseItem) {
      this.leftSourse = sourseItem
    },
    changeTitle(index) {
      this.$set(this.changeTitles, index, true)
    },
    changeTitleConfirm(index) {
      this.$set(this.changeTitles, index, false)
    },
    deleteSourse(index) {
      this.sourseManageList.splice(index, 1)
    },
    addSourse() {
      if (this.addSourseVisible) {
        this.addSourseData = {
          fileType: 'music',
          title: '',
          image: '',
          music: '',
          video: '',
          content: '',
          status: 'noNowUpData',
          loaded: 0
        }
      }
      this.addSourseVisible = !this.addSourseVisible
    },
    addSourseConfirm() {
      if (this.addSourseData.title && (this.addSourseData.music || this.addSourseData.video)) {
        this.$message.success('添加成功')
        this.addSourseVisible = false
        let addSourseData = {
          fileType: this.addSourseData.fileType,
          title: this.addSourseData.title,
          image: this.addSourseData.image,
          content: this.addSourseData.content
        }
        if (addSourseData.fileType === 'music') {
          addSourseData.music = this.addSourseData.music
        } else {
          addSourseData.video = this.addSourseData.video
        }
        this.sourseManageList.push(addSourseData)
        this.changeTitles.push(false)
        this.addSourseData = {
          fileType: 'music',
          title: '',
          image: '',
          music: '',
          video: '',
          content: '',
          status: 'noNowUpData',
          loaded: 0
        }
      } else {
        if (!this.addSourseData.title) {
          this.$message.warning('请填写标题')
        } else {
          this.$message.warning('请上传文件，封面非必需')
        }
      }
    },
    saveSourseManage() {
      //把传过来的数组在原数组修改数据
      this.sourseList.splice(0, this.sourseList.length, ...this.sourseManageList.map((item) => item))
      // this.sourseManageList.forEach((item, index) => {
      //   this.$set(this.sourseList[index], index, item)
      // })
      this.closeSourseManage()
    },
    beforeUpload(file) {
      //file是File对象
      this.addSourseData.status = null
      if (file.type.includes('image/')) {
        let fileUrl
        try {
          fileUrl = URL.createObjectURL(file)
        } catch (err) {
          console.error('[Element Error][Upload]', err)
        }
        this.addSourseData.image = 'exName'
        this.addSourseData.imageSrc = fileUrl
      } else if (this.addSourseData.fileType === 'music') {
        if (file.type.includes('audio/')) {
          this.addSourseData.music = 'exName'
        } else {
          this.$message.warning('选择的文件类型错误')
          return false
        }
      } else {
        if (file.type.includes('video/')) {
          this.addSourseData.video = 'exName'
        } else {
          this.$message.warning('选择的文件类型错误')
          return false
        }
      }
    },
    uploadChange(file, fileList) {},
    uploadSuccess(response, file, fileList) {
      console.log(fileList)
      console.log(file)
      if (this.addSourseData.image === 'exName') {
        this.addSourseData.image = response.data.extname
      } else if (this.addSourseData.music === 'exName') {
        this.addSourseData.music = response.data.extname
      } else if (this.addSourseData.video === 'exName') {
        this.addSourseData.video = response.data.extname
      }
      this.addSourseData.loaded = 100
      this.addSourseData.status = 'noNowUpData'
    },
    uploadProgress(event, file, fileList) {
      this.addSourseData.loaded = Math.floor((event.loaded / file.size) * 100)
      // console.log(fileList)
      // console.log(event)
      // console.log(file)
    }
  }
}
</script>

<style lang="scss" scoped>
.sourse-manage {
  width: 100%;
  height: 100%;
  position: absolute;
  &::v-deep {
    .upload-success {
      color: #fff;
      font-size: 15px;
      line-height: 20px;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      border: 1px solid;
      background-color: green;
      display: inline-block;
      margin-left: 10px;
    }
    .el-upload-dragger {
      width: auto;
      height: auto;
    }
    .el-dialog {
      background-color: $bgColor;
      box-shadow: 5px 5px 9px rgba(0, 0, 0, 0.5);
    }
    .el-dialog__header {
      padding-bottom: 0;
    }
    .el-dialog__footer {
      padding: 0 30px 20px 0;
      height: 90px;
      .acgn-button {
        margin-left: 20px;
      }
      .upload-pic {
        display: inline-block;
      }
    }
    .el-dialog__body {
      height: 450px;
      padding: 20px;
      .sourse-manage-left {
        position: absolute;
        width: 65%;
        height: 83%;
        border: 1px solid $fontColor;
        display: flex;
        align-items: center;
        justify-content: center;
        .sourse-box {
          font-size: 0;
          img {
            width: 90%;
            transition: 0.2s ease;
          }
        }
        .acgnContentAudio,
        .acgnContentVideo {
          width: 500px;
          .play-or-pause {
            width: 500px;
          }
          img {
            max-width: 500px;
            max-height: 450px;
            -webkit-box-reflect: inherit;
          }
          video {
            width: 500px;
            -webkit-box-reflect: inherit;
          }
        }
      }
      .sourse-manage-right {
        position: absolute;
        width: 27%;
        height: 75%;
        left: 70%;
        border: 1px solid $fontColor;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: flex-start;
        align-content: flex-start;
        overflow: auto;
        .sourse-box {
          width: 90%;
          margin-top: 20px;
          border: 2px solid #fff;
          display: flex;
          align-items: center;
          flex-direction: column;
          padding: 4px;
          position: relative;
          color: #fff;
          &:hover {
            cursor: pointer;
            border-color: $acgnThemeBGColor;
          }
          img {
            width: 120px;
          }
          input,
          select {
            font-size: 15px;
            margin-top: 5px;
          }
          span {
            color: #fff;
            font-size: 15px;
            line-height: 20px;
            width: 20px;
            height: 20px;
            border-radius: 20px;
            border: 1px solid;
            background-color: green;
            display: inline-block;
            margin-left: 10px;
            :hover {
              color: rgb(255, 251, 0);
              background-color: rgb(0, 187, 0);
            }
          }
          .sourse-box-mask {
            position: absolute;
            top: 0px;
            left: 0px;
            background: rgba(0, 0, 0, 0.6);
            width: 100%;
            height: calc(100% - 23px);
            // padding-top: 20%;
            color: #fff;
            font-size: 20px;
            &::v-deep {
              .el-progress__text {
                font-size: 13px;
              }
            }
          }
          .sourse-box-mask:after {
          }
          .acgn-button {
            padding: 0;
            margin-top: 5px;
            margin-right: 5px;
          }
        }
      }
    }
  }

  // .sourse-manage-main {
  //   width: 100%;
  //   height: 100%;
  //   padding: 5%;
  // }
  .close-manage {
    width: 40px;
    height: 40px;
    line-height: 40px;
    position: absolute;
    top: -50px;
    right: -50px;
    background-color: $bgColor;
    color: $fontColor;
    border-radius: 20px;
    transition: 0.3s ease;
    &:hover {
      cursor: pointer;
      background-color: $acgnThemeBGColorHover;
      transform: rotate(180deg);
    }
  }
}
</style>