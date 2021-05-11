<template>
  <div id="app" @contextmenu.prevent="rightClick">
    <!-- <acgn-loading :loaded="loadData.loaded" :loadSize="backgroundImages.length"></acgn-loading> -->
    <move-menu v-moveMenu v-if="hasMenu" :zIndex="998" :top="mouseTop" :left="mouseLeft" :title="'系统菜单'">
      <div class="db-menu" v-if="routerName === 'readerIndex' || routerName === 'creatorIndex'" @click="changeMode">
        {{ routerName == 'readerIndex' ? '管理模式' : '浏览模式' }}
      </div>
      <div class="db-menu" @click="closeSakura">{{ acgnConfig.sakuraShow ? '关闭樱花' : '开启樱花' }}</div>
      <div class="db-menu" @click="changeBG">{{ acgnConfig.slidesOrOnly ? '单图背景' : '幻灯片背景' }}</div>
      <div class="db-menu" v-if="routerName === 'readerIndex'" @click="openTomoList">好友列表</div>
      <div class="db-menu" v-if="routerName !== 'login' && routerName !== 'register'" @click="configWindow">
        系统设置
      </div>
      <div class="db-menu" v-if="routerName !== 'login' && routerName !== 'register'" @click="openModify">修改密码</div>
      <div class="db-menu" v-if="routerName === 'masterIndex'" @click="openMasterRegister">管理员注册</div>
      <div class="db-menu" v-if="routerName !== 'login' && routerName !== 'register'" @click="logout">退出登录</div>
    </move-menu>
    <move-menu
      v-moveMenu
      v-if="tomoListType"
      :zIndex="999"
      :top="mouseTop"
      :left="mouseLeft"
      :width="300"
      :height="600"
      :title="'好友列表'"
      :hasClose="true"
      :hasReduce="true"
      @closeMenu="closeTomoList"
    >
      <template v-if="tomoListType === 'tomoList'">
        <div class="db-list" v-for="item in tomoList" :key="item.acgnUid" @click="openTomoAcgnContentList(item)">
          {{ item.acgnUserName
          }}<acgn-button :buttonType="'danger'" :fontSize="10" :width="50" @click="deleteTomo(item)">
            删除
          </acgn-button>
        </div>
      </template>
      <template v-else-if="tomoListType === 'requestTomoList'">
        <div class="db-list" v-for="item in requestTomoList" :key="item.requestId">
          <span>{{ item.requestName }}</span>
          <span v-if="item.requestStatus === 2"
            ><acgn-button :fontSize="10" :width="50" @click="agreeTomoRequest(item, 4)"> 同意 </acgn-button>
            <acgn-button :fontSize="10" :width="50" @click="agreeTomoRequest(item, 3)" :buttonType="'danger'">
              拒绝
            </acgn-button></span
          >

          <span v-else>{{ item.requestStatus === 3 ? '拒绝' : '同意' }}</span>
        </div>
      </template>
      <acgn-button @click="openAddTomo">添加好友</acgn-button>
      <acgn-button @click="openTomoRequest" style="margin-left: 10px">{{
        tomoListType === 'tomoList' ? '好友请求' : '好友列表'
      }}</acgn-button>
    </move-menu>
    <move-message
      v-moveMessage
      :zIndex="1000"
      :top="item.top"
      :left="item.left"
      :title="item.title"
      :height="item.height"
      ref="moveMessage"
      v-for="(item, index) in messageData"
      :key="index"
      @closeMessage="closeMessage(index)"
      @confirmMessage="confirmMessage(index)"
    >
      <div style="margin-top: 40px" v-if="item.messageType === 'addTomo'">
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">请输入用户昵称（必须完整）</label>
          <input v-model="addTomoUserName" />
        </div>
      </div>
      <div style="margin-top: 40px" v-if="item.messageType === 'tomoAcgnTitle'">
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">请输入用户记录的其中一部作品名字</label>
          <input v-model="addTomoAcgnTitle" />
        </div>
      </div>
      <div style="margin-top: 20px" v-if="item.messageType === 'modify'">
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">原密码</label>
          <input v-model="motoPassword" />
        </div>
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">新密码</label>
          <input v-model="newPassword" />
        </div>
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">再来一次</label>
          <input v-model="againPassword" />
        </div>
      </div>
      <div style="margin-top: 20px" v-if="item.messageType === 'masterRegister'">
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">管理员用户名</label>
          <input v-model="masterUserName" />
        </div>
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">密码</label>
          <input v-model="masterPassword" />
        </div>
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">再来一次</label>
          <input v-model="againPassword" />
        </div>
      </div>
    </move-message>
    <move-window
      v-dialogDrag
      :windowKey="'config'"
      :windowType="'config'"
      :title="'系统设置'"
      :zIndex="999"
      v-if="configShow"
      @closeWindow="configWindow"
    >
    </move-window>
    <template v-if="acgnConfig.slidesOrOnly">
      <div class="bg1" ref="background1"></div>
      <div class="bg2" ref="background2"></div>
    </template>
    <div v-else class="bg" ref="background"></div>
    <aplayer
      id="aplayer"
      float
      :mutex="false"
      :mini="mini"
      @mouseover.native="playerShow"
      @mouseleave.native="playerHide"
      :music="musicList[0]"
      :list="musicList"
      :autoplay="acgnConfig.autoplay"
    >
    </aplayer>
    <transition name="router-anime">
      <router-view style="position: fixed"></router-view>
    </transition>
    <config-manage ref="configManage"></config-manage>
  </div>
