<template>
  <div class="master-acgnData">
    <el-dialog
      :visible.sync="masterAcgnDataVisible"
      v-if="acgnData.acgnId"
      width="700px"
      :top="'80px'"
      :show-close="false"
      :close-on-click-modal="false"
      :modal="false"
    >
      <div slot="title" style="font-size: 25px; letter-spacing: 10px">作品信息详情</div>
      <div class="close-manage" v-if="masterAcgnDataVisible" @click="closeAcgnDataDialog">X</div>
      <div class="acgnData-main">
        <div class="acgnData-header">
          <h2>基本信息</h2>
          <div class="mesage">
            <p>
              用户id：<span>{{ acgnData.acgnUid }}</span>
            </p>
          </div>
          <div class="mesage">
            <p>
              用户名：<span>{{ acgnData.acgnUserName }}</span>
            </p>
          </div>
          <div class="mesage">
            <p>
              作品id：<span>{{ acgnData.acgnId }}</span>
            </p>
          </div>
          <div class="mesage">
            <p>
              作品标题：<span>{{ acgnData.acgnTitle }}</span>
            </p>
          </div>
          <div class="mesage">
            <p>
              作品副标题：<span>{{ acgnData.acgnSubTitle }}</span>
            </p>
          </div>
          <div class="mesage">
            <p>
              作品类型：<span>{{ acgnData.acgnType }}</span>
            </p>
          </div>
          <div class="mesage">
            <p>
              作品评分：<span>{{ acgnData.acgnScore }}</span>
            </p>
          </div>
          <div class="mesage">
            <p>
              是否分享给好友：<span>{{ acgnData.acgnToTomo === 1 ? '是' : '否' }}</span>
            </p>
          </div>
          <div class="mesage">
            <p>
              作品状态：<span>{{ acgnData.acgnStatus === 1 ? '正常' : '封禁' }}</span>
            </p>
          </div>
          <div class="mesage">
            <p>
              封禁原因：<span>{{ acgnData.banReason }}</span>
            </p>
          </div>
        </div>
        <div class="acgnData-memory-image" v-if="acgnData.acgnMemoryImage && acgnData.acgnMemoryImage.length > 0">
          <h2>作品相册</h2>
          <div class="memory-image" v-for="(item, index) in acgnData.acgnMemoryImage" :key="index">
            <img :src="'http://192.168.43.82:9810/acgnrecord/masterImage/' + item" />
            {{ item }}
          </div>
        </div>
        <div class="acgnData-characteristic-sourse" v-if="acgnData.acgnCharacteristic.animationSourse.length > 0">
          <h2>作品资源</h2>
          <div
            class="characteristic-sourse"
            v-for="(item, index) in acgnData.acgnCharacteristic.animationSourse"
            :key="index"
          >
            {{ item.title }}
            <audio
              v-if="item.fileType === 'music'"
              :src="'http://192.168.43.82:9810/acgnrecord/masterMusic/' + item.music"
              controls
            >
              您的浏览器不支持该音乐播放组件。
            </audio>
            <video
              v-else
              :src="'http://192.168.43.82:9810/acgnrecord/masterVideo/' + item.video"
              controlslist="nodownload noremoteplayback"
              disablePictureInPicture
              controls
            >
              您的浏览器不支持该视频播放组件。
            </video>
            <img v-if="item.image" :src="'http://192.168.43.82:9810/acgnrecord/masterImage/' + item.image" alt="" />
          </div>
        </div>
        <div class="acgnData-characteristic-volumes" v-if="acgnData.acgnCharacteristic.volumes.length > 0">
          <h2>作品分卷</h2>
          <div class="characteristic-volumes" v-for="(item, index) in acgnData.acgnCharacteristic.volumes" :key="index">
            <div>{{ item.title }}</div>
            <div class="volumes-content">内容：{{ item.content }}</div>
            <img v-if="item.cover" :src="'http://192.168.43.82:9810/acgnrecord/masterImage/' + item.cover" alt="" />
          </div>
        </div>
        <div class="acgnData-character" v-if="acgnCharacters.length > 0">
          <h2>人物信息</h2>
          <div class="character" v-for="(item, index) in acgnCharacters" :key="index">
            <div class="mesage">
              <p>
                人物名字：<span>{{ item.characterName }}</span>
              </p>
            </div>
            <h3>人物评析</h3>
            <p>{{ item.characterComment }}</p>
            <h3>人物相册</h3>
            <div class="character-image">
              <div class="image" v-for="(item2, index) in item.characterImage" :key="index">
                <img :src="'http://192.168.43.82:9810/acgnrecord/masterImage/' + item2" />
                {{ item2 }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </el-dialog>
    <div class="image-manage-mask" v-if="masterAcgnDataVisible"></div>
  </div>
</template>

<script>
import { getAcgnCharacters } from '@/api/acgnContent'
export default {
  data() {
    return {
      masterAcgnDataVisible: false,
      acgnData: {},
      acgnCharacters: []
    }
  },
  watch: {
    'acgnData.acgnId'() {
      this.getAcgnCharactersData()
    }
  },
  mounted() {
    this.getAcgnCharactersData()
  },
  methods: {
    getAcgnCharactersData() {
      getAcgnCharacters({
        acgnId: this.acgnData.acgnId
      }).then((res) => {
        if (res.code == 200) {
          console.log(...res.data.acgnCharacters)
          this.acgnCharacters.push(...res.data.acgnCharacters)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    openAcgnDataDialog(acgnData) {
      this.masterAcgnDataVisible = true
      this.acgnData = { ...acgnData }
      this.acgnData.acgnMemoryImage = JSON.parse(acgnData.acgnMemoryImage)
      this.acgnData.acgnAttribute = JSON.parse(acgnData.acgnAttribute)
      this.acgnData.acgnCharacteristic = JSON.parse(acgnData.acgnCharacteristic)
    },
    closeAcgnDataDialog() {
      this.masterAcgnDataVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.master-acgnData {
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
    .acgnData-main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      color: #e4e4e4;
      .acgnData-header,
      .acgnData-tomo,
      .acgnData-memory-image,
      .acgnData-characteristic-sourse,
      .acgnData-characteristic-volumes,
      .acgnData-character {
        h2 {
          width: 100%;
          font-size: 25px;
        }
        display: flex;
        border: 2px solid #e4e4e4;
        background-color: $bgColor;
        margin-top: 10px;
        padding-bottom: 20px;
      }
      .acgnData-header {
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
      .acgnData-tomo {
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
      .acgnData-memory-image,
      .acgnData-characteristic-sourse,
      .acgnData-characteristic-volumes,
      .acgnData-character {
        flex-direction: row;
        flex-wrap: wrap;
        font-size: 15px;
        justify-content: space-around;
        align-items: flex-start;
        width: 90%;
        max-height: 500px;
        overflow: auto;
        .memory-image {
          width: 27%;
          border: 1px solid #e4e4e4;
          margin: 10px;
        }
        img {
          max-width: 100%;
          max-height: 200px;
        }
        .characteristic-sourse,
        .characteristic-volumes {
          width: 80%;
          border: 1px solid #e4e4e4;
          margin: 10px 0;
          .volumes-content {
            max-height: 200px;
            overflow: auto;
            width: 100%;
            margin: 5px 0;
          }
        }
        audio,
        video {
          width: 100%;
        }
        .character {
          max-height: 200px;
          display: flex;
          align-items: center;
          flex-direction: column;
          overflow: auto;
          width: 96%;
          margin: 5px 0;
          border: 0.5px solid #e4e4e4;
          .character-image {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            font-size: 15px;
            justify-content: space-around;
            align-items: flex-start;
            width: 100%;
            .image {
              width: 27%;
              border: 1px solid #e4e4e4;
              margin: 10px;
            }
          }
        }
        h3 {
          width: 80%;
          border-top: 1px solid #e4e4e4;
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