<template>
  <div class="acgn-list">
    <div class="acgn-list-item" v-for="item in acgnContentList" :key="item.acgnId" @click.stop="readAcgnContent(item)">
      <div class="acgn-title">{{ item.acgnTitle }}</div>
      <!-- <div class="acgn-subTitle">{{ item.acgnSubTitle }}</div> -->
      <div class="acgn-comment">{{ item.acgnComment }}</div>
      <img
        class="acgn-image"
        v-if="item.acgnMemoryImage.length > 0"
        :src="'http://localhost:9810/acgnrecord/image/' + item.acgnMemoryImage[0]"
      />
      <img class="acgn-image" v-else :src="'http://localhost:9810/acgnrecord/defaultImage/sora.png'" />
      <div class="acgn-image-mask"></div>
      <!-- <div class="delete-acgn">X</div> -->
      <!-- <div class="acgn-subTitle">{{ item.acgnSubTitle }}</div> -->
      <!-- <div class="acgn-score">{{ item.acgnScore }}</div> -->
    </div>
  </div>
</template>

<script>
import { ACGN } from '@/common/acgn'
import { getAcgnContentList } from '@/api/acgnContent'
import { getTomoAcgnContentList } from '@/api/tomo'
export default {
  props: {
    windowKey: {
      default: ''
    }
  },
  mounted() {
    this.userData = this.$localStorage.get('userData') || { acgnUid: null }
    if (this.windowKey.includes('tomo')) {
      let tomoUid = this.windowKey.split('_')[1]
      getTomoAcgnContentList({
        acgnUid: parseInt(tomoUid)
      })
        .then((res) => {
          if (res.code === 200) {
            this.acgnContentList = res.data.acgnContentList
            this.$message.success(res.msg)
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch(() => {
          this.$message.error('前端出bug啦')
        })
    } else {
      getAcgnContentList({
        acgnUid: this.userData.acgnUid,
        acgnType: this.windowKey
      }).then((res) => {
        if (res.code == 200) {
          this.acgnContentList = res.data.acgnContentList
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.msg)
        }
      })
    }
  },
  data() {
    return {
      userData: {},
      acgnContentList: []
    }
  },
  methods: {
    readAcgnContent(acgnContent) {
      this.$emit('clickListItem', acgnContent)
    }
  }
}
</script>

<style lang="scss" scoped>
.acgn-list {
  margin-top: 20px;
  text-align: center;
  .acgn-list-item {
    padding: 10px;
    margin-bottom: 40px;
    border: 1px solid #fff;
    position: relative;
    min-height: 150px;
    height: auto;
    min-width: 300px;
    width: auto;
    max-width: 600px;
    left: 50%;
    transform: translate(-50%, 0);
    transition: 0.2s ease-in-out;
    .acgn-title {
      position: absolute;
      font-size: 30px;
      transition: 0.4s ease-in-out;
      z-index: 2;
      left: 10px;

      overflow-x: hidden;
      white-space: nowrap;
      max-width: -webkit-fill-available;
    }
    .acgn-image {
      min-width: 280px;
      // max-width: 580px;
      width: 100%;
      margin-top: 40px;
      position: relative;
      display: block;
      transition: 0.2s ease-in-out;
    }
    .acgn-image-mask {
      left: 0;
      top: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .acgn-comment {
      height: auto;
      max-height: 40%;
      width: 90%;
      position: absolute;
      overflow-y: hidden;
      opacity: 0;
      display: inline-block;
      transition: 0.4s ease-in-out;
      z-index: 2;
      left: 20px;
      top: 120px;
    }
    .acgn-subTitle {
      position: absolute;
      display: inline-block;
    }

    .delete-acgn {
      width: 40px;
      height: 40px;
      line-height: 40px;
      position: absolute;
      top: 20px;
      right: 20px;
      background-color: $bgColor;
      color: $fontColor;
      border-radius: 20px;
      transition: 0.3s ease;
      opacity: 0;
      &:hover {
        cursor: pointer;
        background-color: $acgnThemeBGColorHover;
        transform: rotate(180deg);
      }
    }
    &:hover {
      cursor: pointer;
      transform: scale(1.1) translate(-45%, 0);
      box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);
      .acgn-comment {
        font-size: 20px;
      }
      .acgn-comment,
      .acgn-image-mask,
      .delete-acgn {
        opacity: 1;
      }
      .acgn-image {
        margin-top: 0px;
      }
      .acgn-title {
        top: 20px;
        font-size: 50px;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
  }
}
</style>