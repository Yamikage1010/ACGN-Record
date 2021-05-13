<template>
  <div class="acgnFileMaster">
    <acgn-loading :loaded="loadData.loaded" :loadSize="imageArray.length"></acgn-loading>
    <div class="acgn-master-header">
      <div class="search-input">
        <input v-model="acgnFileName" @keydown.enter="fileNameSearch" placeholder="请输入文件名搜索" />
        <input v-model="acgnUserName" @keydown.enter="acgnUserNameSearch" placeholder="请输入用户名搜索" />
        <select v-model="acgnFileType" @change="selectChange">
          <option :value="''">全部</option>
          <option :value="'image'">图片</option>
          <option :value="'music'">音乐</option>
          <option :value="'video'">视频</option>
        </select>
        <select v-model="acgnFileStatus" @change="fileNameSearch">
          <option :value="''">全部</option>
          <option :value="1">开放</option>
          <option :value="2">封禁</option>
        </select>
      </div>
      <div class="handle-button">
        <acgn-button :width="150" @click="changeFileStatus('more', 2)">批量封禁</acgn-button>
        <acgn-button :width="150" @click="changeFileStatus('more', 1)">批量开放</acgn-button>
      </div>
    </div>
    <div class="acgn-master-main">
      <el-table :data="tableData" style="width: 100%" :empty-text="'-'" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="acgnFileId" label="文件ID" width="100"> </el-table-column>
        <el-table-column prop="acgnUserName" label="用户名" width="150"> </el-table-column>
        <el-table-column prop="acgnFileName" label="文件名" width="150"> </el-table-column>
        <el-table-column label="文件" width="300">
          <template slot-scope="scope">
            <img
              v-if="scope.row.acgnFileType === 'image'"
              :src="'http://localhost:9810/acgnrecord/masterImage/' + scope.row.acgnFileName"
            />
            <audio
              v-if="scope.row.acgnFileType === 'music'"
              :src="'http://localhost:9810/acgnrecord/masterMusic/' + scope.row.acgnFileName"
              controls
            >
              您的浏览器不支持该音乐播放组件。
            </audio>
            <video
              v-if="scope.row.acgnFileType === 'video'"
              :src="'http://localhost:9810/acgnrecord/masterVideo/' + scope.row.acgnFileName"
              controls
              controlslist="nodownload noremoteplayback"
              disablePictureInPicture
            >
              您的浏览器不支持该视频播放组件。
            </video>
          </template>
        </el-table-column>
        <el-table-column prop="acgnFileStatus" label="状态" width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.acgnFileStatus === 1 ? '正常' : '违规' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间">
          <template slot-scope="scope">
            <span>{{ getLocalTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <acgn-button @click="changeFileStatus(scope.row, 2)" width="60" v-if="scope.row.acgnFileStatus === 1"
              >封禁</acgn-button
            >
            <acgn-button @click="changeFileStatus(scope.row, 1)" width="60" v-else>开放</acgn-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="acgn-master-footer">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page"
        layout="total, prev, pager, next, jumper"
        :page-count="pageTotal"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getAcgnFileData, changeAcgnFileStatus } from '@/api/master'
import { getLocalTime } from '@/util/acgnFunc'
export default {
  props: {
    windowKey: {
      default: 'acgn'
    }
  },
  data() {
    return {
      tableData: [],
      selectTableRowKey: [],
      acgnUserName: '',
      acgnFileName: '',
      acgnFileType: '',
      acgnFileStatus: '',
      page: 1,
      pageSize: 10,
      pageTotal: 10,
      imageArray: [],
      loadData: {
        apiSrc: 'http://localhost:9810/acgnrecord/image/',
        loaded: 0
      }
    }
  },
  mounted() {
    this.searchAcgnFileData()
  },
  methods: {
    getLocalTime,
    handleSelectionChange(val) {
      this.selectTableRowKey = val.map((item) => item.acgnFileId)
    },
    changeFileStatus(data, status) {
      let acgnFileId
      if (data === 'more') {
        if (this.selectTableRowKey.length === 0) {
          this.$message.warning('请选择数据')
          return
        }
        acgnFileId = this.selectTableRowKey.toString()
      } else {
        acgnFileId = data.acgnFileId.toString()
      }
      changeAcgnFileStatus({
        acgnFileId: acgnFileId,
        acgnFileStatus: status
      })
        .then((res) => {
          if (res.code === 200) {
            this.searchAcgnFileData()
            this.$message.success(res.msg)
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('前端出bug啦')
        })
    },
    handleCurrentChange(page) {
      this.page = page
      this.searchAcgnFileData()
    },
    selectChange() {
      this.page = 1
      this.searchAcgnFileData()
    },
    fileNameSearch() {
      this.page = 1
      this.searchAcgnFileData()
    },
    acgnUserNameSearch() {
      this.page = 1
      this.searchAcgnFileData()
    },
    searchAcgnFileData() {
      getAcgnFileData({
        page: this.page,
        pageSize: this.pageSize,
        acgnUserName: this.acgnUserName,
        acgnFileName: this.acgnFileName,
        acgnFileType: this.acgnFileType,
        acgnFileStatus: this.acgnFileStatus
      })
        .then((res) => {
          this.tableData = res.data.tableData
          this.pageTotal = res.data.pageTotal
          if (res.code === 200) {
            this.imageArray = this.tableData.map((item) => {
              if (item.acgnFileType === 'image') {
                return item.acgnFileName
              }
            })
            this.imageArray = this.imageArray.filter((item) => item)
            this.loadData.loaded = 0
            this.loadAcgnImage(this.imageArray, this.loadData)
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('前端出bug啦')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnFileMaster {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .acgn-master-header {
    display: flex;
    justify-content: space-between;
    height: 50px;
    width: 70%;
    min-width: 1000px;
    position: absolute;
    .search-input,
    .handle-button {
      display: flex;
      justify-content: space-around;
      align-items: center;
      input {
        font-size: 15px;
        width: 200px;
        padding: 5px;
      }
      select {
        font-size: 15px;
        width: 80px;
        padding: 5px;
      }
    }
  }
  .acgn-master-main {
    width: 70%;
    min-width: 1000px;
    overflow: auto;
    height: 85%;
    margin-top: 50px;
    margin-bottom: 20px;
    &::v-deep {
      img {
        max-width: 200px;
        max-height: 200px;
      }
      audio,
      video {
        max-width: 250px;
        max-height: 250px;
      }
    }
  }
  .acgn-master-footer {
    &::v-deep {
      input {
        margin-top: 0;
      }
    }
  }
  .acgn-button,
  input,
  select {
    margin: 0 0 0 10px;
  }
}
</style>