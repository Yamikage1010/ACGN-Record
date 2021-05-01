<template>
  <div class="acgnContentCharacteristic">
    <h2 v-if="acgnReadData.acgnType === 'Comic' || acgnReadData.acgnType === 'Novel'">分卷信息</h2>
    <div class="acgn-characteristic-volumes">
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
  </div>
</template>

<script>
export default {
  props: {
    acgnReadData: Object
  },
  watch: {
    activeVolumeIndex() {
      this.volumesRightTranslate =
        Math.random() * 10 < 5
          ? 'translate(' + Math.ceil(Math.random() * 100) + 'px,' + Math.ceil(Math.random() * 100) + 'px)'
          : 'translate(-' + Math.ceil(Math.random() * 100) + 'px,-' + Math.ceil(Math.random() * 100) + 'px)'
    }
  },
  data() {
    return {
      activeVolumeIndex: 0,
      volumesRightTranslate: 'translate(80px,0)'
    }
  },
  methods: {
    clickVolumesItem(itemIndex) {
      this.activeVolumeIndex = itemIndex
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnContentCharacteristic {
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
}
</style>