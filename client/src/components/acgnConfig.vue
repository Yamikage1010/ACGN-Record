<template>
  <div class="acgnConfig">
    <div class="acgn-form-item">
      <label>樱花特效</label>
      <el-radio-group v-model="acgnConfig.sakuraShow">
        <el-radio :label="true">默认开启</el-radio>
        <el-radio :label="false">默认关闭</el-radio>
      </el-radio-group>
    </div>
    <div class="acgn-form-item">
      <label>主题颜色</label>
      <el-radio-group v-model="acgnConfig.acgnTheme" @change="changeTheme">
        <el-radio :label="1001">樱花粉</el-radio>
        <el-radio :label="1000">蕾姆蓝</el-radio>
      </el-radio-group>
    </div>
    <div class="acgn-form-item">
      <label>背景音乐</label>
      <el-radio-group v-model="acgnConfig.autoplay">
        <el-radio :label="true">默认播放</el-radio>
        <el-radio :label="false">默认关闭</el-radio>
      </el-radio-group>
    </div>
    <div class="acgn-form-item">
      <label>背景图片</label>
      <el-radio-group v-model="acgnConfig.slidesOrOnly">
        <el-radio :label="true">默认幻灯片</el-radio>
        <el-radio :label="false">默认单图</el-radio>
      </el-radio-group>

      <label>已上传图片 </label>
      <div>
        <div style="display: inline" v-for="item in beforeFileList" :key="item.name">
          <img :src="item.url" style="width: 200px" />
          <!-- <div>{{ item.name }}</div> -->
        </div>
      </div>

      <label>上传图片 </label>
      <el-upload
        class="upload-pic"
        action="http://localhost:9810/acgnrecord/configPicUpload"
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

    <div class="acgn-form-item">
      <label>上传音乐</label>
      <el-upload
        class="upload-demo"
        action="http://localhost:9810/acgnrecord/configMusicUpload"
        multiple
        :headers="requesHeaders"
        :on-success="uploadMusicSuccess"
      >
        <acgn-button :noStop="true">点击上传</acgn-button>
        <div slot="file" slot-scope="{ file }">
          <!-- <div class="upload-progress"></div> -->
          <div>{{ file.name }}</div>
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
import { changeTheme } from '@/util/systemStyle'
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
      beforeFileList: [],
      fileList: [],
      musicList: []
    }
  },
  mounted() {
    this.requesHeaders.token = this.$localStorage.get('Token')
    this.userData = this.$localStorage.get('userData') || { acgnUid: null }
    if (this.$localStorage.get('acgnConfig')) {
      this.acgnConfig = this.$localStorage.get('acgnConfig')
      if (this.acgnConfig.backgroundImages && this.acgnConfig.backgroundImages.length != 0) {
        this.acgnConfig.backgroundImages.forEach((item) => {
          this.beforeFileList.push({ name: item, url: 'http://localhost:9810/acgnrecord/image/' + item })
        })
      }
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
      changeTheme(this.acgnConfig.acgnTheme)
    },
    saveAcgnConfig() {
      let backgroundImages = this.fileList.map((item) => {
        if (item.status === 'success') {
          return this.userData.acgnUid + '_' + item.file.name
        }
      })
      let backgroundMusic = this.musicList.map((item) => {
        // if (item.status === 'success') {
        return this.userData.acgnUid + '_' + item
        // }
      })
      if (!this.acgnConfig.backgroundImages) {
        this.acgnConfig.backgroundImages = []
      }
      if (!this.acgnConfig.backgroundMusic) {
        this.acgnConfig.backgroundMusic = []
      }
      this.acgnConfig.backgroundImages.push(...backgroundImages)
      this.acgnConfig.backgroundMusic.push(...backgroundMusic)
      saveAcgnConfig({ acgnConfig: JSON.stringify(this.acgnConfig) }).then((res) => {
        if (res.code == 200) {
          this.$localStorage.set('acgnConfig', this.acgnConfig)
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    uploadSuccess(response, file) {
      // console.log(response)
      this.fileList.find((item) => item.file.name === file.name).status = 'success'
      console.log(file)
      // console.log(fileList)
    },
    uploadMusicSuccess(response, file) {
      this.musicList.push(file.name)
      console.log(file)
    },
    uploadProgress(event, file) {
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
  .upload-pic {
    &::v-deep {
      .el-upload-list__item {
        font-size: 0;
      }
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