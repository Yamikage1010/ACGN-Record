<template>
  <div class="acgn-handle">
    <div class="acgn-form">
      <label class="acgn-form-label">作品类型</label>
      <select>
        <option :value="ACGN.A">{{ ACGN.A }}</option>
        <option :value="ACGN.C">{{ ACGN.C }}</option>
        <option :value="ACGN.G">{{ ACGN.G }}</option>
        <option :value="ACGN.N">{{ ACGN.N }}</option>
      </select>
    </div>
    <div class="acgn-form">
      <label class="acgn-form-label">标题</label>
      <input v-model="acgnFormData.acgnTitle" />
    </div>
    <div class="acgn-form">
      <label class="acgn-form-label">副标题</label>
      <input v-model="acgnFormData.acgnSubTitle" />
    </div>
    <div class="acgn-form">
      <label class="acgn-form-label">上传封面图</label>
      <el-upload
        class="upload-pic"
        action="http://localhost:9810/acgnrecord/picUpload"
        ref="acgnContentImage"
        multiple
        :auto-upload="true"
        :headers="requesHeaders"
        list-type="picture-card"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :on-progress="uploadProgress"
      >
        <div slot="file" slot-scope="{ file }">
          <div class="upload-mask">
            <!-- <div class="upload-status">{{ fileStatus(file) }}</div>
            <div class="upload-progress">{{ fileProgress(file) }}</div> -->
          </div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <!-- <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">查看 </span>
          </span> -->
        </div>
      </el-upload>
    </div>
    <div class="acgn-form">
      <label class="acgn-form-label">评分</label>
      <el-rate v-model="acgnFormData.acgnScore" :max="10"></el-rate>
    </div>
    <div class="acgn-form">
      <label class="acgn-form-label">属性评级</label>
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
    <div class="acgn-form">
      <label class="acgn-form-label">作品评析</label>
      <input v-model="acgnFormData.acgnComment" />
    </div>
    <div class="acgn-characters" v-for="(character, index) in acgnCharacters" :key="index">
      <div class="acgn-form">
        <label class="acgn-form-label">人物名字</label>
        <input v-model="character.characterName" />
      </div>
      <div class="acgn-form">
        <label class="acgn-form-label">人物评析</label>
        <input v-model="character.characterComment" />
      </div>
      <div class="acgn-form">
        <label class="acgn-form-label">人物评级</label>
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

      <div class="acgn-form">
        <label class="acgn-form-label">上传人物图</label>
        <el-upload
          class="upload-pic"
          action="http://localhost:9810/acgnrecord/picUpload"
          ref="acgnContentImage"
          :data="{ characterIndex: index }"
          multiple
          :auto-upload="true"
          :headers="requesHeaders"
          list-type="picture-card"
          :before-upload="beforeUpload"
          :on-success="uploadCharacterSuccess"
          :on-progress="uploadProgress"
        >
          <div slot="file" slot-scope="{ file }">
            <div class="upload-mask">
              <!-- <div class="upload-status">{{ fileStatus(file) }}</div>
            <div class="upload-progress">{{ fileProgress(file) }}</div> -->
            </div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <!-- <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">查看 </span>
          </span> -->
          </div>
        </el-upload>
      </div>
    </div>
    <acgn-button @click="addCharacters">添加人物</acgn-button>
    <div class="acgn-form">
      <acgn-button @click="addAcgnContent">确认新增</acgn-button>
    </div>
  </div>
</template>

<script>
import { addAcgnContent, getAcgnCharacters } from '@/api/acgnContent'
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
        acgnMusic: []
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
    this.userData = this.$localStorage.get('userData') || { uid: null }
  },
  computed: {
    fileStatus() {
      return function (file) {
        return this.fileList.find((item) => item.file.name === file.name).status
      }
    },
    fileProgress() {
      return function (file) {
        return this.fileList.find((item) => item.file.name === file.name).loaded + '/' + file.size
      }
    },
    uploadStatus() {
      return this.fileList.find((item) => item.status === 'uploading') ? true : false
    }
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
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      // this.$refs.acgnContentImage.submit()
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
    },
    uploadSuccess(response, file) {
      let exName = this.userData.uid + '_' + file.name
      this.acgnFormData.acgnMemoryImage.push(exName)
    },
    uploadCharacterSuccess(response, file, fileList) {
      console.log(response)
      let characterIndex = response.data.index
      let exName = this.userData.uid + '_' + file.name
      this.acgnCharacters[characterIndex].characterImage.push(exName)
    },
    uploadMusicSuccess(response, file) {
      // console.log(file)
    },
    uploadProgress(event, file) {
      console.log(file)
    },
    beforeUpload(file) {
      console.log(file)
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
.acgn-form {
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