<template>
  <div class="acgn-login">
    <div class="acgn-login-form" ref="acgnLogin">
      <div class="acgn-logo">
        <img src="http://localhost:9810/acgnrecord/defaultImage/ACGNRecord-logo.png" />
      </div>
      <template v-if="!forgetPasswordshow">
        <div class="login-register-from-button" @click="toForgetPassword">
          <div class="login-register-from-button-font">忘记密码</div>
        </div>
        <div class="login-register-from-item">
          <label>用户名：</label>
          <input type="text" v-model="user.acgnUserName" @keyup.enter="userLogin" placeholder="请输入用户名或邮箱" />
        </div>
        <div class="login-register-from-item">
          <label>密<span style="opacity: 0">—</span>码：</label>
          <input type="password" v-model="user.acgnUserPassword" @keyup.enter="userLogin" />
        </div>
        <!-- <button @click="userLogin">登录</button> -->
        <div class="login-register-from-item">
          <acgn-button @click="userLogin" :fontSize="20">登录</acgn-button>
          <acgn-button @click="toRegister" :fontSize="20" style="margin-left: 30px">前往注册</acgn-button>
        </div>
      </template>
      <template v-else>
        <div class="login-register-from-item">
          <label>邮<span style="opacity: 0">—</span>箱：</label>
          <input type="text" v-model="forgetData.acgnUserEmail" />
        </div>
        <div class="login-register-from-item">
          <label>验证码：</label>
          <input type="text" v-model="forgetData.code" style="width: 110px" />
          <acgn-button
            :disabled="!canGetCode"
            @click="getCode"
            :fontSize="17"
            :width="120"
            style="display: inline; margin-left: 20px; margin-top: 0px"
            >{{ canGetCode ? '获取验证码' : codeDownCount + '(s)' }}</acgn-button
          >
        </div>
        <div class="login-register-from-item" v-if="showPass">
          <label>重设密码：</label>
          <input type="password" v-model="forgetData.newPassword" />
        </div>
        <div class="login-register-from-item" v-if="showPass">
          <label>再来一次：</label>
          <input type="password" v-model="againPassword" />
        </div>
        <div class="login-register-from-item">
          <acgn-button @click="userForgetPassword" :fontSize="20">确定</acgn-button>
          <acgn-button @click="toLogin" :fontSize="20" style="margin-left: 30px">返回登录</acgn-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Bus from '@/common/bus'
import VanillaTilt from 'vanilla-tilt'
import { login, forgetPassword, sendEmail2 } from '@/api/user'
export default {
  data() {
    return {
      user: {
        acgnUserName: '',
        acgnUserPassword: ''
      },
      loginRes: null,
      forgetPasswordshow: false,
      forgetData: {
        acgnUserEmail: '',
        newPassword: '',
        code: ''
      },
      againPassword: '',
      canGetCode: true,
      codeDownCount: 60,
      showPass: false
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
      })
        .then((res) => {
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
        .catch((err) => {
          this.$message.error('前端出bug了')
          console.log(err)
        })
    },
    userForgetPassword() {
      if (this.forgetData.newPassword === this.againPassword) {
        forgetPassword(this.forgetData)
          .then((res) => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.toLogin()
            } else {
              this.$message.warning(res.msg)
            }
          })
          .catch((err) => {
            this.$message.error('前端出bug了')
            console.log(err)
          })
      } else {
        this.$message.warning('两次密码不一致')
      }
    },
    toRegister() {
      this.$router.push({
        name: 'register'
      })
    },
    toLogin() {
      this.forgetPasswordshow = false
      this.forgetData = {
        acgnUserEmail: '',
        newPassword: '',
        code: ''
      }
      this.againPassword = ''
      this.canGetCode = true
      this.codeDownCount = 60
      this.showPass = false
    },
    toForgetPassword() {
      this.forgetPasswordshow = true
    },
    getCode() {
      if (this.isEmailAvailable()) {
        sendEmail2({
          acgnUserEmail: this.forgetData.acgnUserEmail
        }).then((res) => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.canGetCode = false
            this.showPass = true
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
      if (!myreg.test(this.forgetData.acgnUserEmail)) {
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
    position: absolute;
    width: 500px;
    background-color: $bgColor;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    font-size: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    border-radius: 8px;
    border-top: 1px solid #ffffff;
    border-left: 1px solid #ffffff;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7);
    overflow: hidden;
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
    .login-register-from-button {
      position: absolute;
      top: -30px;
      right: -30px;
      width: 100px;
      height: 100px;
      border-radius: 50px;
      border: 1px #fff solid;
      background-color: $acgnThemeColor;
      transition: 0.3s;
      font-size: 20px;
      z-index: 2;
      &:hover {
        cursor: pointer;
        transform: scale(1.1);
        background-color: $acgnThemeColorHover;
      }
      .login-register-from-button-font {
        position: absolute;
        left: 13px;
        bottom: 13px;
        max-width: 50px;
      }
    }
  }
}
</style>
