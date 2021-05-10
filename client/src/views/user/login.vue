<template>
  <div class="acgn-login">
    <div class="acgn-login-form" ref="acgnLogin">
      <div class="acgn-logo">ACGN Record</div>
      <div class="login-register-from-item">
        <label>用户名：</label>
        <input type="text" v-model="user.acgnUserName" @keyup.enter="userLogin" />
      </div>
      <div class="login-register-from-item">
        <label>密<span style="opacity: 0">—</span>码：</label>
        <input type="text" v-model="user.acgnUserPassword" @keyup.enter="userLogin" />
      </div>
      <!-- <button @click="userLogin">登录</button> -->
      <div class="login-register-from-item">
        <acgn-button @click="userLogin" :fontSize="20">登录</acgn-button>
        <acgn-button @click="toRegister" :fontSize="20" style="margin-left: 30px">前往注册</acgn-button>
      </div>
      <br />
      <!-- <div v-if="loginRes">登录成功！欢迎{{ loginRes }}</div> -->
    </div>
  </div>
</template>

<script>
import Bus from '@/common/bus'
import VanillaTilt from 'vanilla-tilt'
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
  mounted() {
    this.$nextTick(() => {
      VanillaTilt.init(this.$refs.acgnLogin, { reverse: true, max: 5 })
    })
  },
  methods: {
    userLogin() {
      login({
        acgnUserName: this.user.acgnUserName,
        acgnUserPassword: this.user.acgnUserPassword
      }).then((res) => {
        if (res.code == 200) {
          this.loginRes = res.data.acgnUserName
          this.$message.success(res.msg)
          if (res.data.acgnUserStatus === 3) {
            this.$localStorage.set('Token', res.data.token)
            this.$localStorage.set('acgnConfig', res.data.acgnConfig)
            Bus.$emit('loadAcgnConfig')
            this.$router.push({
              name: 'masterIndex'
            })
          } else {
            this.$localStorage.set('Token', res.data.token)
            this.$localStorage.set('acgnConfig', res.data.acgnConfig)
            this.$localStorage.set('userData', res.data)
            Bus.$emit('loadAcgnConfig')
            this.$router.push({
              name: 'readerIndex'
            })
          }
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    toRegister() {
      this.$router.push({
        name: 'register'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.acgn-login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .acgn-login-form {
    width: 500px;
    background-color: $bgColor;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    font-size: 20px;
    padding-top: 20px;
    border-radius: 8px;
    border-top: 1px solid #ffffff;
    border-left: 1px solid #ffffff;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7);
    .acgn-logo {
      font-size: 30px;
      font-weight: 700;
      color: $acgnThemeColor;
    }
    .login-register-from-item {
      margin-top: 10px;
      input {
        width: 250px;
      }
    }
  }
}
</style>
