<template>
  <div id="app" @contextmenu.prevent="rightClick">
    <move-menu v-moveMenu v-if="hasMenu" :top="mouseTop" :left="mouseLeft" :title="'系统菜单'">
      <div class="db-menu" @click="changeMode">{{ nowMode == 'readerIndex' ? '管理模式' : '浏览模式' }}</div>
      <div class="db-menu" @click="closeSakura">{{ sakuraShow ? '关闭樱花' : '开启樱花' }}</div>
      <div class="db-menu" @click="changeBG">切换主题</div>
      <div class="db-menu" @click="configWindow">系统设置</div>
      <div class="db-menu">退出登录</div>
    </move-menu>
    <template v-if="changeBackground">
      <div class="bg1"></div>
      <div class="bg2"></div>
    </template>
    <div v-else class="bg"></div>
    <router-view></router-view>
    <move-window v-dialogDrag :key="'config'" :zIndex="999" v-if="configShow"> </move-window>
  </div>
</template>

<script>
import moveMenu from './components/moveMenu';
import moveWindow from '@/components/moveWindow.vue';
import { stopSakura } from './util/sakuraDrop';
export default {
  name: 'App',
  components: {
    moveMenu,
    moveWindow
  },
  data() {
    return {
      hasMenu: false,
      sakuraShow: true,
      changeBackground: true,
      nowMode: 'readerIndex',
      mouseTop: 0,
      mouseLeft: 0,
      configShow: false
    };
  },
  mounted() {
    if (!this.$route.name) {
      this.nowMode = 'readerIndex';
    } else {
      this.nowMode = this.$route.name;
    }
  },
  methods: {
    rightClick(event) {
      let event1 = event.target;
      let event2 = event.currentTarget;
      if (event1 === event2) {
        this.mouseTop = event.clientY;
        this.mouseLeft = event.clientX;
        this.hasMenu = !this.hasMenu;
      }
    },
    closeSakura() {
      this.sakuraShow = !this.sakuraShow;
      stopSakura();
    },
    changeBG() {
      this.changeBackground = !this.changeBackground;
    },
    configWindow() {
      this.configShow = !this.configShow;
    },
    changeMode() {
      console.log(this.$route);
      if (this.$route.name == 'readerIndex') {
        this.nowMode = 'creatorIndex';
        this.$router.push({
          name: 'creatorIndex'
        });
      } else {
        this.nowMode = 'readerIndex';
        this.$router.push({
          name: 'readerIndex'
        });
      }
    }
  }
};
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
  background-image: url('./assets/fgo-bg2.png');
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
  background-image: url('./assets/fgo-bg2.png');
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
  background-image: url('./assets/arisu-bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 0px 0px;
  background-attachment: fixed;
  animation: changeBG2 linear infinite 10s;
  z-index: -2;
}
@keyframes changeBG1 {
  0% {
    transform: scale(1.03);
    background-image: url('./assets/fgo-bg2.png');
  }
  20% {
    background-image: url('./assets/fgo-bg2.png');
    opacity: 1;
  }
  25% {
    transform: scale(1.1);
    background-image: url('./assets/fgo-bg2.png');
    opacity: 0;
  }
  45% {
    transform: scale(1);
    background-image: url('./assets/fgo-bg.png');
    opacity: 0;
  }
  50% {
    background-image: url('./assets/fgo-bg.png');
    opacity: 1;
  }
  70% {
    background-image: url('./assets/fgo-bg.png');
    opacity: 1;
  }
  75% {
    transform: scale(1.1);
    background-image: url('./assets/fgo-bg.png');
    opacity: 0;
  }
  95% {
    transform: scale(1);
    background-image: url('./assets/fgo-bg2.png');
    opacity: 0;
  }
  100% {
    transform: scale(1.03);
    background-image: url('./assets/fgo-bg2.png');
    opacity: 1;
  }
}
@keyframes changeBG2 {
  0% {
    transform: scale(1);
    background-image: url('./assets/arisu-bg.png');
  }
  20% {
    transform: scale(1);
    background-image: url('./assets/arisu-bg.png');
  }
  50% {
    transform: scale(1.1);
    background-image: url('./assets/arisu-bg.png');
  }
  70% {
    transform: scale(1);
    background-image: url('./assets/jk-bg.png');
  }
  100% {
    transform: scale(1.1);
    background-image: url('./assets/jk-bg.png');
  }
}
</style>
