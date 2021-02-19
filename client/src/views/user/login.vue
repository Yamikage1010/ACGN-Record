<template>
  <div class="acgn-record">
    <label>用户名：</label><input type="text" v-model="user.name" />
    <label>密码：</label><input type="text" v-model="user.password" />
    <button @click="userLogin">登录</button>
    <br />
    <div v-if="loginRes">登录成功！欢迎{{ loginRes }}</div>
    <button class="add-move-window" @click="addMoveWindow">添加移动窗</button>
    <move-window
      v-dialogDrag
      v-for="index in moveWindowCount"
      :key="index"
      :zIndex="index"
      @click="setZIndex"
    >
    </move-window>

    <aplayer
      autoplay
      float
      :mini="mini"
      @mouseover.native="playerShow"
      @mouseleave.native="playerHide"
      :music="{}"
    >
    </aplayer>
  </div>
</template>

<script>
import { login } from '@/api/user';
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
      mini: true
    };
  },
  methods: {
    userLogin() {
      login({
        name: this.user.name,
        password: this.user.password
      }).then(res => {
        if (res.code == 200) {
          this.loginRes = res.data.name;
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
      if (e.srcElement.parentElement.className === 'move-window') {
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
  mounted() {}
};
</script>

<style lang="scss" scoped>
.add-move-window {
  width: 200px;
  height: 100px;
  color: aliceblue;
  background-color: rgba(0, 0, 0, 0.5);
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
        background: rgba(0, 0, 0, 0.8) !important;
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
