<template>
  <div class="acgnConfig">
    <div class="acgn-form-box">
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
      </div>
    </div>
    <div class="acgn-form-box">
      <div class="acgn-form-item">
        <label class="acgn-form-item-label">系统壁纸</label>
        <el-carousel
          :interval="5000"
          type="card"
          height="150px"
          style="margin-top: 30px; min-width: 350px"
          v-if="acgnConfig.backgroundImages.length > 0"
        >
          <el-carousel-item v-for="(item, index) in acgnConfig.backgroundImages" :key="index">
            <img
              :src="'http://localhost:9810/acgnrecord/GMImage/' + item"
              style="max-width: 200px; max-height: 200px"
            />
          </el-carousel-item>
        </el-carousel>
        <img
          style="max-width: 200px; max-height: 200px"
          v-else-if="acgnConfig.backgroundImages.length === 1"
          :src="'http://localhost:9810/acgnrecord/GMImage/' + acgnConfig.backgroundImages[0]"
        />
        <acgn-button @click="openConfigManage('image')">图片管理</acgn-button>
      </div>
    </div>
    <div class="acgn-form-box">
      <div class="acgn-form-item">
        <label class="acgn-form-item-label">系统音乐</label>
        <div class="acgn-config-music" v-if="acgnConfig.backgroundMusic.length > 0">
          <div class="acgn-config-music-item" v-for="(sourse, index) in acgnConfig.backgroundMusic" :key="index">
            {{ sourse.split('_')[2] }}
          </div>
        </div>
        <acgn-button @click="openConfigManage('music')">音乐管理</acgn-button>
      </div>
    </div>
    <acgn-button @click="saveAcgnConfig">保存设置</acgn-button>
  </div>
</template>

<script>
import Bus from '@/common/bus'
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
        acgnTheme: 1001,
        backgroundImages: [],
        backgroundMusic: []
      }
    }
  },
  mounted() {
    this.userData = this.$localStorage.get('userData') || { acgnUid: null }
    if (this.$localStorage.get('acgnConfig')) {
      this.acgnConfig = this.$localStorage.get('acgnConfig')
    }
  },
  computed: {},
  methods: {
    changeTheme() {
      changeTheme(this.acgnConfig.acgnTheme)
    },
    saveAcgnConfig() {
      saveAcgnConfig({ acgnConfig: JSON.stringify(this.acgnConfig) }).then((res) => {
        if (res.code == 200) {
          this.$localStorage.set('acgnConfig', this.acgnConfig)
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    openConfigManage(type) {
      if (type === 'image') {
        Bus.$emit('openConfigManage', this.acgnConfig.backgroundImages, type)
      } else {
        Bus.$emit('openConfigManage', this.acgnConfig.backgroundMusic, type)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnConfig {
  width: 100%;
  height: 100%;
  .acgn-config-music {
    margin-top: 10px;
    display: flex;
    width: 80%;
    max-height: 300px;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    .acgn-config-music-item {
      padding: 10px 10px;
      border-bottom: 1px #fff solid;
      font-size: 15px;
      color: #fff;
      margin-bottom: 10px;
    }
  }
}
</style>