<template>
  <div class="acgn-record">
    <label>用户名：</label><input type="text" v-model="user.name" /> <label>密码：</label
    ><input type="text" v-model="user.password" />
    <button @click="userLogin">登录</button>
    <br />
    <div v-if="loginRes">登录成功！欢迎{{ loginRes }}</div>
    <button class="add-move-window" @click="addMoveWindow">添加移动窗</button>
    <move-window v-dialogDrag v-for="index in moveWindowCount" :key="index" :zIndex="index" @click="setZIndex">
      <a href="https://bangumi.tv/subject_search/clannad?cat=all" target="_blank">
        跳转至bangumi搜索
      </a>
      
    <!-- <audio ref="audioPlay" autoplay controls src="http://localhost:9810/acgnrecord/music/%E7%B1%B3%E5%80%89%E5%8D%83%E5%B0%8B%20-%20%E3%81%93%E3%81%93%E3%81%AB%E3%81%82%E3%82%8B%E7%A9%BA.mp3">您的浏览器不支持 audio 标签。</audio> -->
    </move-window>

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
  </div>
</template>

<script>
import { login } from '@/api/user';
import store from 'store';
import moveWindow from '@/components/moveWindow.vue';
import Aplayer from 'vue-aplayer';
export default {
  components: { moveWindow, Aplayer },
  data() {
    return {
      user: {
        name: '',
        password: ''
      },
      loginRes: null,
      moveWindowCount: 1, //窗口数量
      maxZIndex: 0, //置顶窗口zIndex值
      autoplay:false,
      mini: true,
      musicList:[{
        title: 'ここにある空',
        artist: '米倉千尋', 
        src:'http://localhost:9810/acgnrecord/music/米倉千尋 - ここにある空.mp3'
      },{
        title: 'ふたり',
        artist: '米倉千尋', 
        src:'http://localhost:9810/acgnrecord/music/米倉千尋 - ふたり.mp3'
      }],
    };
  },
  mounted () {
    console.log(11111);
    setTimeout(()=>{
      let aplayerChildren = document.getElementById('aplayer').children
      let audio = Array.apply({},aplayerChildren).find(item => item.tagName == 'AUDIO')
      audio.play()
    },2000);
  },
  methods: {
    userLogin() {
      login({
        name: this.user.name,
        password: this.user.password
      }).then(res => {
        if (res.code == 200) {
          this.loginRes = res.data.name;
          store.set('Token', res.data.token);
        } else {
          alert(res.msg);
        }
      });
    },
    addMoveWindow() {
      this.moveWindowCount++;
      this.maxZIndex++;
    },
    //点击窗口置顶
    setZIndex(e) {
      if (e.srcElement.parentElement.className.toString().includes('move-window')) {
        e.srcElement.parentElement.style.zIndex = ++this.maxZIndex;
      } else {
        e.srcElement.style.zIndex = ++this.maxZIndex;
      }
    },
    playerShow() {
      this.mini = false;
    },
    playerHide() {
      this.mini = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.add-move-window {
  width: 200px;
  height: 100px;
  color: $fontColor;
  background-color: $bgColor;
  border: 0px;
  border-radius: 4px;
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
</style>
