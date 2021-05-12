<template>
  <div class="acgn-register">
    <div class="acgn-register-form" ref="acgnRegister">
      <div class="acgn-logo">
        <img src="http://localhost:9810/acgnrecord/defaultImage/ACGNRecord-logo.png" />
      </div>
      <div class="login-register-from-item">
        <label>用户名：</label>
        <input type="text" v-model="user.acgnUserName" />
      </div>
      <div class="login-register-from-item">
        <label>密<span style="opacity: 0">—</span>码：</label>
        <input type="password" v-model="user.acgnUserPassword" />
      </div>
      <div class="login-register-from-item">
        <label>邮<span style="opacity: 0">—</span>箱：</label>
        <input type="text" v-model="user.acgnUserEmail" />
      </div>
      <div class="login-register-from-item">
        <label>验证码：</label>
        <input type="text" v-model="user.code" style="width: 110px" />
        <acgn-button
          :disabled="!canGetCode"
          @click="getCode"
          :fontSize="17"
          :width="120"
          style="display: inline; margin-left: 20px; margin-top: 0px"
          >{{ canGetCode ? '获取验证码' : codeDownCount + '(s)' }}</acgn-button
        >
      </div>
      <div class="login-register-from-item">
        <acgn-button @click="userRegister" :fontSize="20">注册</acgn-button>
        <acgn-button @click="toLogin" :fontSize="20" style="margin-left: 30px">前往登录</acgn-button>
      </div>
      <br />
    </div>
  </div>
</template>

<script>
import { register, sendEmail } from '@/api/user'
import VanillaTilt from 'vanilla-tilt'
export default {
  data() {
    return {
      user: {
        acgnUserName: '',
        acgnUserPassword: '',
        acgnUserEmail: '',
        code: ''
      },
      canGetCode: true,
      codeDownCount: 60,
      loginRes: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      VanillaTilt.init(this.$refs.acgnRegister, { reverse: true, max: 5 })
    })
  },
  methods: {
    userRegister() {
      register(this.user).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.$router.push({
            name: 'login'
          })
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    getCode() {
      if (this.isEmailAvailable()) {
        sendEmail({
          acgnUserEmail: this.user.acgnUserEmail
        }).then((res) => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.canGetCode = false
            this.downCount()
          } else {
            this.$message.warning(res.msg)
          }
        })
      } else {
        this.$message.warning('邮箱格式错误')
      }
    },
    isEmailAvailable() {
      let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (!myreg.test(this.user.acgnUserEmail)) {
        return false
      } else {
        return true
      }
    },
    downCount() {
      let downCount = setInterval(() => {
        this.codeDownCount--
        if (this.codeDownCount === 0) {
          this.canGetCode = true
          this.codeDownCount = 60
          clearInterval(downCount)
        }
      }, 1000)
    },
    toLogin() {
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.acgn-register {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .acgn-register-form {
    width: 600px;
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
      img {
        width: 250px;
      }
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
