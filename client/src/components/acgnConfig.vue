<template>
  <div class="acgnConfig">
    <div class="acgn-form">
      <label>樱花特效</label>
      <el-radio-group v-model="sakuraShow">
        <el-radio :label="1001">默认开启</el-radio>
        <el-radio :label="1000">默认关闭</el-radio>
      </el-radio-group>
    </div>
    <div class="acgn-form">
      <label>背景音乐</label>
      <el-radio-group v-model="autoplay">
        <el-radio :label="1001">默认播放</el-radio>
        <el-radio :label="1000">默认关闭</el-radio>
      </el-radio-group>
    </div>
    <div class="acgn-form">
      <label>背景图片</label>
      <el-radio-group v-model="changeBackground">
        <el-radio :label="1001">默认幻灯片</el-radio>
        <el-radio :label="1000">默认单图</el-radio>
      </el-radio-group>
    </div>
    <!-- <div class="acgn-form">
      <label>主题颜色</label>
      <el-radio-group v-model="changeTheme">
        <el-radio :label="1001">樱花粉</el-radio>
        <el-radio :label="1000">蕾姆蓝</el-radio>
      </el-radio-group>
    </div> -->
    <button @click="message">消息弹窗</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sakuraShow: 1001,
      autoplay: 1001,
      changeBackground: 1001,
      changeTheme: 1001
    }
  },
  methods: {
    message() {
      this.$message('消息弹窗')
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnConfig {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>