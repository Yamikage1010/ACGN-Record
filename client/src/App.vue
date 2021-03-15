<template>
  <div id="app" @contextmenu.prevent="rightClick">
    <move-menu v-moveMenu v-if="hasMenu" :zIndex="998" :top="mouseTop" :left="mouseLeft" :title="'系统菜单'">
      <div class="db-menu" @click="changeMode">{{ nowMode == 'readerIndex' ? '管理模式' : '浏览模式' }}</div>
      <div class="db-menu" @click="closeSakura">{{ sakuraShow ? '关闭樱花' : '开启樱花' }}</div>
      <div class="db-menu" @click="changeBG">{{ slidesOrOnly ? '单图背景' : '幻灯片背景' }}</div>
      <div class="db-menu" @click="configWindow">系统设置</div>
      <div class="db-menu" @click="logout">退出登录</div>
    </move-menu>
    <move-window
      v-dialogDrag
      :windowKey="'config'"
      :windowType="'config'"
      :zIndex="999"
      v-if="configShow"
      @closeWindow="configWindow"
    >
    </move-window>
    <template v-if="slidesOrOnly">
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
    >
    </aplayer>
    <transition name="router-anime">
      <router-view style="position: fixed"></router-view>
    </transition>
  </div>
</template>

<script>
import moveMenu from './components/moveMenu'
import moveWindow from '@/components/moveWindow.vue'
import Aplayer from 'vue-aplayer'
import { stopSakura } from './util/sakuraDrop'
export default {
  name: 'App',
  components: {
    moveMenu,
    moveWindow,
    Aplayer
  },
  data() {
    return {
      hasMenu: false,
      sakuraShow: true,
      slidesOrOnly: true, //true为轮播背景，false为单图背景
      nowMode: 'readerIndex',
      mouseTop: 0,
      mouseLeft: 0,
      configShow: false,
      backgroundCssAnime: null,
      apiSrc: 'http://localhost:9810/acgnrecord/image/',
      backgroundImages: ['fgo-bg2.png', 'fgo-bg.png', 'arisu-bg.png', 'jk-bg.png'],
      autoplay: false,
      mini: true,
      musicList: [
        {
          title: 'ここにある空',
          artist: '米倉千尋',
          src: 'http://localhost:9810/acgnrecord/music/米倉千尋 - ここにある空.mp3'
        },
        {
          title: 'ふたり',
          artist: '米倉千尋',
          src: 'http://localhost:9810/acgnrecord/music/米倉千尋 - ふたり.mp3'
        }
      ]
    }
  },
  created() {
    this.createBackgroundStlye()
  },
  mounted() {
    if (!this.$route.name) {
      this.nowMode = 'readerIndex'
    } else {
      this.nowMode = this.$route.name
    }
    this.getBackgroundAnimetion()
    this.getBackgroundImage()
    setTimeout(() => {
      let aplayerChildren = document.getElementById('aplayer').children
      let audio = Array.apply({}, aplayerChildren).find((item) => item.tagName == 'AUDIO')
      audio.play()
    }, 2000)
  },
  methods: {
    rightClick(event) {
      let event1 = event.target
      let event2 = event.currentTarget
      if (event1 === event2) {
        this.mouseTop = event.clientY
        this.mouseLeft = event.clientX
        this.hasMenu = !this.hasMenu
      }
    },
    closeSakura() {
      this.sakuraShow = !this.sakuraShow
      stopSakura()
    },
    changeBG() {
      this.slidesOrOnly = !this.slidesOrOnly
      this.getBackgroundImage()
    },
    configWindow() {
      this.configShow = !this.configShow
    },
    logout() {
      this.$store.remove('Token')
      this.$router.push({
        name: 'login'
      })
    },
    changeMode() {
      console.log(this.$route)
      if (this.$route.name == 'readerIndex') {
        this.nowMode = 'creatorIndex'
        this.$router.push({
          name: 'creatorIndex'
        })
      } else {
        this.nowMode = 'readerIndex'
        this.$router.push({
          name: 'readerIndex'
        })
      }
    },
    getBackgroundImage() {
      if (this.slidesOrOnly) {
        this.$nextTick(() => {
          let background1 = this.$refs.background1
          let background2 = this.$refs.background2
          background1.style.backgroundImage = 'url("' + this.apiSrc + this.backgroundImages[0] + '")'
          background2.style.backgroundImage = 'url("' + this.apiSrc + this.backgroundImages[2] + '")'
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
      const backgroundKeyframes = `
        @keyframes changeBG1 {
          0% {
            transform: scale(1.03);
            background-image: url('${apiSrc}${backgroundImages[0]}');
          }
          20% {
            background-image: url('${apiSrc}${backgroundImages[0]}');
            opacity: 1;
          }
          25% {
            transform: scale(1.1);
            background-image: url('${apiSrc}${backgroundImages[0]}');
            opacity: 0;
          }
          45% {
            transform: scale(1);
            background-image: url('${apiSrc}${backgroundImages[1]}');
            opacity: 0;
          }
          50% {
            background-image: url('${apiSrc}${backgroundImages[1]}');
            opacity: 1;
          }
          70% {
            background-image: url('${apiSrc}${backgroundImages[1]}');
            opacity: 1;
          }
          75% {
            transform: scale(1.1);
            background-image: url('${apiSrc}${backgroundImages[1]}');
            opacity: 0;
          }
          95% {
            transform: scale(1);
            background-image: url('${apiSrc}${backgroundImages[0]}');
            opacity: 0;
          }
          100% {
            transform: scale(1.03);
            background-image: url('${apiSrc}${backgroundImages[0]}');
            opacity: 1;
          }
        }
        @keyframes changeBG2 {
          0% {
            transform: scale(1);
            background-image: url('${apiSrc}${backgroundImages[2]}');
          }
          20% {
            transform: scale(1);
            background-image: url('${apiSrc}${backgroundImages[2]}');
          }
          50% {
            transform: scale(1.1);
            background-image: url('${apiSrc}${backgroundImages[2]}');
          }
          70% {
            transform: scale(1);
            background-image: url('${apiSrc}${backgroundImages[3]}');
          }
          100% {
            transform: scale(1.1);
            background-image: url('${apiSrc}${backgroundImages[3]}');
          }
        }`
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
.db-menu {
  color: #bfbfbf;
  font-size: 20px;
  padding: 5px;
  margin: 5px;
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
  animation: changeBG1 linear infinite 10s;
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
  animation: changeBG2 linear infinite 10s;
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
  transform: scale(0.5);
  opacity: 0;
}
.router-anime-leave-to {
  transform: scale(2);
  opacity: 0;
}
.aplayer {
  position: fixed !important;
  border-radius: 15px;
  background-color: transparent;
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
// @keyframes changeBG1 {
//   0% {
//     transform: scale(1.03);
//     background-image: url('http://localhost:9810/acgnrecord/image/fgo-bg2.png');
//   }
//   20% {
//     background-image: url('http://localhost:9810/acgnrecord/image/fgo-bg2.png');
//     opacity: 1;
//   }
//   25% {
//     transform: scale(1.1);
//     background-image: url('http://localhost:9810/acgnrecord/image/fgo-bg2.png');
//     opacity: 0;
//   }
//   45% {
//     transform: scale(1);
//     background-image: url('http://localhost:9810/acgnrecord/image/fgo-bg.png');
//     opacity: 0;
//   }
//   50% {
//     background-image: url('http://localhost:9810/acgnrecord/image/fgo-bg.png');
//     opacity: 1;
//   }
//   70% {
//     background-image: url('http://localhost:9810/acgnrecord/image/fgo-bg.png');
//     opacity: 1;
//   }
//   75% {
//     transform: scale(1.1);
//     background-image: url('http://localhost:9810/acgnrecord/image/fgo-bg.png');
//     opacity: 0;
//   }
//   95% {
//     transform: scale(1);
//     background-image: url('http://localhost:9810/acgnrecord/image/fgo-bg2.png');
//     opacity: 0;
//   }
//   100% {
//     transform: scale(1.03);
//     background-image: url('http://localhost:9810/acgnrecord/image/fgo-bg2.png');
//     opacity: 1;
//   }
// }
// @keyframes changeBG2 {
//   0% {
//     transform: scale(1);
//     background-image: url('http://localhost:9810/acgnrecord/image/arisu-bg.png');
//   }
//   20% {
//     transform: scale(1);
//     background-image: url('http://localhost:9810/acgnrecord/image/arisu-bg.png');
//   }
//   50% {
//     transform: scale(1.1);
//     background-image: url('http://localhost:9810/acgnrecord/image/arisu-bg.png');
//   }
//   70% {
//     transform: scale(1);
//     background-image: url('http://localhost:9810/acgnrecord/image/jk-bg.png');
//   }
//   100% {
//     transform: scale(1.1);
//     background-image: url('http://localhost:9810/acgnrecord/image/jk-bg.png');
//   }
// }
</style>
