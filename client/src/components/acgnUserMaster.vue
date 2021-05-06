<template>
  <div class="acgnUserMaster">
    <div class="acgn-master-header">
      <div class="search-input">
        <input v-model="acgnUserName" @keydown.enter="searchAcgnUser" placeholder="请输入用户名搜索" />
        <input v-model="acgnUserEmail" @keydown.enter="searchAcgnUser" placeholder="请输入邮箱搜索" />
      </div>
      <div class="handle-button">
        <acgn-button :width="150" @click="changeUserStatus('more', 2)">批量封禁</acgn-button>
        <acgn-button :width="150" @click="changeUserStatus('more', 1)">批量开放</acgn-button>
      </div>
    </div>
    <div class="acgn-master-main">
      <el-table :data="tableData" style="width: 100%" :empty-text="'-'" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="acgnUid" label="用户ID" width="100"> </el-table-column>
        <el-table-column prop="acgnUserName" label="用户名" width="150"> </el-table-column>
        <el-table-column prop="acgnUserEmail" label="用户邮箱" width="200"> </el-table-column>
        <el-table-column label="用户好友" width="200">
          <template slot-scope="scope">
            <span v-for="item in JSON.parse(scope.row.acgnTomo)" :key="item.acgnUid">{{
              '用户id:' + item.acgnUid + ' / 用户名:' + item.acgnUserName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="acgnUserStatus" label="状态" width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.acgnUserStatus === 1 ? '正常' : '封禁' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ getLocalTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <acgn-button @click="changeUserStatus(scope.row, 2)" width="60" v-if="scope.row.acgnUserStatus === 1"
              >封禁</acgn-button
            >
            <acgn-button @click="changeUserStatus(scope.row, 1)" width="60" v-else>开放</acgn-button>
            <acgn-button @click="readUserData(scope.row)" width="60">详情</acgn-button>
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
import Bus from '@/common/bus'
import { getAcgnUserData, changeAcgnUserStatus } from '@/api/master'
import { getLocalTime } from '@/util/acgnFunc'
export default {
  props: {
    windowKey: {
      default: 'acgn'
    }
  },
  created() {
    this.searchAcgnUserData()
  },
  data() {
    return {
      tableData: [],
      selectTableRowKey: [],
      acgnUserName: '',
      acgnUserEmail: '',
      page: 1,
      pageSize: 10,
      pageTotal: 10
    }
  },
  methods: {
    getLocalTime,
    handleSelectionChange(val) {
      this.selectTableRowKey = val.map((item) => item.acgnUid)
    },
    changeUserStatus(data, status) {
      let acgnUid
      if (data === 'more') {
        acgnUid = this.selectTableRowKey.toString()
      } else {
        acgnUid = data.acgnUid.toString()
      }
      changeAcgnUserStatus({
        acgnUid: acgnUid,
        acgnUserStatus: status
      })
        .then((res) => {
          if (res.code === 200) {
            this.searchAcgnUserData()
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
      this.searchAcgnUserData()
    },
    searchAcgnUser() {
      this.page = 1
      this.searchAcgnUserData()
    },
    searchAcgnUserData() {
      getAcgnUserData({
        page: this.page,
        pageSize: this.pageSize,
        acgnUserName: this.acgnUserName,
        acgnUserEmail: this.acgnUserEmail
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
    },
    readUserData(userData) {
      Bus.$emit('readUserData', userData)
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnUserMaster {
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
  .acgn-button {
    margin: 0 0 5px 10px;
  }
  input {
    margin: 0 0 0 10px;
  }
}
</style>