<template>
  <div class="acgn-login">
    <div class="acgn-logo">ACGN Record</div>
    <div class="user-name">
      <label>用户名：</label>
      <input type="text" v-model="user.name" @keyup.enter="userLogin" />
    </div>
    <div class="user-password">
      <label>密<span style="opacity: 0">—</span>码：</label>
      <input type="text" v-model="user.password" @keyup.enter="userLogin" />
    </div>
    <!-- <button @click="userLogin">登录</button> -->
    <acgn-button @click="userLogin" :fontSize="20">登录</acgn-button>
    <br />
    <!-- <div v-if="loginRes">登录成功！欢迎{{ loginRes }}</div> -->
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
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
          this.$message.success(res.msg)
          this.$store.set('Token', res.data.token)
          this.$router.push({
            name: 'readerIndex'
          })
        } else {
          this.$message.warning(res.msg)
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
.acgn-login {
  width: 500px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: $bgColor;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  font-size: 20px;
  padding-top: 20px;
  .acgn-logo {
    font-size: 30px;
    font-weight: 700;
    color: $acgnThemeColor;
  }
}
</style>
