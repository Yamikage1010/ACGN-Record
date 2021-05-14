<template>
  <div class="master-userData">
    <el-dialog
      :visible.sync="masterUserDataVisible"
      width="700px"
      :top="'80px'"
      :show-close="false"
      :close-on-click-modal="false"
      :modal="false"
    >
      <div slot="title" style="font-size: 25px; letter-spacing: 10px">用户信息详情</div>
      <div class="close-manage" v-if="masterUserDataVisible" @click="closeUserDataDialog">X</div>
      <div class="userData-main">
        <div class="userData-header">
          <h2>基本信息</h2>
          <div class="mesage">
            <p>
              用户id：<span>{{ userData.acgnUid }}</span>
            </p>
          </div>
          <div class="mesage">
            <p>
              用户名：<span>{{ userData.acgnUserName }}</span>
            </p>
          </div>
          <div class="mesage">
            <p>
              邮箱：<span>{{ userData.acgnUserEmail }}</span>
            </p>
          </div>
        </div>
        <div class="userData-tomo" v-if="userData.acgnTomo && userData.acgnTomo.length > 0">
          <h2>好友列表</h2>
          <div class="tomo" v-for="(item, index) in userData.acgnTomo" :key="index">
            {{ '用户id:' + item.acgnUid + ' / 用户名:' + item.acgnUserName }}
          </div>
        </div>
        <div
          class="userData-config-image"
          v-if="
            userData.acgnConfig &&
            userData.acgnConfig.backgroundImages &&
            userData.acgnConfig.backgroundImages.length > 0
          "
        >
          <h2>系统背景图片</h2>
          <div class="config-image" v-for="(item, index) in userData.acgnConfig.backgroundImages" :key="index">
            <img :src="'http://192.168.43.82:9810/acgnrecord/masterImage/' + item" />
            {{ item }}
          </div>
        </div>
        <div
          class="userData-config-music"
          v-if="
            userData.acgnConfig && userData.acgnConfig.backgroundMusic && userData.acgnConfig.backgroundMusic.length > 0
          "
        >
          <h2>系统音乐</h2>
          <div class="config-music" v-for="(item, index) in userData.acgnConfig.backgroundMusic" :key="index">
            <audio :src="'http://192.168.43.82:9810/acgnrecord/music/' + item" controls>
              您的浏览器不支持该音乐播放组件。
            </audio>
            {{ item }}
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </el-dialog>
    <div class="image-manage-mask" v-if="masterUserDataVisible"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      masterUserDataVisible: false,
      userData: ''
    }
  },
  mounted() {},
  methods: {
    openUserDataDialog(userData) {
      this.masterUserDataVisible = true
      this.userData = { ...userData }
      this.userData.acgnConfig = JSON.parse(userData.acgnConfig)
      this.userData.acgnTomo = JSON.parse(userData.acgnTomo)
    },
    closeUserDataDialog() {
      this.masterUserDataVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.master-userData {
  width: 100%;
  height: 100%;
  position: absolute;
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
    .userData-main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      color: #e4e4e4;
      .userData-header,
      .userData-tomo,
      .userData-config-image,
      .userData-config-music {
        h2 {
          width: 100%;
          font-size: 25px;
        }
        display: flex;
        border: 2px solid #e4e4e4;
        background-color: $bgColor;
        margin-top: 10px;
      }
      .userData-header {
        flex-direction: row;
        flex-wrap: wrap;
        font-size: 20px;
        justify-content: space-around;
        margin-top: 0px;
        width: 90%;
        .mesage {
          min-width: 45%;
          p {
            margin-block-start: 5px;
            margin-block-end: 5px;
          }
        }
      }
      .userData-tomo {
        flex-direction: column;
        align-items: center;
        width: 90%;
        max-height: 500px;
        overflow: auto;
        font-size: 17px;
        .tomo {
          margin: 5px 0;
          min-width: 60%;
        }
      }
      .userData-config-image,
      .userData-config-music {
        flex-direction: row;
        flex-wrap: wrap;
        font-size: 15px;
        justify-content: space-around;
        align-items: flex-start;
        width: 90%;
        max-height: 500px;
        overflow: auto;
        .config-image {
          width: 27%;
          border: 1px solid #e4e4e4;
          margin: 10px;
        }
        img {
          max-width: 100%;
          max-height: 200px;
        }
        .config-music {
          width: 80%;
          border: 1px solid #e4e4e4;
          margin: 10px 0;
        }
        audio {
          width: 100%;
        }
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