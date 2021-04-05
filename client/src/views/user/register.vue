<template>
  <div class="acgn-register">
    <div class="acgn-logo">ACGN Record</div>
    <div>
      <label>用户名：</label>
      <input type="text" v-model="user.acgnUserName" />
    </div>
    <div>
      <label>密<span style="opacity: 0">—</span>码：</label>
      <input type="text" v-model="user.acgnUserPassword" />
    </div>
    <div>
      <label>邮<span style="opacity: 0">—</span>箱：</label>
      <input type="text" v-model="user.acgnUserEmail" />
    </div>
    <div>
      <label>验证码：</label>
      <input type="text" v-model="user.code" style="width: 126px" />
      <acgn-button @click="getCode" :fontSize="17" style="display: inline; margin-left: 20px">获取验证码</acgn-button>
    </div>
    <acgn-button @click="userRegister" :fontSize="20">注册</acgn-button>
    <br />
  </div>
</template>

<script>
import { register, sendEmail } from '@/api/user'
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
  mounted() {},
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
    }
  }
}
</script>

<style lang="scss" scoped>
.acgn-register {
  width: 500px;
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
