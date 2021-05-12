<template>
  <div class="acgn-handle acgn-form">
    <div class="acgn-form-box">
      <div class="acgn-form-item">
        <label class="acgn-form-item-label">作品类型</label>
        <select v-model="acgnFormData.acgnType">
          <option :value="ACGN.A">{{ ACGN.A }}</option>
          <option :value="ACGN.C">{{ ACGN.C }}</option>
          <option :value="ACGN.G">{{ ACGN.G }}</option>
          <option :value="ACGN.N">{{ ACGN.N }}</option>
        </select>
      </div>
      <div class="acgn-form-item">
        <label class="acgn-form-item-label">标题</label>
        <input v-model="acgnFormData.acgnTitle" />
      </div>
      <div class="acgn-form-item">
        <label class="acgn-form-item-label">副标题</label>
        <input v-model="acgnFormData.acgnSubTitle" />
      </div>
    </div>
    <div class="acgn-form-box">
      <div class="acgn-form-item">
        <label class="acgn-form-item-label">作品相册</label>
        <el-carousel
          :interval="5000"
          type="card"
          height="150px"
          style="margin-top: 30px; min-width: 350px"
          v-if="acgnFormData.acgnMemoryImage.length > 0"
        >
          <el-carousel-item v-for="(item, index) in acgnFormData.acgnMemoryImage" :key="index">
            <img
              :src="'http://localhost:9810/acgnrecord/GMImage/' + item"
              style="max-width: 200px; max-height: 200px"
            />
          </el-carousel-item>
        </el-carousel>
        <img
          style="max-width: 200px; max-height: 200px"
          v-else-if="acgnFormData.acgnMemoryImage.length === 1"
          :src="'http://localhost:9810/acgnrecord/GMImage/' + acgnFormData.acgnMemoryImage[0]"
        />
        <acgn-button @click="openImageManage('content')">图片管理</acgn-button>
      </div>
    </div>
    <div class="acgn-form-box">
      <div class="acgn-form-item">
        <label class="acgn-form-item-label">综合评价</label>
        <el-rate v-model="acgnFormData.acgnScore" :max="10"></el-rate>
      </div>
      <div class="acgn-form-item">
        <label class="acgn-form-item-label">作品评析</label>
        <textarea v-model="acgnFormData.acgnComment"></textarea>
      </div>
    </div>
    <div class="acgn-form-box">
      <div class="acgn-form-item">
        <label class="acgn-form-item-label">作品属性</label>
        <acgn-radar
          :width="400"
          :height="400"
          :indicator="acgnFormData.acgnAttribute.indicator"
          :dataValue="acgnFormData.acgnAttribute.dataValue"
        ></acgn-radar>
        <div class="acgn-attribute">
          <div class="attributeList" v-for="(item, index) in acgnFormData.acgnAttribute.indicator" :key="index">
            <div class="attribute-name" v-if="index < 3">{{ item.name }}</div>
            <input class="attribute-name" v-else v-model="item.name" />：
            <input class="attribute-value" v-model="acgnFormData.acgnAttribute.dataValue[index]" />
          </div>
        </div>
        <acgn-button @click="addAcgnAttribute">添加属性</acgn-button>
        <acgn-button @click="reduceAcgnAttribute">减少属性</acgn-button>
      </div>
    </div>
    <div
      class="acgn-form-box"
      style="max-height: 600px"
      v-if="acgnFormData.acgnType === ACGN.A || acgnFormData.acgnType === ACGN.G"
    >
      <div class="acgn-form-item">
        <label class="acgn-form-item-label">资源记录</label>
        <div class="acgn-characteristic">
          <div class="acgn-characteristic-item">标题<span style="right: 0">资源类型</span></div>
          <div
            class="acgn-characteristic-item"
            v-for="(sourse, index) in acgnFormData.acgnCharacteristic.animationSourse"
            :key="index"
          >
            <div class="acgn-characteristic-item-title">{{ sourse.title }}</div>
            <span style="right: 0">{{ sourse.fileType === 'music' ? '音乐' : '视频' }}</span>
          </div>
        </div>
        <acgn-button @click="openSourseManage()">资源管理</acgn-button>
      </div>
    </div>
    <div
      class="acgn-form-box"
      style="max-height: 600px"
      v-if="acgnFormData.acgnType === ACGN.C || acgnFormData.acgnType === ACGN.N"
    >
      <div class="acgn-form-item">
        <label class="acgn-form-item-label">分卷记录</label>
        <div class="acgn-characteristic">
          <div class="acgn-characteristic-item" style="justify-content: center">
            <div class="acgn-characteristic-item-title">卷标题</div>
          </div>
          <div
            class="acgn-characteristic-item"
            v-for="(volume, index) in acgnFormData.acgnCharacteristic.volumes"
            :key="index"
            style="justify-content: center"
          >
            <div class="acgn-characteristic-item-title">{{ volume.title }}</div>
          </div>
        </div>
        <acgn-button @click="openVolumeManage()">分卷管理</acgn-button>
      </div>
    </div>
    <div class="acgn-characters" v-for="(character, index) in acgnCharacters" :key="index">
      <el-popconfirm title="是否要删除该人物" @confirm="deleteCharacter(index)" hide-icon>
        <div class="delete-character" slot="reference">X</div>
      </el-popconfirm>
      <div class="acgn-form-box">
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">人物名字</label>
          <input v-model="character.characterName" />
        </div>
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">人物评析</label>
          <textarea v-model="character.characterComment" rows="3" cols="20"></textarea>
        </div>
      </div>
      <div class="acgn-form-box">
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">人物相册</label>
          <el-carousel
            :interval="5000"
            type="card"
            height="150px"
            style="margin-top: 30px; min-width: 350px"
            v-if="character.characterImage.length > 0"
          >
            <el-carousel-item v-for="(item, index) in character.characterImage" :key="index">
              <img
                :src="'http://localhost:9810/acgnrecord/GMImage/' + item"
                style="max-width: 200px; max-height: 200px"
              />
            </el-carousel-item>
          </el-carousel>
          <img
            v-else-if="character.characterImage.length === 1"
            style="max-width: 200px; max-height: 200px"
            :src="'http://localhost:9810/acgnrecord/GMImage/' + character.characterImage[0]"
          />
          <acgn-button @click="openImageManage(index)">图片管理</acgn-button>
        </div>
      </div>
      <div class="acgn-form-box">
        <div class="acgn-form-item">
          <label class="acgn-form-item-label">人物属性</label>
          <acgn-radar
            :width="300"
            :height="300"
            :indicator="character.characterAttribute.indicator"
            :dataValue="character.characterAttribute.dataValue"
          ></acgn-radar>
          <div class="acgn-attribute">
            <div class="attributeList" v-for="(item, index) in character.characterAttribute.indicator" :key="index">
              <input class="attribute-name" v-model="item.name" />：
              <input class="attribute-value" v-model="character.characterAttribute.dataValue[index]" />
            </div>
          </div>
          <acgn-button @click="addCharacterAttribute(index)">添加属性</acgn-button>
          <acgn-button @click="reduceCharacterAttribute(index)">减少属性</acgn-button>
        </div>
      </div>
    </div>
    <div class="acgn-form-box" style="max-height: 300px">
      <div class="acgn-form-item">
        <label>好友可见</label>
        <el-radio-group v-model="acgnFormData.acgnToTomo">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
      <div class="acgn-form-item">
        <acgn-button @click="addCharacters">添加人物</acgn-button>
      </div>
      <div class="acgn-form-item">
        <acgn-button v-if="acgnEditData" @click="editAcgnContent">保存修改</acgn-button>
        <acgn-button v-else @click="addAcgnContent">确认新增</acgn-button>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/common/bus'
