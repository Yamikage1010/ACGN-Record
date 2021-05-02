<template>
  <div class="acgnContentCharacteristic">
    <h2 v-if="acgnReadData.acgnType === 'Comic' || acgnReadData.acgnType === 'Novel'">分卷记录</h2>
    <h2 v-if="acgnReadData.acgnType === 'Animation'">资源记录</h2>
    <div
      class="acgn-characteristic-volumes"
      v-if="acgnReadData.acgnType === 'Comic' || acgnReadData.acgnType === 'Novel'"
    >
      <div class="volumes-left">
        <div
          class="volumes-left-item"
          :class="{ 'volumes-left-item-active': index === activeVolumeIndex }"
          v-for="(volume, index) in acgnReadData.acgnCharacteristic.volumes"
          :key="index"
          @click="clickVolumesItem(index)"
        >
          <span>{{ volume.title }}</span>
        </div>
      </div>
      <div class="volumes-middle">
        <template v-for="(volume, index) in acgnReadData.acgnCharacteristic.volumes">
          <img
            v-if="volume.cover"
            :style="{
              opacity: index === activeVolumeIndex ? 1 : 0,
              transform: index === activeVolumeIndex ? 'translate(0,0)' : volumesRightTranslate
            }"
            :src="'http://localhost:9810/acgnrecord/image/' + volume.cover"
            :key="index"
          />
          <img
            v-else
            :style="{ opacity: index === activeVolumeIndex ? 1 : 0 }"
            :src="'http://localhost:9810/acgnrecord/defaultImage/noImage.jpg'"
            :key="index"
          />
        </template>
      </div>
      <div class="volumes-right">
        <div
          class="volumes-right-item"
          :style="{
            opacity: index === activeVolumeIndex ? 1 : 0,
            transform: index === activeVolumeIndex ? 'translate(0,0)' : volumesRightTranslate
          }"
          v-for="(volume, index) in acgnReadData.acgnCharacteristic.volumes"
          :key="index"
        >
          <h3>{{ volume.title }}</h3>
          <span>{{ volume.content }}</span>
        </div>
      </div>
    </div>
    <div
      class="animation-characteristic"
      ref="animationCharacteristic"
      v-if="acgnReadData.acgnType === 'Animation'"
      @mousewheel="scrollSlideSwich"
    >
      <div
        class="op-ed"
        v-for="(sourse, index) in acgnReadData.acgnCharacteristic.animationSourse"
        :key="index"
        :style="{
          transform:
            'translateX(' +
            (translateIndex * 10 + index * 100) +
            '%) scale(' +
            (1 - translateIndex / 60 - index / 6) +
            ')'
        }"
      >
        <acgn-content-audio v-if="sourse.fileType === 'music'" :musicData="sourse"></acgn-content-audio>
        <acgn-content-video v-if="sourse.fileType === 'video'" :videoData="sourse"></acgn-content-video>
      </div>
    </div>
  </div>
</template>

<script>
import acgnContentAudio from '@/components/acgnContentAudio'
import acgnContentVideo from '@/components/acgnContentVideo'
export default {
  props: {
    acgnReadData: Object
  },
  components: {
    acgnContentAudio,
    acgnContentVideo
  },
  watch: {
    activeVolumeIndex() {
      this.volumesRightTranslate =
        Math.random() * 10 < 5
          ? 'translate(' + Math.ceil(Math.random() * 100) + 'px,' + Math.ceil(Math.random() * 100) + 'px)'
          : 'translate(-' + Math.ceil(Math.random() * 100) + 'px,-' + Math.ceil(Math.random() * 100) + 'px)'
    }
  },
  mounted() {},
  data() {
    return {
      activeVolumeIndex: 0,
      volumesRightTranslate: 'translate(80px,0)',
      translateIndex: 0
    }
  },
  methods: {
    clickVolumesItem(itemIndex) {
      this.activeVolumeIndex = itemIndex
    },

    scrollSlideSwich(event) {
      let scrollEvent = event || window.event,
        v
      scrollEvent.wheelDelta ? (v = scrollEvent.wheelDelta) : (v = scrollEvent.detail)
      if (v > 3 || -v > 3) v = -v
      v > 0 ? this.translateIndex-- : this.translateIndex++
      console.log(this.translateIndex)
      scrollEvent.preventDefault() //阻止浏览器的默认滚动
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnContentCharacteristic {
  h2 {
    font-size: 45px;
    text-align: left;
    padding: 10px;
    margin: 0;
    border-bottom: 3px solid #d5d1cf;
    span {
      font-size: 30px;
      margin-left: 10px;
    }
  }
  .acgn-characteristic-volumes {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    overflow: hidden;
    margin-top: 20px;
    margin-bottom: 50px;
    .volumes-left {
      width: 30%;
      height: 600px;
      overflow-x: visible;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
      }
      .volumes-left-item {
        position: relative;
        width: 80%;
        height: 70px;
        margin-left: 10px;
        box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7);
        -webkit-clip-path: polygon(0% 14%, 100% 2%, 77% 100%, 0% 100%);
        clip-path: polygon(0% 14%, 100% 2%, 77% 100%, 0% 100%);
        background-color: $bgColor;
        color: #fff;
        text-align: left;
        padding-left: 20px;
        line-height: 70px;
        font-size: 20px;
        transition: 0.2s ease-in-out;
        &:hover {
          cursor: pointer;
          transform: scale(1.1);
          color: $bgColor;
          background-color: $fontColor;
        }
      }
      .volumes-left-item-active {
        color: $bgColor;
        background-color: $fontColor;
        &:hover {
          cursor: default;
          transform: scale(1);
        }
      }
    }
    .volumes-middle {
      width: 330px;
      height: 600px;
      overflow: hidden;
      display: flex;
      align-items: center;
      img {
        position: absolute;
        border: 4px solid #fff;
        border-radius: 4px;
        max-width: 310px;
        max-height: 500px;
        margin-right: 30px;
        transition: 0.3s ease-in;
      }
    }
    .volumes-right {
      width: 30%;
      height: 600px;
      overflow: hidden;
      background-color: $bgColor;
      border: 4px solid #fff;
      border-radius: 4px;
      box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7);
      .volumes-right-item {
        max-width: 400px;
        height: 580px;
        position: absolute;
        padding: 10px;
        overflow: auto;
        transition: 0.3s ease-in;
      }
    }
  }
  .animation-characteristic {
    position: relative;
    // display: flex;
    // justify-content: space-around;
    // align-items: center;
    width: 100%;
    height: 600px;
    overflow: hidden;
    margin-top: 20px;
    margin-bottom: 50px;
    display: flex;
    justify-content: left;
    align-items: center;
    .op-ed {
      width: 500px;
      height: 500px;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>