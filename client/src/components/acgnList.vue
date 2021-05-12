<template>
  <div class="acgn-list">
    <acgn-loading :loaded="loadData.loaded" :loadSize="imageArray.length"></acgn-loading>
    <div class="acgn-list-top">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-count="pageTotal"
        layout="total, prev, pager, next, jumper"
      >
      </el-pagination>
      <select v-model="tomoAcgnType" v-if="windowKey.includes('tomo')" @change="changeAcgnType">
        <option :value="''">全部</option>
        <option :value="ACGN.A">{{ ACGN.A }}</option>
        <option :value="ACGN.C">{{ ACGN.C }}</option>
        <option :value="ACGN.G">{{ ACGN.G }}</option>
        <option :value="ACGN.N">{{ ACGN.N }}</option>
      </select>
      <div style="display: flex; align-items: center; margin-left: 30px">
        <input v-model="acgnTitle" @keydown.enter="searchAcgnContent" placeholder="请输入作品名搜索" />
        <acgn-button :fontSize="15" :width="80" @click="searchAcgnContent">搜索</acgn-button>
      </div>
    </div>
    <div class="acgn-list-item" v-for="item in acgnContentList" :key="item.acgnId" @click.stop="readAcgnContent(item)">
      <div class="acgn-title">{{ item.acgnTitle }}</div>
      <!-- <div class="acgn-subTitle">{{ item.acgnSubTitle }}</div> -->
      <div class="acgn-comment">{{ item.acgnComment }}</div>
      <img
        class="acgn-image"
        v-if="item.acgnMemoryImage.length > 0"
        :src="'http://localhost:9810/acgnrecord/image/' + item.acgnMemoryImage[0]"
      />
      <img class="acgn-image" v-else :src="'http://localhost:9810/acgnrecord/defaultImage/noImage.jpg'" />
      <div class="acgn-image-mask"></div>
      <!-- <div class="acgn-subTitle">{{ item.acgnSubTitle }}</div> -->
      <!-- <div class="acgn-score">{{ item.acgnScore }}</div> -->
    </div>
    <div class="list-no-data" v-if="acgnContentList.length === 0">
      <img style="width: 200px" :src="'http://localhost:9810/acgnrecord/defaultImage/noData.png'" />
      <div class="list-no-data-text">无作品记录</div>
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
    this.getAcgnContent()
  },
  data() {
    return {
      ACGN,
      userData: {},
      acgnContentList: [],
      page: 1,
      pageTotal: 0,
      acgnTitle: '',
      loadData: {
        apiSrc: 'http://localhost:9810/acgnrecord/image/',
        loaded: 0
      },
      imageArray: [],
      tomoAcgnType: ''
    }
  },
  methods: {
    readAcgnContent(acgnContent) {
      this.$emit('clickListItem', acgnContent)
    },
    handleCurrentChange(page) {
      this.page = page
      this.getAcgnContent()
    },
    changeAcgnType() {
      this.page = 1
      this.getAcgnContent()
    },
    searchAcgnContent() {
      this.page = 1
      this.getAcgnContent()
    },
    getAcgnContent() {
      if (this.windowKey.includes('tomo')) {
        let tomoUid = this.windowKey.split('_')[2]
        getTomoAcgnContentList({
          acgnUid: parseInt(tomoUid),
          acgnType: this.tomoAcgnType,
          page: this.page,
          pageSize: 10,
          acgnTitle: this.acgnTitle
        })
          .then((res) => {
            if (res.code === 200) {
              this.acgnContentList = res.data.acgnContentList
              if (this.acgnContentList.length && this.acgnContentList.length === 0) {
                this.$message.success('列表数据为空')
              } else {
                this.pageTotal = res.data.pageTotal
                this.imageArray = this.acgnContentList.map((item) => {
                  if (item.acgnMemoryImage[0]) {
                    return item.acgnMemoryImage[0]
                  }
                })
                this.imageArray = this.imageArray.filter((item) => item)
                this.loadData.loaded = 0
                this.loadAcgnImage(this.imageArray, this.loadData)
              }
              // this.$message.success(res.msg)
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
          acgnType: this.windowKey,
          page: this.page,
          pageSize: 10,
          acgnTitle: this.acgnTitle,
          listType: 'list'
        }).then((res) => {
          if (res.code == 200) {
            this.acgnContentList = res.data.acgnContentList
            if (this.acgnContentList.length && this.acgnContentList.length === 0) {
              this.$message.success('列表数据为空')
            } else {
              this.pageTotal = res.data.pageTotal
              this.imageArray = this.acgnContentList.map((item) => {
                if (item.acgnMemoryImage[0]) {
                  return item.acgnMemoryImage[0]
                }
              })
              this.imageArray = this.imageArray.filter((item) => item)
              this.loadData.loaded = 0
              this.loadAcgnImage(this.imageArray, this.loadData)
            }
            // this.$message.success(res.msg)
          } else {
            this.$message.warning(res.msg)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.acgn-list {
  width: 100%;
  overflow: auto;
  padding-top: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
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
    transition: 0.2s ease-in-out;
    &:hover {
      cursor: pointer;
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
  }

  .acgn-list-top {
    position: fixed;
    max-width: calc(100% - 60px);
    height: 50px;
    top: 40px;
    opacity: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition: 0.3s;
    z-index: 428;
    background-color: $bgColor;
    overflow: auto;
    padding: 0 30px;
    &:hover {
      opacity: 1;
    }
    input {
      margin-top: 0;
      font-size: 15px;
      line-height: 25px;
    }
    select {
      margin-top: 0;
      margin-left: 20px;
      font-size: 15px;
      line-height: 25px;
      padding: 5px 0;
    }
    .acgn-button {
      margin-left: 7px;
      margin-top: 0;
    }
    .el-pagination {
      &::v-deep {
        input {
          margin-top: 0;
        }
      }
    }
  }
  .list-no-data {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .list-no-data-text {
      color: $acgnThemeColor;
      font-size: 25px;
      font-weight: 800;
      -webkit-text-stroke: 1px #ffffff;
      text-stroke: 1px #ffffff;
    }
  }
}
</style>