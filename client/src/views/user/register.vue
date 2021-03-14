<template>
  <div class="acgn-register">
    <div class="acgn-logo">ACGN Record</div>
    <div>
      <label>用户名：</label>
      <input type="text" v-model="user.name" />
    </div>
    <div>
      <label>密<span style="opacity: 0">—</span>码：</label>
      <input type="text" v-model="user.password" />
    </div>
    <div>
      <label>邮<span style="opacity: 0">—</span>箱：</label>
      <input type="text" v-model="user.email" />
    </div>
    <div>
      <label>验证码：</label>
      <input type="text" v-model="user.code" />
      <acgn-button @click="getCode" :fontSize="15" style="display: inline">获取验证码</acgn-button>
    </div>
    <acgn-button @click="userRegister" :fontSize="20">注册</acgn-button>
    <br />
    <!-- <div v-if="loginRes">注册成功！欢迎{{ loginRes }}</div> -->
    <!-- <el-upload
      action="http://localhost:9810/acgnrecord/picUpload"
      multiple
      drag
      :headers="requesHeaders"
      list-type="picture-card"
      :auto-upload="true"
    >
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">查看 </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">下载 </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">删除 </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->
  </div>
</template>

<script>
import { register, sendEmail } from '@/api/user'
export default {
  data() {
    return {
      user: {
        name: '',
        password: '',
        email: '',
        code: ''
      },
      loginRes: null,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      requesHeaders: {}
    }
  },
  mounted() {
    this.requesHeaders.token = this.$store.get('Token')
  },
  methods: {
    userRegister() {
      register(this.user).then((res) => {
        if (res.code == 200) {
          this.loginRes = res.data
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    getCode() {
      sendEmail({
        email: this.user.email
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
