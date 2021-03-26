<template>
  <div class="acgn-list">
    <div class="acgn-list-item" v-for="item in acgnContentList" :key="item.acgnId" @click.stop="acgnHandle(item)">
      <img
        class="acgn-image"
        v-if="item.acgnMemoryImage.length > 0"
        :src="'http://localhost:9810/acgnrecord/image/' + item.acgnMemoryImage[0]"
      />
      <img class="acgn-image" v-else :src="'http://localhost:9810/acgnrecord/defaultImage/sora.png'" />
      <div class="acgn-title">{{ item.acgnTitle }}</div>
      <div class="acgn-subTitle">{{ item.acgnTitle }}</div>
      <div class="acgn-subTitle">{{ item.acgnSubTitle }}</div>
      <div class="acgn-score">{{ item.acgnScore }}</div>
    </div>
  </div>
</template>

<script>
import { ACGN } from '@/common/acgn'
import { getAcgnContentList } from '@/api/acgnContent'
export default {
  props: {
    windowKey: {
      default: ''
    }
  },
  mounted() {
    this.userData = this.$localStorage.get('userData') || { uid: null }
    getAcgnContentList({
      uid: this.userData.uid,
      acgnType: this.windowKey
    }).then((res) => {
      if (res.code == 200) {
        this.acgnContentList = res.data.acgnContentList
        this.$message.success(res.msg)
      } else {
        this.$message.warning(res.msg)
      }
    })
  },
  data() {
    return {
      userData: {},
      acgnContentList: []
    }
  },
  methods: {
    acgnHandle(acgnContent) {
      this.$emit('clickListItem', acgnContent)
    }
  }
}
</script>

<style lang="scss" scoped>
.acgn-list {
  margin-top: 20px;
  padding-left: 20%;
  padding-right: 20%;
  .acgn-list-item {
    padding: 10px;
    border: 1px solid #fff;
    .acgn-image {
      width: 100%;
    }
  }
}
</style>