import { addAcgnContent, editAcgnContent, getAcgnCharacters } from '@/api/acgnContent'
import { ACGN } from '@/common/acgn'
import acgnRadar from '@/components/acgnRadar'
export default {
  components: {
    acgnRadar
  },
  props: {
    acgnEditData: {
      default: null
    }
  },
  data() {
    return {
      ACGN,
      requesHeaders: {},
      acgnFormData: {
        acgnTitle: '',
        acgnSubTitle: '',
        acgnType: ACGN.A,
        acgnMemoryImage: [],
        acgnScore: 10,
        acgnToTomo: 1,
        acgnAttribute: {
          indicator: [
            { name: '剧情', max: 100 },
            { name: '人物', max: 100 },
            { name: '作画', max: 100 },
            { name: '音乐', max: 100 },
            { name: '分镜', max: 100 },
            { name: 'CV', max: 100 }
          ],
          dataValue: [100, 100, 100, 100, 100, 100]
        },
        acgnComment: '',
        acgnCharacteristic: {
          animationSourse: [],
          volumes: []
        }
      },
      indicator: [
        { name: '剧情', max: 100 },
        { name: '人物', max: 100 },
        { name: '作画', max: 100 },
        { name: '音乐', max: 100 },
        { name: '分镜', max: 100 },
        { name: 'CV', max: 100 }
      ],
      dataValue: [89, 98, 50, 40, 75, 60],
      acgnCharacters: [],
      characterIndicator: [
        { name: '剧情', max: 100 },
        { name: '人物', max: 100 },
        { name: '作画', max: 100 },
        { name: 'CV', max: 100 }
      ],
      characterDataValue: [89, 98, 50, 40]
    }
  },
  watch: {
    'acgnFormData.acgnCharacteristic.animationSourse': {
      handler() {
        console.log('1111111')
        this.$forceUpdate()
      },
      deep: true
    },
    'acgnFormData.acgnCharacteristic.volumes': {
      handler() {
        this.$forceUpdate()
      },
      deep: true
    }
  },
  created() {
    if (this.acgnEditData) {
      this.acgnFormData = { ...this.acgnEditData }
      getAcgnCharacters({
        acgnId: this.acgnEditData.acgnId
      }).then((res) => {
        if (res.code == 200) {
          console.log(...res.data.acgnCharacters)
          this.acgnCharacters.push(...res.data.acgnCharacters)
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.msg)
        }
      })
    }
  },
  mounted() {
    this.requesHeaders.token = this.$localStorage.get('Token')
    this.userData = this.$localStorage.get('userData') || { acgnUid: null }
  },
  methods: {
    addAcgnContent() {
      console.log(this.acgnFormData)
      console.log(this.acgnCharacters)
      console.log(this.acgnFormData.acgnTitle)
      if (!this.acgnFormData.acgnTitle) {
        this.$message.warning('作品名字为必填，作品信息中只有评分和属性有默认值，其它为非必填')
      } else if (this.acgnCharacters.find((item) => !item.characterName)) {
        this.$message.warning('作品人物名字为必填，人物信息中只有属性有默认值，其它为非必填')
      } else {
        addAcgnContent({
          acgnContent: JSON.stringify(this.acgnFormData),
          acgnCharacters: JSON.stringify(this.acgnCharacters)
        })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.$emit('closeWindow')
              Bus.$emit('refreshList')
            } else {
              this.$message.warning(res.msg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
      // this.$refs.acgnContentImage.submit()
    },
    editAcgnContent() {
      if (!this.acgnFormData.acgnTitle) {
        this.$message.warning('作品名字为必填，作品信息中只有评分和属性有默认值，其它为非必填')
      } else if (this.acgnCharacters.find((item) => !item.characterName)) {
        this.$message.warning('作品人物名字为必填，人物信息中只有属性有默认值，其它为非必填')
      } else {
        editAcgnContent({
          acgnContent: JSON.stringify(this.acgnFormData),
          acgnCharacters: JSON.stringify(this.acgnCharacters)
        })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              Bus.$emit('refreshList')
            } else {
              this.$message.warning(res.msg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    openImageManage(index) {
      let imageList
      console.log(index)
      if (index === 'content') {
        imageList = this.acgnFormData.acgnMemoryImage
      } else {
        imageList = this.acgnCharacters[index].characterImage
      }
      Bus.$emit('openImageManage', imageList)
    },
    openSourseManage() {
      let sourseList
      sourseList = this.acgnFormData.acgnCharacteristic.animationSourse
      console.log(sourseList)
      Bus.$emit('openSourseManage', sourseList)
    },
    openVolumeManage() {
      let volumeList
      volumeList = this.acgnFormData.acgnCharacteristic.volumes
      console.log(volumeList)
      Bus.$emit('openVolumeManage', volumeList)
    },
    addAcgnAttribute() {
      this.acgnFormData.acgnAttribute.indicator.push({
        name: '属性名',
        max: 100
      })
      this.acgnFormData.acgnAttribute.dataValue.push(100)
    },
    reduceAcgnAttribute() {
      this.acgnFormData.acgnAttribute.indicator.pop()
      this.acgnFormData.acgnAttribute.dataValue.pop()
    },
    addCharacterAttribute(index) {
      this.acgnCharacters[index].characterAttribute.indicator.push({
        name: '属性名',
        max: 100
      })
      this.acgnCharacters[index].characterAttribute.dataValue.push(100)
    },
    reduceCharacterAttribute() {
      this.acgnCharacters[index].characterAttribute.indicator.pop()
      this.acgnCharacters[index].characterAttribute.dataValue.pop()
    },
    addCharacters() {
      this.acgnCharacters.push({
        characterName: '',
        characterComment: '',
        characterImage: [],
        characterAttribute: {
          indicator: [
            { name: '塑造', max: 100 },
            { name: '剧情', max: 100 },
            { name: '人设', max: 100 }
          ],
          dataValue: [90, 80, 70]
        },
        characterVoice: []
      })
    },
    deleteCharacter(characterIndex) {
      this.acgnCharacters.splice(characterIndex, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  width: 300px;
}
.acgn-handle {
  width: 100%;
  height: 100%;
  .upload-pic {
    &::v-deep {
      .el-upload-list__item {
        font-size: 0;
      }
    }
  }
}
.acgn-characters {
  position: relative;
  .delete-character {
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
    z-index: 3;
    &:hover {
      cursor: pointer;
      background-color: $acgnThemeBGColorHover;
      transform: rotate(180deg);
    }
  }
}
.acgn-form-item {
  .acgn-attribute {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 700px;
    .attributeList {
      width: 150px;
      height: 50px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex: 0 0 33%;
      input {
        margin-top: 0;
      }
    }
  }
  &::v-deep {
    .attribute-name,
    .attribute-value {
      width: 50px;
      display: inline;
    }
    .attribute-name {
      font-size: 15px;
    }
    .attribute-value {
      font-size: 15px;
    }
  }
  .acgn-characteristic {
    width: 80%;
    max-height: 400px;
    overflow: auto;
    overflow-x: visible;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .acgn-characteristic-item {
      position: relative;
      width: 80%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      border-bottom: 1px solid;
      &:nth-child(1) {
        color: #fff;
        font-weight: 600;
      }
      .acgn-characteristic-item-title {
        max-width: 70%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
.upload-mask {
  width: 100%;
  height: 100%;
  font-size: 30px;
  background-color: #000;
  color: #fff;
  opacity: 0.5;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .upload-status {
    display: inline-block;
  }
  .upload-progress {
    font-size: 15px;
  }
}
</style>