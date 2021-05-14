<template>
  <div class="acgnContent" ref="acgnContent">
    <acgn-loading :loadSuccess="getImage" :loadingText="'生成中'"></acgn-loading>
    <div class="acgn-content-header" v-if="acgnReadData.acgnMemoryImage.length > 0">
      <div class="acgn-slide">
        <div
          class="slide-item"
          :class="activeIndex === index ? 'slide-item-active' : 'slide-item-hidden'"
          :data-index="index"
          v-for="(item, index) in acgnReadData.acgnMemoryImage"
          :key="index"
        >
          <img :src="'http://192.168.43.82:9810/acgnrecord/image/' + item" />
        </div>
      </div>
      <div class="slide-switch" ref="slideSwitch" @mousewheel="scrollSlideSwich">
        <div
          class="slide-switch-item"
          :class="{ 'slide-switch-item-active': activeIndex === index }"
          v-for="(item, index) in acgnReadData.acgnMemoryImage"
          :key="index"
          @click="clickSlideSwichItem(index)"
        >
          <img class="slide-switch-image" :src="'http://192.168.43.82:9810/acgnrecord/image/' + item" />
        </div>
      </div>
      <div class="image-blur">
        <img :src="'http://192.168.43.82:9810/acgnrecord/image/' + acgnReadData.acgnMemoryImage[activeIndex]" />
      </div>
    </div>
    <div class="acgn-content-body">
      <h2>
        {{ acgnReadData.acgnTitle }}<span>{{ acgnReadData.acgnSubTitle }}</span>
        <span style="float: right">
          <label class="acgn-form-item-label">综合评价：{{ acgnReadData.acgnScore }}分</label>
          <el-rate v-model="acgnReadData.acgnScore" :max="10"></el-rate
        ></span>
      </h2>
      <div class="acgn-content-body-main">
        <div class="acgn-content-comment" v-if="acgnReadData.acgnComment">
          <h3>作品评析：</h3>
          <div class="acgn-content-comment-main">{{ acgnReadData.acgnComment }}</div>
        </div>
        <div class="acgn-content-attribute">
          <h3>各属性评价：</h3>
          <acgn-radar
            :width="500"
            :height="500"
            :indicator="acgnReadData.acgnAttribute.indicator"
            :dataValue="acgnReadData.acgnAttribute.dataValue"
          ></acgn-radar>
        </div>
      </div>
      <h2 style="font-size: 45px" v-if="acgnCharacters.length > 0">作品人物</h2>
      <div class="acgn-content-characters" ref="acgnContentCharacters" v-if="acgnCharacters.length > 0">
        <div class="characters-left"><span @click="charactersSlideLeft">←</span></div>
        <div class="characters-right"><span @click="charactersSlideRight">→</span></div>
        <div class="acgn-content-characters-slide">
          <div
            class="acgn-content-characters-item"
            :class="{
              'characters-item-active': activeCharacterIndex === characterIndex,
              'characters-item-left': activeCharacterIndex === characterIndex + 1,
              'characters-item-right': activeCharacterIndex === characterIndex - 1,
              'characters-item-hide':
                activeCharacterIndex !== characterIndex - 1 &&
                activeCharacterIndex === characterIndex + 1 &&
                activeCharacterIndex === characterIndex
            }"
            :style="character.style"
            v-for="(character, characterIndex) in acgnCharacters"
            :key="characterIndex"
          >
            <div class="acgn-slide" v-if="character.characterImage.length > 0">
              <div class="characters-content">
                <div class="characters-content-main">
                  <h3>{{ character.characterName }}</h3>
                  <div class="character-comment">
                    {{ character.characterComment }}
                  </div>
                </div>
                <div class="characters-content-attribute">
                  <h3>人物属性</h3>
                  <acgn-radar
                    :width="400"
                    :height="400"
                    :indicator="character.characterAttribute.indicator"
                    :dataValue="character.characterAttribute.dataValue"
                  ></acgn-radar>
                </div>
              </div>
              <div
                class="slide-item"
                :class="
                  charactersActiveImageIndex[characterIndex] === index ? 'slide-item-active' : 'slide-item-hidden'
                "
                :data-index="index"
                v-for="(item, index) in character.characterImage"
                :key="index"
              >
                <img :src="'http://192.168.43.82:9810/acgnrecord/image/' + item" />
              </div>
            </div>
            <div
              class="slide-switch"
              :ref="'slideSwitch' + characterIndex"
              @mousewheel="scrollSlideSwich($event, characterIndex)"
            >
              <div
                class="slide-switch-item"
                :class="{ 'slide-switch-item-active': charactersActiveImageIndex[characterIndex] === index }"
                v-for="(item, index) in character.characterImage"
                :key="index"
                @click="clickSlideSwichItem(index, characterIndex)"
              >
                <img class="slide-switch-image" :src="'http://192.168.43.82:9810/acgnrecord/image/' + item" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--作品特性信息 -->
      <acgn-content-characteristic
        v-if="
          acgnReadData.acgnCharacteristic.volumes.length > 0 ||
          acgnReadData.acgnCharacteristic.animationSourse.length > 0
        "
        :acgnReadData="acgnReadData"
      >
      </acgn-content-characteristic>
    </div>
    <div class="window-bottom">
      <acgn-button @click="getAcgnContentImage">生成图片</acgn-button>
    </div>
  </div>
