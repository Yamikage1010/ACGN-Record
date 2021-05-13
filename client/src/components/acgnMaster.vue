<template>
  <div class="acgnMaster">
    <div class="acgn-master-header">
      <div class="search-input">
        <input v-model="acgnUserName" @keydown.enter="searchAcgn" placeholder="请输入用户名搜索" />
        <input v-model="acgnTitle" @keydown.enter="searchAcgn" placeholder="请输入作品名字搜索" />
        <select v-model="acgnType" @change="searchAcgn">
          <option :value="''">全部</option>
          <option :value="ACGN.A">{{ ACGN.A }}</option>
          <option :value="ACGN.C">{{ ACGN.C }}</option>
          <option :value="ACGN.G">{{ ACGN.G }}</option>
          <option :value="ACGN.N">{{ ACGN.N }}</option>
        </select>
        <select v-model="acgnStatus" @change="searchAcgn">
          <option :value="''">全部</option>
          <option :value="1">开放</option>
          <option :value="2">封禁</option>
        </select>
      </div>
      <div class="handle-button">
        <acgn-button :width="150" @click="changeAcgnStatus($event, 'more', 2)">批量封禁</acgn-button>
        <acgn-button :width="150" @click="changeAcgnStatus($event, 'more', 1)">批量开放</acgn-button>
      </div>
    </div>
    <div class="acgn-master-main">
      <el-table :data="tableData" style="width: 100%" :empty-text="'-'" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="acgnId" label="作品id" width="80"> </el-table-column>
        <el-table-column prop="acgnTitle" label="作品标题" width="150"> </el-table-column>
        <el-table-column prop="acgnSubTitle" label="作品副标题" width="100"> </el-table-column>
        <el-table-column prop="acgnType" label="作品类型" width="80"> </el-table-column>
        <el-table-column prop="acgnUserName" label="用户名" width="150"> </el-table-column>
        <el-table-column prop="acgnStatus" label="状态" width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.acgnStatus === 1 ? '正常' : '封禁' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ getLocalTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <acgn-button @click="changeAcgnStatus($event, scope.row, 2)" width="60" v-if="scope.row.acgnStatus === 1"
              >封禁</acgn-button
            >
            <acgn-button @click="changeAcgnStatus($event, scope.row, 1)" width="60" v-else>开放</acgn-button>
            <acgn-button @click="readAcgnData(scope.row)" width="60">详情</acgn-button>
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
import { ACGN } from '@/common/acgn'
import { getAcgnContentData, changeAcgnContentStatus } from '@/api/master'
import { getLocalTime } from '@/util/acgnFunc'
export default {
  props: {
    windowKey: {
      default: 'acgn'
    }
  },
  data() {
    return {
      ACGN,
      tableData: [],
      selectTableRowKey: [],
      acgnUserName: '',
      acgnTitle: '',
      acgnType: '',
      acgnStatus: '',
      page: 1,
      pageSize: 10,
      pageTotal: 10
    }
  },
  mounted() {
    Bus.$on('refreshAcgnTable', () => {
      this.searchAcgnData()
    })
    this.searchAcgnData()
  },
  methods: {
    getLocalTime,
    handleSelectionChange(val) {
      this.selectTableRowKey = val.map((item) => item.acgnId)
    },
    changeAcgnStatus(event, data, status) {
      let acgnId
      if (data === 'more') {
        if (this.selectTableRowKey.length === 0) {
          this.$message.warning('请选择数据')
          return
        }
        acgnId = this.selectTableRowKey.toString()
      } else {
        acgnId = data.acgnId.toString()
      }
      if (status === 1) {
        changeAcgnContentStatus({
          acgnId: acgnId,
          acgnStatus: status,
          banReason: ''
        })
          .then((res) => {
            if (res.code === 200) {
              this.searchAcgnData()
              this.$message.success(res.msg)
            } else {
              this.$message.warning(res.msg)
            }
          })
          .catch((err) => {
            console.log(err)
            this.$message.error('前端出bug啦')
          })
      } else {
        Bus.$emit('changeAcgnStatus', {
          event: event,
          acgnId: acgnId,
          acgnStatus: status
        })
      }
    },
    handleCurrentChange(page) {
      this.page = page
      this.searchAcgnData()
    },
    searchAcgn() {
      this.page = 1
      this.searchAcgnData()
    },
    searchAcgnData() {
      getAcgnContentData({
        page: this.page,
        pageSize: this.pageSize,
        acgnUserName: this.acgnUserName,
        acgnTitle: this.acgnTitle,
        acgnType: this.acgnType,
        acgnStatus: this.acgnStatus
      })
        .then((res) => {
          this.tableData = res.data.tableData
          this.pageTotal = res.data.pageTotal
          if (res.code === 200) {
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('前端出bug啦')
        })
    },
    readAcgnData(acgnData) {
      Bus.$emit('readAcgnData', acgnData)
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnMaster {
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
        width: 100px;
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
  input,
  select {
    margin: 0 0 0 10px;
  }
}
</style>