<template>
  <div class="acgnConfig">
    <div class="acgn-form">
      <label>樱花特效</label>
      <el-radio-group v-model="acgnConfig.sakuraShow">
        <el-radio :label="true">默认开启</el-radio>
        <el-radio :label="false">默认关闭</el-radio>
      </el-radio-group>
    </div>
    <div class="acgn-form">
      <label>主题颜色</label>
      <el-radio-group v-model="acgnConfig.acgnTheme" @change="changeTheme">
        <el-radio :label="1001">樱花粉</el-radio>
        <el-radio :label="1000">蕾姆蓝</el-radio>
      </el-radio-group>
    </div>
    <div class="acgn-form">
      <label>背景音乐</label>
      <el-radio-group v-model="acgnConfig.autoplay">
        <el-radio :label="true">默认播放</el-radio>
        <el-radio :label="false">默认关闭</el-radio>
      </el-radio-group>
    </div>
    <div class="acgn-form">
      <label>背景图片</label>
      <el-radio-group v-model="acgnConfig.slidesOrOnly">
        <el-radio :label="true">默认幻灯片</el-radio>
        <el-radio :label="false">默认单图</el-radio>
      </el-radio-group>

      <label>上传图片 </label>
      <el-upload
        action="http://localhost:9810/acgnrecord/picUpload"
        multiple
        :headers="requesHeaders"
        list-type="picture-card"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :on-progress="uploadProgress"
      >
        <div slot="file" slot-scope="{ file }">
          <div class="upload-mask">
            <div class="upload-status">{{ fileStatus(file) }}</div>
            <div class="upload-progress">{{ fileProgress(file) }}</div>
          </div>
          <!-- <div class="upload-progress"></div> -->
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <!-- <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">查看 </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">下载 </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">删除 </span>
          </span> -->
        </div>
      </el-upload>
    </div>
    <acgn-button @click="saveAcgnConfig" :disabled="uploadStatus">保存设置</acgn-button>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { saveAcgnConfig } from '@/api/acgnConfig'
export default {
  data() {
    return {
      userData: {},
      acgnConfig: {
        sakuraShow: true,
        autoplay: true,
        slidesOrOnly: true,
        acgnTheme: 1001
      },
      dialogVisible: false,
      disabled: false,
      dialogImageUrl: '',
      requesHeaders: {},
      fileUploadProgress: {},
      loaded: 0,
      total: 0,
      fileList: []
    }
  },
  mounted() {
    this.requesHeaders.token = this.$localStorage.get('Token')
    this.userData = this.$localStorage.get('userData') || { uid: null }
    if (this.$localStorage.get('acgnConfig')) {
      this.acgnConfig = this.$localStorage.get('acgnConfig')
    }
  },
  computed: {
    fileStatus() {
      return function (file) {
        return this.fileList.find((item) => item.file.name === file.name).status
      }
    },
    fileProgress() {
      return function (file) {
        return this.fileList.find((item) => item.file.name === file.name).loaded + '/' + file.size
      }
    },
    uploadStatus() {
      return this.fileList.find((item) => item.status === 'uploading') ? true : false
    }
  },
  methods: {
    changeTheme() {
      let body = document.getElementsByTagName('body')[0]
      if (this.acgnConfig.acgnTheme === 1001) {
        body.style.setProperty('--backgroundColor-theme', '#ffaaee')
        body.style.setProperty('--color-theme', '#ff88cc')
        body.style.setProperty('--backgroundColorHover-theme', '#ff88cc')
        body.style.setProperty('--colorHover-theme', '#ff88cc')
      } else if (this.acgnConfig.acgnTheme === 1000) {
        body.style.setProperty('--backgroundColor-theme', '#91bef0')
        body.style.setProperty('--color-theme', '#6eb1fd')
        body.style.setProperty('--backgroundColorHover-theme', '#6eb1fd')
        body.style.setProperty('--colorHover-theme', '#6eb1fd')
      }
    },
    saveAcgnConfig() {
      let backgroundImages = this.fileList.map((item) => {
        if (item.status === 'success') {
          return this.userData.uid + '_' + item.file.name
        }
      })
      this.acgnConfig.backgroundImages = [...backgroundImages]
      saveAcgnConfig({ acgnConfig: JSON.stringify(this.acgnConfig) }).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    uploadSuccess(response, file, fileList) {
      // console.log(response)
      this.fileList.find((item) => item.file.name === file.name).status = 'success'
      console.log(file)
      // console.log(fileList)
    },
    uploadProgress(event, file, fileList) {
      this.fileList.find((item) => item.file.name === file.name).loaded = event.loaded
      // this.loaded = event.loaded
      // this.total = event.total
    },
    beforeUpload(file) {
      if (!this.fileList.find((item) => item.file.name === file.name)) {
        this.fileList.push({ file: file, status: 'uploading', loaded: 0 })
      } else {
        return false
      }
    },
    handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnConfig {
  width: 100%;
  height: 100%;
  &::v-deep {
    .el-upload-list__item {
      font-size: 0;
    }
  }
}
.upload-mask {
  width: 100%;
  height: 100%;
  font-size: 30px;
  background-color: #000;
  color: #fff;
  opacity: 0.5;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .upload-status {
    display: inline-block;
  }
  .upload-progress {
    font-size: 15px;
  }
}
</style>