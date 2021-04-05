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
          <img :src="'http://localhost:9810/acgnrecord/image/' + leftImage" />
        </div>
      </div>
      <div class="image-manage-right">
        <div class="image-box" v-for="(imgItem, index) in imageManageList" :key="index" @click="clickImage(imgItem)">
          <img :src="'http://localhost:9810/acgnrecord/image/' + imgItem" />
          <div class="setting-image">
            <acgn-button v-if="index !== 0" :fontSize="10" :width="50" @click="setTitleImage(index)">封面</acgn-button>
            <acgn-button :fontSize="10" :width="50" :buttonType="'danger'" @click="deleteImage(index)"
              >删除</acgn-button
            >
          </div>
        </div>
      </div>
      <div slot="footer">
        <acgn-button>上传图片</acgn-button>
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
      imageManageList: [],
      imageList: [],
      leftImage: '',
      imageManageVisible: false
    }
  },
  methods: {
    openImageManage(imageList) {
      console.log(imageList)
      this.imageList = imageList
      this.imageManageList = [...imageList]
      this.leftImage = this.imageManageList[0]
      this.imageManageVisible = true
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
      this.imageList.splice(0, this.imageList.length, ...this.imageManageList)
      this.closeImageManage()
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
    .el-dialog {
      background-color: $bgColor;
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
          img {
            width: 90%;
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
          &:hover {
            cursor: pointer;
            border-color: $acgnThemeBGColor;
          }
          img {
            width: 120px;
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