</template>

<script>
import Bus from '@/common/bus'
// import { acgnConfig } from '@/common/acgnConfig'
import moveMenu from './components/moveMenu'
import moveWindow from '@/components/moveWindow.vue'
import Aplayer from 'vue-aplayer'
import { changeTheme, musicDataHandle } from '@/util/systemStyle'
import { stopSakura, startSakura } from './util/sakuraDrop'
import { createBackgroundAnimetion } from './util/acgnFunc'
import configManage from './components/acgnConfigFileManage'
import { searchTomo, addTomo, requestHandle, getTomoList, getTomoRequestList } from './api/tomo'
import { modifyPassword } from './api/user'
import { masterRegister } from './api/master'
export default {
  name: 'App',
  components: {
    moveMenu,
    moveWindow,
    configManage,
    Aplayer
  },
  data() {
    return {
      acgnConfig: {},
      defaultAcgnConfig: {
        sakuraShow: true,
        slidesOrOnly: true,
        autoplay: true,
        acgnTheme: 1001
      },
      messageData: [],
      hasMenu: false,
      tomoListType: '',
      addTomoUid: null,
      addTomoUserName: '',
      addTomoAcgnTitle: '',
      motoPassword: '',
      newPassword: '',
      againPassword: '',
      masterUserName: '',
      masterPassword: '',
      tomoList: [],
      requestTomoList: [],
      // sakuraShow: true,
      // slidesOrOnly: acgnConfig.slidesOrOnly, //true为轮播背景，false为单图背景
      // autoplay: false,
      mouseTop: 0,
      mouseLeft: 0,
      configShow: false,
      backgroundCssAnime: null,
      apiSrc: 'http://localhost:9810/acgnrecord/defaultImage/',
      backgroundImages: ['fgo-bg2.png', 'fgo-bg.png', 'arisu-bg.png', 'jk-bg.png'],
      defaultApiSrc: 'http://localhost:9810/acgnrecord/defaultImage/',
      defaultBackgroundImages: ['fgo-bg2.png', 'fgo-bg.png', 'arisu-bg.png', 'jk-bg.png'],
      mini: true,
      musicList: [
        {
          title: 'ここにある空',
          artist: '米倉千尋',
          src: 'http://localhost:9810/acgnrecord/defaultMusic/米倉千尋 - ここにある空.mp3'
        },
        {
          title: 'ふたり',
          artist: '米倉千尋',
          src: 'http://localhost:9810/acgnrecord/defaultMusic/米倉千尋 - ふたり.mp3'
        }
      ],
      defaultMusicList: [
        {
          title: 'ここにある空',
          artist: '米倉千尋',
          src: 'http://localhost:9810/acgnrecord/defaultMusic/米倉千尋 - ここにある空.mp3'
        },
        {
          title: 'ふたり',
          artist: '米倉千尋',
          src: 'http://localhost:9810/acgnrecord/defaultMusic/米倉千尋 - ふたり.mp3'
        }
      ],
      loadData: {
        apiSrc: '',
        loaded: 0
      }
    }
  },
  computed: {
    routerName() {
      return this.$route.name
    }
  },
  created() {
    Bus.$on('loadAcgnConfig', () => {
      console.log(111111)
      this.acgnConfig = this.$localStorage.get('acgnConfig') || this.defaultAcgnConfig
      if (this.acgnConfig.backgroundImages && this.acgnConfig.backgroundImages.length != 0) {
        this.apiSrc = 'http://localhost:9810/acgnrecord/image/'
        this.backgroundImages = this.acgnConfig.backgroundImages
        this.loadData.apiSrc = this.apiSrc
        this.loadData.loaded = 0
        this.loadAcgnImage([...this.backgroundImages], this.loadData).then((imgArr) => {
          console.log(imgArr)
        })
        this.getBackgroundAnimetion()
        this.getBackgroundImage()
      } else {
        this.apiSrc = this.defaultApiSrc
        this.backgroundImages = this.defaultBackgroundImages
        this.loadData.apiSrc = this.defaultApiSrc
        this.loadData.loaded = 0
        this.loadAcgnImage([...this.backgroundImages], this.loadData).then((imgArr) => {
          console.log(imgArr)
        })
        this.getBackgroundAnimetion()
        this.getBackgroundImage()
      }
      if (this.acgnConfig.backgroundMusic && this.acgnConfig.backgroundMusic.length != 0) {
        this.musicList = musicDataHandle(this.acgnConfig.backgroundMusic)
      } else {
        this.musicList = this.defaultMusicList
      }
      this.loadSystemStyle()
    })
    Bus.$on('openConfigManage', (dataList, type) => {
      this.$refs.configManage.openConfigManage(dataList, type)
    })
    this.acgnConfig = this.$localStorage.get('acgnConfig') || this.defaultAcgnConfig
    this.createBackgroundStlye()
  },
  mounted() {
    if (
      (this.acgnConfig.backgroundImages && this.acgnConfig.backgroundImages.length != 0) ||
      (this.acgnConfig.backgroundMusic && this.acgnConfig.backgroundMusic.length != 0)
    ) {
      Bus.$emit('loadAcgnConfig')
    } else {
      this.loadData.apiSrc = this.defaultApiSrc
      this.loadData.loaded = 0
      this.loadAcgnImage([...this.backgroundImages], this.loadData).then((imgArr) => {
        console.log(imgArr)
      })
      this.getBackgroundAnimetion()
      this.getBackgroundImage()
      this.loadSystemStyle()
    }
  },
  methods: {
    rightClick(event) {
      // let event1 = event.target
      // let event2 = event.currentTarget
      // if (event1 === event2) {
      this.mouseTop = event.clientY
      this.mouseLeft = event.clientX
      this.hasMenu = !this.hasMenu
      // }
    },
    closeTomoList() {
      this.tomoListType = ''
    },
    openTomoList(event) {
      this.mouseTop = event.clientY
      this.mouseLeft = event.clientX
      if (this.tomoListType) {
        this.$message.warning('好友列表已打开')
      } else {
        this.tomoListType = 'tomoList'
        getTomoList()
          .then((res) => {
            if (res.code == 200) {
              this.tomoList = res.data.acgnTomo || []
            } else {
              this.$message.warning(res.msg)
            }
          })
          .catch(() => {
            this.$message.error('前端出bug了！！')
          })
      }
    },
    openTomoRequest() {
      if (this.tomoListType === 'tomoList') {
        getTomoRequestList()
          .then((res) => {
            if (res.code == 200) {
              this.requestTomoList = res.data.tomoList || []
            } else {
              this.$message.warning(res.msg)
            }
            this.tomoListType = 'requestTomoList'
          })
          .catch(() => {
            this.$message.error('前端出bug了！！')
          })
      } else if (this.tomoListType === 'requestTomoList') {
        getTomoList()
          .then((res) => {
            if (res.code == 200) {
              this.tomoList = res.data.acgnTomo || []
            } else {
              this.$message.warning(res.msg)
            }
            this.tomoListType = 'tomoList'
          })
          .catch(() => {
            this.$message.error('前端出bug了！！')
          })
      }
    },
    closeMessage(dataIndex) {
      this.messageData[dataIndex].messageType = ''
    },
    deleteTomo(tomoData) {
      console.log(tomoData)
    },
    agreeTomoRequest(requestData, requestStatus) {
      requestHandle({
        requestId: requestData.requestId,
        acgnUid: requestData.requestUid,
        acgnUserName: requestData.requestName,
        requestStatus: requestStatus
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            requestData.requestStatus = requestStatus
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch(() => {
          this.$message.error('前端出bug了！！')
        })
    },
    confirmMessage(dataIndex) {
      if (this.messageData[dataIndex].messageType === 'addTomo') {
        searchTomo({
          acgnUserName: this.addTomoUserName
        })
          .then((res) => {
            if (res.code == 200) {
              this.messageData[dataIndex].messageType = 'tomoAcgnTitle'
              this.addTomoUid = res.data.tomoUid
            } else {
              this.$message.warning(res.msg)
            }
          })
          .catch(() => {
            this.$message.error('前端出bug了！！')
          })
      }
      if (this.messageData[dataIndex].messageType === 'tomoAcgnTitle') {
        addTomo({
          acgnUid: this.addTomoUid,
          acgnUserName: this.addTomoUserName,
          acgnTitle: this.addTomoAcgnTitle
        })
          .then((res) => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.$refs.moveMessage[dataIndex].closeMessage()
            } else {
              this.$message.warning(res.msg)
            }
          })
          .catch(() => {
            this.$message.warning('前端出bug了！！')
          })
      }
      if (this.messageData[dataIndex].messageType === 'modify') {
        if (this.newPassword === this.againPassword) {
          modifyPassword({
            password: this.motoPassword,
            newPassword: this.newPassword
          })
            .then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.$refs.moveMessage[dataIndex].closeMessage()
                this.motoPassword = ''
                this.newPassword = ''
                this.againPassword = ''
              } else {
                this.$message.warning(res.msg)
              }
            })
            .catch(() => {
              this.$message.warning('前端出bug了！！')
            })
        } else {
          this.$message.warning('两次密码不同')
        }
      }
      if (this.messageData[dataIndex].messageType === 'masterRegister') {
        if (this.masterPassword === this.againPassword) {
          masterRegister({
            acgnUserName: this.masterUserName,
            acgnUserPassword: this.masterPassword
          })
            .then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.$refs.moveMessage[dataIndex].closeMessage()
                this.masterUserName = ''
                this.masterPassword = ''
                this.againPassword = ''
              } else {
                this.$message.warning(res.msg)
              }
            })
            .catch(() => {
              this.$message.warning('前端出bug了！！')
            })
        } else {
          this.$message.warning('两次密码不同')
        }
      }
    },
    openAddTomo(event) {
      if (this.messageData.find((item) => item.messageType === 'addTomo')) {
        this.$message.warning('已打开该窗口')
      } else {
        this.messageData.push({
          top: event.clientY - 50,
          left: event.clientX - 200,
          title: '添加好友',
          messageType: 'addTomo'
        })
      }
    },
    openModify(event) {
      if (this.messageData.find((item) => item.messageType === 'modify')) {
        this.$message.warning('已打开该窗口')
      } else {
        this.messageData.push({
          top: event.clientY - 100,
          left: event.clientX - 200,
          height: 450,
          title: '修改密码',
          messageType: 'modify'
        })
      }
    },
    openMasterRegister(event) {
      if (this.messageData.find((item) => item.messageType === 'masterRegister')) {
        this.$message.warning('已打开该窗口')
      } else {
        this.messageData.push({
          top: event.clientY - 100,
          left: event.clientX - 200,
          height: 450,
          title: '管理员注册',
          messageType: 'masterRegister'
        })
      }
    },
    openTomoAcgnContentList(tomoData) {
      Bus.$emit('openTomoAcgnContentList', tomoData)
    },
    closeSakura() {
      this.acgnConfig.sakuraShow = !this.acgnConfig.sakuraShow
      if (this.acgnConfig.sakuraShow) {
        startSakura() //是否开局樱花特效
      } else {
        stopSakura()
      }
    },
    changeBG() {
      console.log(this.acgnConfig.slidesOrOnly)
      this.acgnConfig.slidesOrOnly = !this.acgnConfig.slidesOrOnly
      this.getBackgroundImage()
    },
    configWindow() {
      this.configShow = !this.configShow
    },
    logout() {
      this.$localStorage.remove('Token')
      this.$localStorage.remove('acgnConfig')
      this.$localStorage.remove('userData')
      this.$router.push({
        name: 'login'
      })
    },
    changeMode() {
      console.log(this.$route)
      if (this.$route.name == 'readerIndex') {
        this.$router.push({
          name: 'creatorIndex'
        })
      } else {
        this.$router.push({
          name: 'readerIndex'
        })
      }
    },
    loadSystemStyle() {
      if (this.acgnConfig.autoplay) {
        setTimeout(() => {
          let aplayerChildren = document.getElementById('aplayer').children
          let audio = Array.apply({}, aplayerChildren).find((item) => item.tagName == 'AUDIO')
          audio.play()
        }, 3000)
      }
      if (this.acgnConfig.sakuraShow) {
        startSakura() //是否开局樱花特效
      } else {
        stopSakura()
      }
      changeTheme(this.acgnConfig.acgnTheme)
    },
    getBackgroundImage() {
      if (this.acgnConfig.slidesOrOnly) {
        this.$nextTick(() => {
          let background1 = this.$refs.background1
          let background2 = this.$refs.background2
          //添加动画一轮的时间
          let animationDuration = this.backgroundImages.length > 20 ? 20 * 4 : this.backgroundImages.length * 4
          background1.style.animationDuration = animationDuration + 's'
          background2.style.animationDuration = animationDuration + 's'
          background1.style.backgroundImage = 'url("' + this.apiSrc + this.backgroundImages[0] + '")'
          background2.style.backgroundImage = 'url("' + this.apiSrc + this.backgroundImages[1] + '")'
        })
      } else {
        this.$nextTick(() => {
          let background = this.$refs.background
          background.style.backgroundImage = 'url("' + this.apiSrc + this.backgroundImages[0] + '")'
        })
      }
    },
    getBackgroundAnimetion() {
      let backgroundImages = this.backgroundImages
      const apiSrc = this.apiSrc
      const backgroundKeyframes = createBackgroundAnimetion(backgroundImages, apiSrc)
      if (this.backgroundCssAnime) {
        this.backgroundCssAnime.appendChild(document.createTextNode(backgroundKeyframes))
      } else {
        this.backgroundCssAnime = document.getElementById('backgroundCssAnime')
        this.backgroundCssAnime.appendChild(document.createTextNode(backgroundKeyframes))
      }
    },
    createBackgroundStlye() {
      // 将style样式存放到head标签
      this.backgroundCssAnime = document.getElementById('backgroundCssAnime')
      if (!this.backgroundCssAnime) {
        const style = document.createElement('style')
        style.id = 'backgroundCssAnime'
        document.getElementsByTagName('head')[0].appendChild(style)
      }
    },
    playerShow() {
      this.mini = false
    },
    playerHide() {
      this.mini = true
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $fontColor;
  background-color: $mask;
}
.db-list {
  color: #bfbfbf;
  font-size: 20px;
  padding: 5px;
  margin: 5px;
  display: flex;
  justify-content: space-between;
  &:hover {
    color: $hoverFontColor;
    background-color: $hoverBgColor;
    cursor: pointer;
  }
  .acgn-button {
    margin-top: 0;
    margin-left: 5px;
  }
}
.db-menu {
  color: #bfbfbf;
  font-size: 20px;
  padding: 5px;
  margin: 5px;
  .acgn-button {
    margin-top: 0;
  }
}
.db-menu:hover {
  color: $hoverFontColor;
  background-color: $hoverBgColor;
  cursor: pointer;
}
.bg {
  width: 100%;
  height: 100vh;
  position: fixed;
  margin: 0;
  // background-image: url('./assets/fgo-bg2.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 0px 0px;
  background-attachment: fixed;
  z-index: -1;
}
.bg1 {
  width: 100%;
  height: 100vh;
  position: fixed;
  margin: 0;
  // background-image: url('http://localhost:9810/acgnrecord/image/fgo-bg2.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 0px 0px;
  background-attachment: fixed;
  animation: changeBG1 linear infinite;
  z-index: -1;
}
.bg2 {
  width: 100%;
  height: 100vh;
  position: fixed;
  margin: 0;
  // background-image: url('http://localhost:9810/acgnrecord/image/arisu-bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 0px 0px;
  background-attachment: fixed;
  animation: changeBG2 linear infinite;
  z-index: -2;
}
.router-anime-enter-active {
  transition: all 0.2s ease-in;
}
.router-anime-leave-active {
  transition: all 0.2s ease-in;
}
.router-anime-enter 
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: scale(2);
  opacity: 0;
}
.router-anime-leave-to {
  transform: scale(0.5);
  opacity: 0;
}
.aplayer {
  position: fixed !important;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.2);
  ::v-deep {
    .aplayer-pic {
      background-image: none !important;
      background-color: rgba(0, 0, 0, 0.5);
      transition: 1s ease;
      &:hover {
        background: $bgColor !important;
      }
    }
    .aplayer-info {
      background-color: rgba(255, 255, 255, 0.7);
      width: 300px;
      animation: musicInfoIN 0.5s ease-in-out;
      .aplayer-controller {
        animation: musicInfoController 0.5s ease-in-out;
      }
    }
  }
}
@keyframes musicInfoIN {
  0% {
    width: 0;
    height: 0;
  }
  20% {
    width: 66px;
    height: 66px;
  }
  100% {
    width: 300px;
    height: 66px;
  }
}
@keyframes musicInfoController {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
