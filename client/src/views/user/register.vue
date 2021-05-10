<template>
  <div class="acgn-register">
    <div class="acgn-register-form" ref="acgnRegister">
      <div class="acgn-logo">ACGN Record</div>
      <div class="login-register-from-item">
        <label>用户名：</label>
        <input type="text" v-model="user.acgnUserName" />
      </div>
      <div class="login-register-from-item">
        <label>密<span style="opacity: 0">—</span>码：</label>
        <input type="text" v-model="user.acgnUserPassword" />
      </div>
      <div class="login-register-from-item">
        <label>邮<span style="opacity: 0">—</span>箱：</label>
        <input type="text" v-model="user.acgnUserEmail" />
      </div>
      <div class="login-register-from-item">
        <label>验证码：</label>
        <input type="text" v-model="user.code" style="width: 110px" />
        <acgn-button
          @click="getCode"
          :fontSize="17"
          :width="120"
          style="display: inline; margin-left: 20px; margin-top: 0px"
          >获取验证码</acgn-button
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
          this.loginRes = res.data
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
      sendEmail({
        acgnUserEmail: this.user.acgnUserEmail
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.msg)
        }
      })
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
