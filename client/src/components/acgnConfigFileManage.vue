<template>
  <div class="config-manage" v-if="configManageVisible">
    <el-dialog
      :visible.sync="configManageVisible"
      width="1100px"
      :top="'80px'"
      :show-close="false"
      :close-on-click-modal="false"
      :modal="false"
    >
      <div slot="title" style="font-size: 25px; letter-spacing: 10px">
        {{ manageType === 'image' ? '图片管理' : '音乐管理' }}
      </div>
      <div class="close-manage" v-if="configManageVisible" @click="closeConfigManage">X</div>
      <div class="config-manage-left">
        <div v-if="manageType === 'image'" style="position: absolute; top: 20px; color: #fff; font-size: 18px">
          请至少上传三张图片才可使用幻灯片背景
        </div>
        <div v-else style="position: absolute; top: 20px; color: #fff; font-size: 18px">
          上传的音乐请以（歌手 - 歌名）的文件名格式上传，短线为减号左右有空格。
        </div>
        <div class="image-box">
          <img :src="leftImage" v-if="manageType === 'image'" />
          <audio :src="leftImage" controls v-else>您的浏览器不支持该音乐播放组件。</audio>
        </div>
      </div>
      <div class="config-manage-right">
        <div
          class="image-box"
          v-for="(fileItem, index) in configManageList"
          :key="index"
          @click="clickImage(fileItem.url)"
        >
          <div class="image-box-mask" v-if="fileItem.status !== 'noNowUpData'">
            <!-- {{ fileItem.status === 'success' ? '上传成功' : '上传失败' }} -->
            <el-progress
              type="circle"
              :width="70"
              :percentage="fileItem.loaded"
              :stroke-width="3"
              :status="fileItem.status"
            ></el-progress>
          </div>
          <img :src="fileItem.url" v-if="manageType === 'image'" />
          <div style="min-height: 70px; font-size: 15px; color: #fff; display: flex; align-items: center" v-else>
            {{ fileItem.name.split('_')[2] }}
          </div>
          <div class="setting-image">
            <acgn-button
              v-if="index !== 0 && manageType === 'image'"
              :fontSize="10"
              :width="50"
              @click="setTitleImage(index)"
              >设定单图</acgn-button
            >
            <acgn-button :fontSize="10" :width="50" :buttonType="'danger'" @click="deleteImage(index)"
              >删除</acgn-button
            >
          </div>
        </div>
        <div class="image-box" v-if="configManageList.length <= 20 && manageType === 'image'">
          <el-upload
            :action="'http://localhost:9810/acgnrecord/picUpload'"
            :show-file-list="false"
            :auto-upload="true"
            :headers="requesHeaders"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-progress="uploadProgress"
            drag
            multiple
          >
            <img src="http://localhost:9810/acgnrecord/defaultImage/sora.jpg" />
          </el-upload>
        </div>
        <div
          class="image-box"
          v-else-if="configManageList.length > 20"
          style="font-size: 20px; padding: 10px; color: #fff; margin-bottom: 10px"
        >
          文件上限为20
        </div>
      </div>
      <div slot="footer">
        <el-upload
          class="upload-pic"
          :action="
            manageType === 'image'
              ? 'http://localhost:9810/acgnrecord/picUpload'
              : 'http://localhost:9810/acgnrecord/musicUpload'
          "
          multiple
          :show-file-list="false"
          :auto-upload="true"
          :headers="requesHeaders"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-progress="uploadProgress"
          v-if="configManageList.length <= 20"
        >
          <acgn-button v-if="manageType === 'image'" :noStop="true">上传图片</acgn-button>
          <acgn-button v-else :noStop="true">上传音乐</acgn-button>
        </el-upload>
        <acgn-button @click="saveConfigManage">保存</acgn-button>
      </div>
    </el-dialog>
    <div class="image-manage-mask" v-if="configManageVisible"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: {},
      configManageList: [],
      dataList: [],
      manageType: 'image',
      leftImage: '',
      configManageVisible: false,
      requesHeaders: {}
    }
  },
  mounted() {
    this.requesHeaders.token = this.$localStorage.get('Token')
    console.log(this.requesHeaders.token)
    this.userData = this.$localStorage.get('userData') || { acgnUid: null }
  },
  methods: {
    openConfigManage(dataList, type) {
      console.log(dataList)
      this.configManageVisible = true
      this.dataList = dataList
      this.manageType = type
      if (type === 'image') {
        if (dataList.length && dataList.length > 0) {
          this.configManageList = dataList.map((item) => {
            return {
              name: item,
              status: 'noNowUpData',
              url: 'http://localhost:9810/acgnrecord/image/' + item
            }
          })
          this.leftImage = this.configManageList[0].url
        } else {
          this.configManageList = []
          this.leftImage = ''
        }
      } else {
        if (dataList.length && dataList.length > 0) {
          this.configManageList = dataList.map((item) => {
            return {
              name: item,
              status: 'noNowUpData',
              url: 'http://localhost:9810/acgnrecord/music/' + item
            }
          })
          this.leftImage = this.configManageList[0].url
        } else {
          this.configManageList = []
          this.leftImage = ''
        }
      }
    },
    closeConfigManage() {
      this.configManageVisible = false
      console.log(this.dataList)
    },
    clickImage(fileItem) {
      this.leftImage = fileItem
    },
    setTitleImage(index) {
      if (index !== 0) {
        let changeImage = this.configManageList[0]
        this.$set(this.configManageList, 0, this.configManageList[index])
        this.$set(this.configManageList, index, changeImage)
        // this.configManageList[0] = this.configManageList[index]
        // this.configManageList[index] = changeImage
      }
    },
    deleteImage(index) {
      this.configManageList.splice(index, 1)
    },
    saveConfigManage() {
      if (this.configManageList.length > 20) {
        this.$message.warning('文件上限为20')
      } else {
        this.dataList.splice(0, this.dataList.length, ...this.configManageList.map((item) => item.name))
        this.closeConfigManage()
      }
    },
    beforeUpload(file) {
      //file是File对象
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
        let fileUrl
        try {
          fileUrl = URL.createObjectURL(file)
        } catch (err) {
          console.error('[Element Error][Upload]', err)
        }
        // let exName = this.userData.acgnUid + '_' + file.name
        this.configManageList.push({
          fileName: file.name,
          name: '',
          status: null,
          loaded: 0,
          url: fileUrl
        })
      } else {
        this.$message.warning('选择的文件中存在非图片文件，请上传图片文件')
        return false
      }
    },
    uploadChange(file, fileList) {},
    uploadSuccess(response, file, fileList) {
      console.log(fileList)
      console.log(file)
      let successFile = this.configManageList.find((item) => item.fileName === file.name)
      successFile.name = response.data.extname
      successFile.loaded = 100
      successFile.status = 'success'
      // successFile.url = 'http://localhost:9810/acgnrecord/image/' + successFile.name
      // this.configManageList.find((item) => item.fileName === file.name).url = 'success'
    },
    uploadProgress(event, file, fileList) {
      this.configManageList.find((item) => item.fileName === file.name).loaded = Math.floor(
        (event.loaded / file.size) * 100
      )
      // console.log(fileList)
      // console.log(event)
      // console.log(file)
    }
  }
}
</script>

<style lang="scss" scoped>
.config-manage {
  width: 100%;
  height: 100%;
  position: absolute;
  &::v-deep {
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
      .config-manage-left {
        position: absolute;
        width: 65%;
        height: 83%;
        border: 1px solid $fontColor;
        display: flex;
        align-items: center;
        justify-content: center;
        .image-box {
          font-size: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            max-width: 90%;
            max-height: 90%;
            transition: 0.2s ease;
          }
        }
      }
      .config-manage-right {
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
        .image-box {
          margin-top: 20px;
          border: 2px solid #fff;
          font-size: 0;
          display: flex;
          flex-direction: column;
          padding: 4px;
          position: relative;
          &:hover {
            cursor: pointer;
            border-color: $acgnThemeBGColor;
          }
          img {
            width: 120px;
          }
          .image-box-mask {
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
          .image-box-mask:after {
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

  // .config-manage-main {
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