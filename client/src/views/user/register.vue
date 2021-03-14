<template>
  <div>
    <label>用户名：</label><input type="text" v-model="user.name" /> <label>密码：</label
    ><input type="text" v-model="user.password" />
    <button @click="userRegister">注册</button>
    <br />
    <div v-if="loginRes">注册成功！欢迎{{ loginRes }}</div>
    <el-upload
      action="http://localhost:9810/acgnrecord/picUpload"
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
    </el-dialog>
  </div>
</template>

<script>
import { register } from '@/api/user'
export default {
  data() {
    return {
      user: {
        name: '',
        password: ''
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
      register({
        name: this.user.name,
        password: this.user.password
      }).then((res) => {
        if (res.code == 200) {
          this.loginRes = res.data
        } else {
          alert(res.msg)
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
