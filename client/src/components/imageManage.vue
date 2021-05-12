<template>
  <div class="image-manage">
    <el-dialog
      :visible.sync="imageManageVisible"
      width="1100px"
      :top="'80px'"
      :show-close="false"
      :close-on-click-modal="false"
      :modal="false"
    >
      <div slot="title" style="font-size: 25px; letter-spacing: 10px">图片管理</div>
      <div class="close-manage" v-if="imageManageVisible" @click="closeImageManage">X</div>
      <div class="image-manage-left">
        <div class="image-box">
          <img :src="leftImage" />
        </div>
      </div>
      <div class="image-manage-right">
        <div
          class="image-box"
          v-for="(imgItem, index) in imageManageList"
          :key="index"
          @click="clickImage(imgItem.url)"
        >
          <div class="image-box-mask" v-if="imgItem.status !== 'noNowUpData'">
            <!-- {{ imgItem.status === 'success' ? '上传成功' : '上传失败' }} -->
            <el-progress
              type="circle"
              :width="70"
              :percentage="imgItem.loaded"
              :stroke-width="3"
              :status="imgItem.status"
            ></el-progress>
          </div>
          <img :src="imgItem.url" />
          <div class="setting-image">
            <acgn-button v-if="index !== 0" :fontSize="10" :width="50" @click="setTitleImage(index)">封面</acgn-button>
            <acgn-button :fontSize="10" :width="50" :buttonType="'danger'" @click="deleteImage(index)"
              >删除</acgn-button
            >
          </div>
        </div>
        <div class="image-box">
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
            drag
            multiple
          >
            <img src="http://localhost:9810/acgnrecord/defaultImage/sora.jpg" />
          </el-upload>
        </div>
      </div>
      <div slot="footer">
        <el-upload
          class="upload-pic"
          action="http://localhost:9810/acgnrecord/picUpload"
          multiple
          :show-file-list="false"
          :auto-upload="true"
          :list-type="'picture'"
          :headers="requesHeaders"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-progress="uploadProgress"
        >
          <acgn-button :noStop="true">上传图片</acgn-button>
        </el-upload>
        <acgn-button @click="saveImageManage">保存</acgn-button>
      </div>
    </el-dialog>
    <div class="image-manage-mask" v-if="imageManageVisible"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: {},
      imageManageList: [],
      imageList: [],
      leftImage: '',
      imageManageVisible: false,
      requesHeaders: {}
    }
  },
  mounted() {
    this.requesHeaders.token = this.$localStorage.get('Token')
    this.userData = this.$localStorage.get('userData') || { acgnUid: null }
  },
  methods: {
    openImageManage(imageList) {
      console.log(imageList)
      this.imageManageVisible = true
      this.imageList = imageList
      if (imageList.length && imageList.length > 0) {
        this.imageManageList = imageList.map((item) => {
          return {
            name: item,
            status: 'noNowUpData',
            url: 'http://localhost:9810/acgnrecord/image/' + item
          }
        })
        this.leftImage = this.imageManageList[0].url
      } else {
        this.imageManageList = []
        this.leftImage = ''
      }
    },
    closeImageManage() {
      this.imageManageVisible = false
      console.log(this.imageList)
    },
    clickImage(imgItem) {
      this.leftImage = imgItem
    },
    setTitleImage(index) {
      if (index !== 0) {
        let changeImage = this.imageManageList[0]
        this.$set(this.imageManageList, 0, this.imageManageList[index])
        this.$set(this.imageManageList, index, changeImage)
        // this.imageManageList[0] = this.imageManageList[index]
        // this.imageManageList[index] = changeImage
      }
    },
    deleteImage(index) {
      this.imageManageList.splice(index, 1)
    },
    saveImageManage() {
      this.imageList.splice(0, this.imageList.length, ...this.imageManageList.map((item) => item.name))
      this.closeImageManage()
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
        this.imageManageList.push({
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
      let successFile = this.imageManageList.find((item) => item.fileName === file.name)
      successFile.name = response.data.extname
      successFile.loaded = 100
      successFile.status = 'success'
      // successFile.url = 'http://localhost:9810/acgnrecord/image/' + successFile.name
      // this.imageManageList.find((item) => item.fileName === file.name).url = 'success'
    },
    uploadProgress(event, file, fileList) {
      this.imageManageList.find((item) => item.fileName === file.name).loaded = Math.floor(
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
.image-manage {
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
      .image-manage-left {
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
      .image-manage-right {
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

  // .image-manage-main {
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