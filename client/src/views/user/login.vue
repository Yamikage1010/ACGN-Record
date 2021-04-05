<template>
  <div class="acgn-login">
    <div class="acgn-logo">ACGN Record</div>
    <div class="user-acgnUserName">
      <label>用户名：</label>
      <input type="text" v-model="user.acgnUserName" @keyup.enter="userLogin" />
    </div>
    <div class="user-acgnUserPassword">
      <label>密<span style="opacity: 0">—</span>码：</label>
      <input type="text" v-model="user.acgnUserPassword" @keyup.enter="userLogin" />
    </div>
    <!-- <button @click="userLogin">登录</button> -->
    <acgn-button @click="userLogin" :fontSize="20">登录</acgn-button>
    <br />
    <!-- <div v-if="loginRes">登录成功！欢迎{{ loginRes }}</div> -->
  </div>
</template>

<script>
import Bus from '@/common/bus'
import { login } from '@/api/user'
export default {
  data() {
    return {
      user: {
        acgnUserName: '',
        acgnUserPassword: ''
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
        acgnUserName: this.user.acgnUserName,
        acgnUserPassword: this.user.acgnUserPassword
      }).then((res) => {
        if (res.code == 200) {
          this.loginRes = res.data.acgnUserName
          this.$message.success(res.msg)
          this.$localStorage.set('Token', res.data.token)
          this.$localStorage.set('acgnConfig', res.data.acgnConfig)
          this.$localStorage.set('userData', res.data)
          Bus.$emit('loadAcgnConfig')
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
      let getMoveWindow = (element) => {
        if (element.id === 'moveWindow') {
          return element
        } else {
          return getMoveWindow(element.parentElement)
        }
      }
      getMoveWindow(e.srcElement).style.zIndex = ++this.maxZIndex
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
