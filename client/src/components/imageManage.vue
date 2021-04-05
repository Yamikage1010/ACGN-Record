<template>
  <div class="image-manage">
    <el-dialog
      :visible.sync="imageManageVisible"
      width="800px"
      :show-close="false"
      :close-on-click-modal="false"
      :modal="false"
    >
      <div class="close-manage" v-if="imageManageVisible" @click="closeImageManage">X</div>
      <div class="image-manage-main">
        <div class="image-manage-left"></div>
        <div class="image-manage-right"></div>
      </div>
    </el-dialog>
    <div class="image-manage-mask" v-if="imageManageVisible"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageManageVisible: false
    }
  },
  methods: {
    openImageManage(imageList) {
      console.log(imageList)
      //   let app = document.getElementById('app')
      //   let mask = document.createElement('div')
      //   mask.classList.add('image-manage-mask')
      //   app.appendChild(mask)
      this.imageManageVisible = true
    },
    closeImageManage() {
      this.imageManageVisible = false
      console.log(this.imageManageVisible)
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
  }

  .image-manage-main {
    .image-manage-left {
    }
    .image-manage-right {
    }
  }
  .close-manage {
    width: 40px;
    height: 40px;
    line-height: 40px;
    position: absolute;
    top: -50px;
    right: -50px;
    background-color: $acgnThemeBGColor;
    color: $fontColor;
    border-radius: 20px;
    &:hover {
      cursor: pointer;
      background-color: $acgnThemeBGColorHover;
    }
  }
}
</style>