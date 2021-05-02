<template>
  <div class="image-manage">
    <el-dialog
      :visible.sync="imageManageVisible"
      width="700px"
      :top="'80px'"
      :show-close="false"
      :close-on-click-modal="false"
      :modal="false"
    >
      <div slot="title" style="font-size: 25px; letter-spacing: 10px">预览图片</div>
      <div class="close-manage" v-if="imageManageVisible" @click="closeImageManage">X</div>
      <img :src="imgSrc" />
      <div slot="footer">
        <a :href="imgSrc" download="acgnContent">保存图片</a>
      </div>
    </el-dialog>
    <div class="image-manage-mask" v-if="imageManageVisible"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageManageVisible: false,
      imgSrc: ''
    }
  },
  mounted() {},
  methods: {
    openImage(imgSrc) {
      this.imageManageVisible = true
      this.imgSrc = imgSrc
    },
    closeImageManage() {
      this.imageManageVisible = false
    },
    saveImage() {}
  }
}
</script>

<style lang="scss" scoped>
.image-manage {
  width: 100%;
  height: 100%;
  position: absolute;
  img {
    width: 600px;
  }
  a {
    display: inline;
    background-color: $acgnThemeColor;
    width: 150px;
    height: 50px;
    border: 2px solid #ffffff;
    border-radius: 4px;
    color: #ffffff;
    padding: 5px 10px;
    text-decoration: none;
  }
  &::v-deep {
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
      text-align: center;
      .upload-pic {
        display: inline-block;
      }
    }
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
}
</style>