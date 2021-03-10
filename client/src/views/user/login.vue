<template>
  <div class="acgn-record">
    <label>用户名：</label><input type="text" v-model="user.name" @keyup.enter="userLogin" /> <label>密码：</label
    ><input type="text" v-model="user.password" @keyup.enter="userLogin" />
    <button @click="userLogin">登录</button>
    <br />
    <div v-if="loginRes">登录成功！欢迎{{ loginRes }}</div>
    <button class="add-move-window" @click="addMoveWindow">添加移动窗</button>
    <move-window v-dialogDrag v-for="index in moveWindowCount" :key="index" :zIndex="index" @click="setZIndex">
      <a href="https://bangumi.tv/subject_search/clannad?cat=all" target="_blank"> 跳转至bangumi搜索 </a>

      <!-- <audio ref="audioPlay" autoplay controls src="http://localhost:9810/acgnrecord/music/%E7%B1%B3%E5%80%89%E5%8D%83%E5%B0%8B%20-%20%E3%81%93%E3%81%93%E3%81%AB%E3%81%82%E3%82%8B%E7%A9%BA.mp3">您的浏览器不支持 audio 标签。</audio> -->
    </move-window>
  </div>
</template>

<script>
import { login } from '@/api/user'
import store from 'store'
import moveWindow from '@/components/moveWindow.vue'
export default {
  components: { moveWindow },
  data() {
    return {
      user: {
        name: '',
        password: ''
      },
      loginRes: null,
      moveWindowCount: 1, //窗口数量
      maxZIndex: 0 //置顶窗口zIndex值
    }
  },
  mounted() {},
  methods: {
    userLogin() {
      login({
        name: this.user.name,
        password: this.user.password
      }).then((res) => {
        if (res.code == 200) {
          this.loginRes = res.data.name
          store.set('Token', res.data.token)
          this.$router.push({
            name: 'readerIndex'
          })
        } else {
          alert(res.msg)
        }
      })
    },
    addMoveWindow() {
      this.moveWindowCount++
      this.maxZIndex++
    },
    //点击窗口置顶
    setZIndex(e) {
      if (e.srcElement.parentElement.className.toString().includes('move-window')) {
        e.srcElement.parentElement.style.zIndex = ++this.maxZIndex
      } else {
        e.srcElement.style.zIndex = ++this.maxZIndex
      }
    }
  }
}
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
</style>
