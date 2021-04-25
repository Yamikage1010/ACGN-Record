<template>
  <div class="acgnFileMaster">
    <div class="acgn-master-header">
      <div class="search-input">
        <input v-model="acgnFileName" @keydown.enter="searchAcgnFileData" placeholder="请输入文件名搜索" />
        <input v-model="acgnUserName" @keydown.enter="searchAcgnFileData" placeholder="请输入用户名搜索" />
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
        <el-table-column label="图片" width="180">
          <template slot-scope="scope">
            <img style="width: 150px" :src="'http://localhost:9810/acgnrecord/masterImage/' + scope.row.acgnFileName" />
          </template>
        </el-table-column>
        <el-table-column prop="acgnFileStatus" label="状态" width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.acgnFileStatus === 1 ? '正常' : '违规' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="上传时间"> </el-table-column>
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
export default {
  props: {
    windowKey: {
      default: 'acgn'
    }
  },
  created() {
    if (this.windowKey === 'acgn') {
    } else {
      this.searchAcgnFileData()
    }
  },
  data() {
    return {
      tableData: [],
      selectTableRowKey: [],
      acgnUserName: '',
      acgnFileName: '',
      page: 1,
      pageSize: 10,
      pageTotal: 10
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.selectTableRowKey = val.map((item) => item.acgnFileId)
    },
    changeFileStatus(data, status) {
      let acgnFileId
      if (data === 'more') {
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
    searchAcgnFileData() {
      getAcgnFileData({
        page: this.page,
        pageSize: this.pageSize,
        acgnUserName: this.acgnUserName,
        acgnFileName: this.acgnFileName
      })
        .then((res) => {
          if (res.code === 200) {
            this.tableData = res.data.tableData
            this.pageTotal = res.data.pageTotal
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
    }
  }
  .acgn-master-main {
    width: 70%;
    min-width: 1000px;
    overflow: auto;
    height: 85%;
    margin-top: 50px;
    margin-bottom: 20px;
  }
  .acgn-master-footer {
    &::v-deep {
      input {
        margin-top: 0;
      }
    }
  }
  .acgn-button,
  input {
    margin: 0 0 0 10px;
  }
}
</style>