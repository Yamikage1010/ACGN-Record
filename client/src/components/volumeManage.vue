<template>
  <div class="volume-manage">
    <el-dialog
      :visible.sync="volumeManageVisible"
      width="1100px"
      :top="'80px'"
      :show-close="false"
      :close-on-click-modal="false"
      :modal="false"
    >
      <div slot="title" style="font-size: 25px; letter-spacing: 10px">分卷管理</div>
      <div class="close-manage" v-if="volumeManageVisible" @click="closeVolumeManage">X</div>
      <div class="volume-manage-left">
        <div class="volume-box" v-if="leftVolume.title">
          <div class="volume-manage-left-title">{{ leftVolume.title }}</div>
          <div class="volume-box">
            <img v-if="leftVolume.cover" :src="'http://localhost:9810/acgnrecord/image/' + leftVolume.cover" />
            <img v-else :src="'http://localhost:9810/acgnrecord/defaultImage/noImage.jpg'" />
            <div class="volume-manage-left-content">{{ leftVolume.content }}</div>
          </div>
        </div>
      </div>
      <div class="volume-manage-right">
        <div
          class="volume-box"
          v-for="(volumeItem, index) in volumeManageList"
          :key="index"
          @click="clickVolume(volumeItem)"
        >
          <p v-if="!changeTitles[index]">{{ volumeItem.title }}</p>
          <template v-else>
            <input v-model="volumeItem.title" /><textarea v-model="volumeItem.content"></textarea>
          </template>
          <div class="setting-volume">
            <acgn-button v-if="!changeTitles[index]" :fontSize="10" :width="50" @click="changeTitle(index)">
              修改内容
            </acgn-button>
            <acgn-button v-else :fontSize="10" :width="50" @click="changeTitleConfirm(index)"> 确定 </acgn-button>
            <acgn-button :fontSize="10" :width="50" :buttonType="'danger'" @click="deleteVolume(index)">
              删除
            </acgn-button>
          </div>
        </div>
        <div class="volume-box" v-if="addVolumeVisible" style="cursor: default">
          <input v-model="addVolumeData.title" placeholder="请输入标题" />
          <textarea v-model="addVolumeData.content" placeholder="请输入卷内容"></textarea>
          <div class="volume-box-mask" v-if="addVolumeData.status !== 'noNowUpData'">
            <!-- {{ volumeItem.status === 'success' ? '上传成功' : '上传失败' }} -->
            <el-progress
              type="circle"
              :width="70"
              :percentage="addVolumeData.loaded"
              :stroke-width="3"
              :status="addVolumeData.status"
            ></el-progress>
          </div>
          <el-upload
            class="upload-pic"
            action="http://localhost:9810/acgnrecord/picUpload"
            :limit="1"
            :show-file-list="false"
            :auto-upload="true"
            :list-type="'picture'"
            :headers="requesHeaders"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-progress="uploadProgress"
            v-if="!addVolumeData.cover"
          >
            <acgn-button :noStop="true">上传封面</acgn-button>
          </el-upload>
          <img v-else :src="addVolumeData.imageSrc" />
          <acgn-button @click="addVolumeConfirm">确认新增</acgn-button>
        </div>
      </div>
      <div slot="footer">
        <acgn-button @click="addVolume">{{ addVolumeVisible ? '取消' : '新增分卷' }}</acgn-button>
        <acgn-button @click="saveVolumeManage">保存</acgn-button>
      </div>
    </el-dialog>
    <div class="image-manage-mask" v-if="volumeManageVisible"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: {},
      volumeManageList: [],
      volumeList: [],
      leftVolume: {},
      volumeManageVisible: false,
      requesHeaders: {},
      addVolumeVisible: false,
      addVolumeData: {
        title: '',
        cover: '',
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
    openVolumeManage(volumeList) {
      console.log(volumeList)
      this.volumeManageVisible = true
      this.volumeList = volumeList
      if (volumeList.length && volumeList.length > 0) {
        this.volumeManageList = volumeList.map((item) => {
          item.status = 'noNowUpData'
          return item
        })
        this.leftVolume = this.volumeManageList[0]
      } else {
        this.volumeManageList = []
        this.leftVolume = {}
      }
    },
    closeVolumeManage() {
      this.volumeManageVisible = false
      this.addVolumeData = {
        title: '',
        cover: '',
        content: '',
        status: 'noNowUpData',
        loaded: 0
      }
      console.log(this.volumeList)
    },
    clickVolume(volumeItem) {
      this.leftVolume = volumeItem
    },
    changeTitle(index) {
      this.$set(this.changeTitles, index, true)
    },
    changeTitleConfirm(index) {
      this.$set(this.changeTitles, index, false)
    },
    deleteVolume(index) {
      this.volumeManageList.splice(index, 1)
    },
    addVolume() {
      if (this.addVolumeVisible) {
        this.addVolumeData = {
          title: '',
          cover: '',
          content: '',
          status: 'noNowUpData',
          loaded: 0
        }
      }
      this.addVolumeVisible = !this.addVolumeVisible
    },
    addVolumeConfirm() {
      if (this.addVolumeData.title) {
        this.$message.success('添加成功')
        this.addVolumeVisible = false
        let addVolumeData = {
          title: this.addVolumeData.title,
          cover: this.addVolumeData.cover,
          content: this.addVolumeData.content
        }
        this.volumeManageList.push(addVolumeData)
        this.changeTitles.push(false)
        this.addVolumeData = {
          title: '',
          cover: '',
          content: '',
          status: 'noNowUpData',
          loaded: 0
        }
      } else {
        this.$message.warning('请填写标题')
      }
    },
    saveVolumeManage() {
      //把传过来的数组在原数组修改数据
      this.volumeList.splice(0, this.volumeList.length, ...this.volumeManageList.map((item) => item))
      this.closeVolumeManage()
    },
    beforeUpload(file) {
      //file是File对象
      this.addVolumeData.status = null
      if (file.type.includes('image/')) {
        let fileUrl
        try {
          fileUrl = URL.createObjectURL(file)
        } catch (err) {
          console.error('[Element Error][Upload]', err)
        }
        let exName = this.userData.acgnUid + '_' + file.name
        this.addVolumeData.cover = exName
        this.addVolumeData.imageSrc = fileUrl
      } else {
        this.$message.warning('选择的文件类型错误')
        return false
      }
    },
    uploadChange(file, fileList) {},
    uploadSuccess(response, file, fileList) {
      console.log(fileList)
      console.log(file)
      this.addVolumeData.loaded = 100
      this.addVolumeData.status = 'noNowUpData'
    },
    uploadProgress(event, file, fileList) {
      this.addVolumeData.loaded = Math.floor((event.loaded / file.size) * 100)
      // console.log(fileList)
      // console.log(event)
      // console.log(file)
    }
  }
}
</script>

<style lang="scss" scoped>
.volume-manage {
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
      .volume-manage-left {
        position: absolute;
        width: 65%;
        height: 83%;
        border: 1px solid $fontColor;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: auto;
        color: #fff;
        .volume-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          .volume-manage-left-title {
            font-size: 25px;
            font-weight: 600;
            border-bottom: 1px solid #fff;
            padding: 10px 0;
            margin-bottom: 10px;
          }
          .volume-box {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            img {
              max-width: 45%;
              max-height: 450px;
            }
            .volume-manage-left-content {
              text-align: left;
              width: 45%;
              max-height: 450px;
              font-size: 15px;
              overflow: auto;
            }
          }
        }
      }
      .volume-manage-right {
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
        .volume-box {
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
          textarea {
            font-size: 15px;
            margin-top: 5px;
          }
          textarea {
            min-width: 250px;
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
          .volume-box-mask {
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
          .volume-box-mask:after {
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

  // .volume-manage-main {
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