</template>

<script>
import Bus from '@/common/bus'
import acgnRadar from '@/components/acgnRadar'
import acgnContentCharacteristic from '@/components/acgnContentCharacteristic'
import { getAcgnCharacters } from '@/api/acgnContent'
import { getTomoAcgnCharacters } from '@/api/tomo'
import html2canvas from 'html2canvas'
export default {
  props: {
    windowKey: {
      default: ''
    },
    windowType: {
      default: 'Animation'
    },
    acgnReadData: Object
  },
  components: {
    acgnRadar,
    acgnContentCharacteristic
  },
  data() {
    return {
      activeIndex: 0,
      activeCharacterIndex: 0,
      acgnCharacters: [],
      charactersActiveImageIndex: [],
      acgnContentImage: '',
      acgnCharacteristic: {},
      windowBottomShow: false,
      getImage: true
    }
  },
  watch: {},
  created() {
    if (this.windowKey) {
      getTomoAcgnCharacters({
        acgnUid: this.acgnReadData.acgnUid,
        acgnId: this.acgnReadData.acgnId
      })
        .then((res) => {
          if (res.code == 200) {
            this.apiDataHandle([...res.data.acgnCharacters])
            this.$message.success(res.msg)
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch(() => {
          this.$message.error('前端出bug啦')
        })
    } else {
      getAcgnCharacters({
        acgnId: this.acgnReadData.acgnId
      })
        .then((res) => {
          if (res.code == 200) {
            this.apiDataHandle([...res.data.acgnCharacters])
            this.$message.success(res.msg)
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch(() => {
          this.$message.error('前端出bug啦')
        })
    }
  },
  mounted() {
    console.log(this.acgnReadData)
  },
  methods: {
    apiDataHandle(data) {
      let acgnCharacters = data.map((item, index) => {
        return {
          ...item,
          style:
            index === 0
              ? { transform: 'translate3d(0,0,0) rotateY(0deg)' }
              : { transform: 'translate3d(100%,0,0) rotateY(-180deg)' }
        }
      })
      if (acgnCharacters.length === 2) {
        acgnCharacters.push({ ...acgnCharacters[0] })
      }
      this.acgnCharacters.push(...acgnCharacters)
      this.charactersActiveImageIndex = this.acgnCharacters.map(() => 0)
    },
    windowBottom() {
      this.windowBottomShow = !this.windowBottomShow
    },
    getAcgnContentImage() {
      let acgnContent = this.$refs.acgnContent
      this.getImage = false
      html2canvas(acgnContent, {
        imageTimeout: 0,
        useCORS: true,
        width: acgnContent.scrollWidth,
        height: acgnContent.scrollHeight,
        windowWidth: acgnContent.scrollWidth,
        windowHeight: acgnContent.scrollHeight,
        x: 0,
        y: acgnContent.pageYOffset
      }).then((canvas) => {
        let dataURL = canvas.toDataURL('image/png')
        Bus.$emit('openAcgnContentImageDialog', dataURL)
        this.acgnContentImage = dataURL
        this.getImage = true
      })
    },
    clickSlideSwichItem(itemIndex, characterIndex) {
      if (characterIndex !== undefined) {
        this.$set(this.charactersActiveImageIndex, characterIndex, itemIndex)
      } else {
        this.activeIndex = itemIndex
      }
    },
    scrollSlideSwich(event, characterIndex) {
      let scroll_width = 50 //滚动一下的距离
      let scrollEvent = event || window.event,
        v
      if (characterIndex !== undefined) {
        let slideSwitch = this.$refs['slideSwitch' + characterIndex]
        slideSwitch = slideSwitch[0] || slideSwitch
        scrollEvent.wheelDelta ? (v = scrollEvent.wheelDelta) : (v = scrollEvent.detail)
        if (v > 3 || -v > 3) v = -v
        v > 0 ? (slideSwitch.scrollLeft += scroll_width) : (slideSwitch.scrollLeft -= scroll_width)
        this.$forceUpdate()
        scrollEvent.preventDefault() //阻止浏览器的默认滚动
      } else {
        let slideSwitch = this.$refs.slideSwitch
        scrollEvent.wheelDelta ? (v = scrollEvent.wheelDelta) : (v = scrollEvent.detail)
        if (v > 3 || -v > 3) v = -v
        v > 0 ? (slideSwitch.scrollLeft += scroll_width) : (slideSwitch.scrollLeft -= scroll_width)

        scrollEvent.preventDefault() //阻止浏览器的默认滚动
      }
    },
    charactersSlideLeft() {
      this.acgnCharacters[this.activeCharacterIndex].style = { transform: 'translate3d(100%,0,0) rotateY(-180deg)' }
      if (this.activeCharacterIndex !== 0) {
        this.acgnCharacters[this.activeCharacterIndex - 1].style = { transform: 'translate3d(0,0,0) rotateY(0deg)' }
        this.acgnCharacters[
          this.activeCharacterIndex - 2 === -1 ? this.acgnCharacters.length - 1 : this.activeCharacterIndex - 2
        ].style = { transform: 'translate3d(-100%,0,0) rotateY(-180deg)' }
        this.activeCharacterIndex--
      } else {
        this.acgnCharacters[this.acgnCharacters.length - 1].style = {
          transform: 'translate3d(0,0,0) rotateY(0deg)'
        }
        this.acgnCharacters[this.acgnCharacters.length - 2].style = {
          transform: 'translate3d(-100%,0,0) rotateY(-90deg)'
        }
        this.activeCharacterIndex = this.acgnCharacters.length - 1
      }
    },
    charactersSlideRight() {
      this.acgnCharacters[this.activeCharacterIndex].style = { transform: 'translate3d(-100%,0,0) rotateY(-90deg)' }
      if (this.acgnCharacters.length === this.activeCharacterIndex + 1) {
        this.acgnCharacters[0].style = { transform: 'translate3d(0,0,0) rotateY(0deg)' }
        this.acgnCharacters[1].style = { transform: 'translate3d(100%,0,0) rotateY(-180deg)' }
        this.activeCharacterIndex = 0
      } else {
        this.acgnCharacters[this.activeCharacterIndex + 1].style = {
          transform: 'translate3d(0,0,0) rotateY(0deg)'
        }
        this.acgnCharacters[this.activeCharacterIndex + 2]
          ? (this.acgnCharacters[this.activeCharacterIndex + 2].style = {
              transform: 'translate3d(100%,0,0) rotateY(-180deg)'
            })
          : (this.acgnCharacters[0].style = { transform: 'translate3d(100%,0,0) rotateY(-180deg)' })
        this.activeCharacterIndex++
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnContent {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  justify-items: center;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: $bgColor;
  .acgn-content-header {
    width: 100%;
    height: 700px;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: auto;
    .image-blur {
      width: 100%;
      height: 700px;
      overflow: hidden;
      position: absolute;
      z-index: 0;
      img {
        max-width: 100%;
        min-height: 700px;
        filter: blur(10px);
      }
    }

    .acgn-slide {
      width: calc(100% - 6px);
      height: 600px;
      display: flex;
      justify-content: center;
      align-items: center;
      .slide-item {
        position: absolute;
        transition: 0.5s ease;
        z-index: 2;
        img {
          border: 4px solid #ffffffc5;
          box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);
          border-radius: 3px;
          max-width: calc(100% - 3px);
          max-height: 590px;
        }
      }
      .slide-item-active {
        opacity: 1;
      }
      .slide-item-hidden {
        opacity: 0;
      }
    }

    .slide-switch {
      height: 100px;
      max-width: 100%;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      overflow-x: auto;
      z-index: 2;
      .slide-switch-item {
        border: 2px solid rgba(255, 255, 255, 0.5);
        display: flex;
        align-items: center;
        transition: 0.2s ease;
        &:hover {
          cursor: pointer;
          border-color: #ffffff;
        }
        .slide-switch-image {
          height: 56px;
          transition: 0.2s ease;
        }
      }
      .slide-switch-item-active {
        border: 2px solid $acgnThemeColor;
        .slide-switch-image {
          height: 80px;
        }
      }
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
      }
    }
  }
  .acgn-content-body {
    width: calc(100% - 100px);
    display: flex;
    padding: 0 50px;
    justify-items: center;
    flex-direction: column;
    h2 {
      font-size: 60px;
      text-align: left;
      padding: 10px;
      margin: 0;
      border-bottom: 3px solid #d5d1cf;
      span {
        font-size: 30px;
        margin-left: 10px;
      }
    }
    .acgn-content-body-main {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      h3 {
        text-align: left;
      }
      .acgn-content-comment {
        width: 500px;
        height: 600px;
        .acgn-content-comment-main {
          width: calc(100% - 20px);
          height: 450px;
          padding: 10px;
          overflow: auto;
          border: 2px solid #d5d1cf;
          &::-webkit-scrollbar {
            display: none; /* Chrome Safari */
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE 10+ */
          }
        }
      }
      .acgn-content-attribute {
        width: 500px;
        height: 600px;
      }
    }
    .acgn-content-characters {
      overflow: hidden;
      position: relative;
      // overflow: auto;
      width: calc(100% + 100px);
      left: -50px;
      margin-top: 20px;
      .characters-left,
      .characters-right {
        position: absolute;
        width: 100px;
        height: 600px;
        display: flex;
        align-items: center;
        font-size: 60px;
        z-index: 3;
        transition: 0.5s ease;
        opacity: 0;
        span {
          width: 100px;
          height: 100px;
          line-height: 90px;
          border-radius: 50%;
          background-color: $bgColor;
          transition: 0.5s ease;
          cursor: pointer;
          &:hover {
            transform: scale(1.05);
            color: $bgColor;
            background-color: #ffffff9f;
          }
        }
        &:hover {
          opacity: 1;
        }
      }
      .characters-left {
        left: 20px;
      }
      .characters-right {
        right: 20px;
      }
      h3 {
        font-size: 40px;
        text-align: left;
      }
      .acgn-content-characters-slide {
        position: relative;
        // transition: 0.5s ease-out;
        height: 700px;
        .acgn-content-characters-item {
          transition: 0.5s ease-in-out;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 700px;
          position: absolute;
          .characters-content {
            width: 0%;
            height: 500px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            overflow: hidden;
            background-color: $bgColor;
            transition: 0.5s ease-in-out;
            z-index: 3;
            .characters-content-main {
              width: 450px;
              height: 450px;
              .character-comment {
                width: 400px;
                height: 400px;
                overflow: auto;
                &::-webkit-scrollbar {
                  display: none; /* Chrome Safari */
                  scrollbar-width: none; /* Firefox */
                  -ms-overflow-style: none; /* IE 10+ */
                }
              }
            }
            .characters-content-attribute {
              width: 450px;
              height: 450px;
            }
          }
          .acgn-slide {
            width: 100%;
            height: 600px;
            display: flex;
            justify-content: center;
            align-items: center;
            &:hover {
              .characters-content {
                width: 100%;
              }
            }
            .slide-item {
              position: absolute;
              transition: 0.5s ease;
              z-index: 2;
              img {
                border: 4px solid #ffffffc5;
                border-radius: 3px;
                max-width: calc(100% - 3px);
                max-height: 590px;
              }
            }
            .slide-item-active {
              opacity: 1;
            }
            .slide-item-hidden {
              opacity: 0;
            }
          }

          .slide-switch {
            height: 100px;
            max-width: 800px;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            overflow-x: auto;
            z-index: 2;
            .slide-switch-item {
              border: 2px solid rgba(255, 255, 255, 0.5);
              display: flex;
              align-items: center;
              transition: 0.2s ease;
              &:hover {
                cursor: pointer;
                border-color: #ffffff;
              }
              .slide-switch-image {
                height: 56px;
                transition: 0.2s ease;
              }
            }
            .slide-switch-item-active {
              border: 2px solid $acgnThemeColor;
              .slide-switch-image {
                height: 80px;
              }
            }
            &::-webkit-scrollbar {
              display: none; /* Chrome Safari */
              scrollbar-width: none; /* Firefox */
              -ms-overflow-style: none; /* IE 10+ */
            }
          }
        }
        .characters-item-active {
        }
        .characters-item-left {
        }
        .characters-item-right {
        }
        .characters-item-hide {
          display: none;
        }
      }
    }
  }
  .window-bottom {
    position: fixed;
    max-width: 200px;
    height: 50px;
    top: 40px;
    right: 0;
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
    .acgn-button {
      margin-top: 0;
    }
  }
}
</style>