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
            <img :src="'http://localhost:9810/acgnrecord/image/' + item" width="200px" />
          </el-carousel-item>
        </el-carousel>
        <img
          style="width: 300px"
          v-else-if="acgnFormData.acgnMemoryImage.length === 1"
          :src="'http://localhost:9810/acgnrecord/image/' + acgnFormData.acgnMemoryImage[0]"
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
            <input
              class="attribute-value"
              @change="AcgnAttributeChange"
              v-model="acgnFormData.acgnAttribute.dataValue[index]"
            />
          </div>
        </div>
        <acgn-button @click="addAcgnAttribute">添加属性</acgn-button>
      </div>
    </div>
    <div class="acgn-characters" v-for="(character, index) in acgnCharacters" :key="index">
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
              <img style="width: 300px" :src="'http://localhost:9810/acgnrecord/image/' + item" width="200px" />
            </el-carousel-item>
          </el-carousel>
          <img
            v-else-if="character.characterImage.length === 1"
            :src="'http://localhost:9810/acgnrecord/image/' + character.characterImage[0]"
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
        </div>
      </div>
    </div>
    <div class="acgn-form-box" style="max-height: 200px">
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
        acgnCharacteristic: []
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
      addAcgnContent({
        acgnContent: JSON.stringify(this.acgnFormData),
        acgnCharacters: JSON.stringify(this.acgnCharacters)
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.$emit('closeWindow')
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      // this.$refs.acgnContentImage.submit()
    },
    editAcgnContent() {
      editAcgnContent({
        acgnContent: JSON.stringify(this.acgnFormData),
        acgnCharacters: JSON.stringify(this.acgnCharacters)
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    openImageManage(index) {
      let imageList
      console.log(index)
      if (index === 'content') {
        imageList = this.acgnFormData.acgnMemoryImage
      } else {
        imageList = this.acgnCharacters[index].characterImage
      }
      console.log(imageList)
      Bus.$emit('openImageManage', imageList)
    },
    addAcgnAttribute() {
      this.acgnFormData.acgnAttribute.indicator.push({
        name: '属性名',
        max: 100
      })
      this.acgnFormData.acgnAttribute.dataValue.push(100)
    },
    addCharacterAttribute(index) {
      this.acgnCharacters[index].characterAttribute.indicator.push({
        name: '属性名',
        max: 100
      })
      this.acgnCharacters[index].characterAttribute.dataValue.push(100)
    },
    AcgnAttributeChange() {},
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