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
      <div style="display: flex; align-items: center; margin-left: 30px">
        <input v-model="acgnTitle" @keydown.enter="searchAcgnContent" placeholder="请输入作品名搜索" />
        <acgn-button :fontSize="15" :width="80" @click="searchAcgnContent">搜索</acgn-button>
      </div>
    </div>
    <div class="acgn-list-item" v-for="item in acgnContentList" :key="item.acgnId" @click.stop="acgnHandle(item)">
      <div class="acgn-title">{{ item.acgnTitle }}</div>
      <!-- <div class="acgn-subTitle">{{ item.acgnSubTitle }}</div> -->
      <div class="acgn-comment">{{ item.acgnComment }}</div>
      <div class="acgn-ban" v-if="item.acgnStatus === 2">封禁中{{ item.banReason ? '：' + item.banReason : '' }}</div>
      <img
        class="acgn-image"
        v-if="item.acgnMemoryImage.length > 0"
        :src="'http://localhost:9810/acgnrecord/image/' + item.acgnMemoryImage[0]"
      />
      <img class="acgn-image" v-else :src="'http://localhost:9810/acgnrecord/defaultImage/noImage.jpg'" />
      <div class="acgn-image-mask"></div>
      <el-popconfirm title="是否要删除该作品" @confirm="deleteAcgn(item.acgnId)" hide-icon>
        <div class="delete-acgn" slot="reference" @click="clickDelete">X</div>
      </el-popconfirm>
      <!-- <div class="acgn-subTitle">{{ item.acgnSubTitle }}</div> -->
      <!-- <div class="acgn-score">{{ item.acgnScore }}</div> -->
    </div>
  </div>
</template>

<script>
import Bus from '@/common/bus'
import { ACGN } from '@/common/acgn'
import { getAcgnContentList, delectAcgnContent } from '@/api/acgnContent'
export default {
  props: {
    windowKey: {
      default: ''
    }
  },
  data() {
    return {
      userData: {},
      acgnContentList: [],
      page: 1,
      pageTotal: 0,
      acgnTitle: '',
      loadData: {
        apiSrc: 'http://localhost:9810/acgnrecord/image/',
        loaded: 0
      },
      imageArray: []
    }
  },
  mounted() {
    this.userData = this.$localStorage.get('userData') || { acgnUid: null }
    Bus.$on('refreshList', () => {
      this.getAcgnContent()
    })
    this.getAcgnContent()
  },
  methods: {
    acgnHandle(acgnContent) {
      this.$emit('clickListItem', acgnContent)
    },
    handleCurrentChange(page) {
      this.page = page
      this.getAcgnContent()
    },
    searchAcgnContent() {
      this.page = 1
      this.getAcgnContent()
    },
    getAcgnContent() {
      getAcgnContentList({
        acgnUid: this.userData.acgnUid,
        acgnType: this.windowKey,
        page: this.page,
        pageSize: 10,
        acgnTitle: this.acgnTitle,
        listType: 'handle'
      }).then((res) => {
        if (res.code == 200) {
          this.acgnContentList = res.data.acgnContentList
          this.pageTotal = res.data.pageTotal
          this.imageArray = this.acgnContentList.map((item) => {
            if (item.acgnMemoryImage[0]) {
              return item.acgnMemoryImage[0]
            }
          })
          this.imageArray = this.imageArray.filter((item) => item)
          this.loadData.loaded = 0
          this.loadAcgnImage(this.imageArray, this.loadData)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    deleteAcgn(acgnId) {
      delectAcgnContent({ acgnId: acgnId })
        .then((res) => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.getAcgnContent()
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('前端出bug了')
        })
    },
    clickDelete(e) {
      e.stopPropagation()
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
      transform: scale(1.05);
      box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);
      .acgn-comment {
        font-size: 20px;
      }
      .acgn-comment,
      .acgn-image-mask,
      .delete-acgn {
        opacity: 1;
      }
      .acgn-ban {
        opacity: 0.5;
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
    .acgn-ban {
      height: 100px;
      width: 90%;
      position: absolute;
      overflow-y: hidden;
      opacity: 0;
      display: inline-block;
      transition: 0.4s ease-in-out;
      z-index: 2;
      top: 20%;
      left: 20px;
      font-size: 40px;
      font-weight: 700;
      -webkit-text-stroke: 1.5px #ffffff;
      text-stroke: 1.5px #ffffff;
      color: #fa0202;
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
      z-index: 3;
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
}
</style>