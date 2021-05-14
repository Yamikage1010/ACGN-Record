<template>
  <div class="acgnContentAudio">
    <div class="title">{{ musicData.title }}</div>
    <div class="play-or-pause" @click="musicSS">
      <div class="pause-icon" v-if="musicPlay"></div>
      <div class="play-icon" v-else></div>
    </div>
    <img v-if="musicData.image" :src="'http://192.168.43.82:9810/acgnrecord/image/' + musicData.image" />
    <img v-else :src="'http://192.168.43.82:9810/acgnrecord/defaultImage/noImage.jpg'" />
    <audio ref="audioDom" :src="'http://192.168.43.82:9810/acgnrecord/music/' + musicData.music">
      您的浏览器不支持该音乐播放组件。
    </audio>
  </div>
</template>

<script>
export default {
  props: {
    musicData: Object
  },
  mounted() {
    this.$nextTick(() => {
      this.audioPlayer = this.$refs.audioDom
      this.audioPlayer.addEventListener('timeupdate', (event) => {
        // console.log(event)
        // console.log(this.audioPlayer.currentTime)
        // console.log(this.currentTime)
      })
      console.log(this.audioPlayer.duration)
    })
  },
  data() {
    return {
      duration: 0,
      audioPlayer: '',
      currentTime: 0,
      musicPlay: false
    }
  },
  methods: {
    musicSS() {
      if (this.musicPlay) {
        this.musicStop()
      } else {
        this.musicStart()
      }
    },
    musicStart() {
      this.audioPlayer.play()
      this.musicPlay = true
      console.log(this.audioPlayer.duration)
      console.log(this.audioPlayer.currentTime)
    },
    musicStop() {
      this.audioPlayer.pause()
      this.musicPlay = false
      console.log(this.audioPlayer.duration)
      console.log(this.audioPlayer.currentTime)
    },
    musicJump() {
      this.audioPlayer.currentTime = 30
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnContentAudio {
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  &:hover {
    .play-or-pause {
      opacity: 1;
      transform: perspective(800px) rotateY(0);
    }
    .title {
      top: -50px;
      background-color: $bgColor;
      color: $fontColor;
      transform: perspective(800px) rotateY(0);
    }
    img {
      transform: perspective(800px) rotateY(0);
    }
  }
  .title {
    width: 100%;
    height: 50px;
    top: 30%;
    background-color: $fontColor;
    color: $bgColor;
    font-size: 22px;
    line-height: 50px;
    position: absolute;
    transition: 0.3s;
    transform-origin: center;
    transform: perspective(800px) rotateY(20deg);
    z-index: 3;
  }
  .play-or-pause {
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 0;
    width: 400px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    transition: 0.3s;
    transform-origin: center;
    transform: perspective(800px) rotateY(20deg);
    z-index: 1;
    cursor: pointer;
    .play-icon {
      width: 100px;
      height: 100px;
      position: absolute;
      background-color: $bgColor;
      -webkit-clip-path: polygon(0% 0%, 0% 100%, 100% 50%);
      clip-path: polygon(0% 0%, 0% 100%, 100% 50%);
      z-index: 2;
    }
    .pause-icon {
      width: 100px;
      height: 100px;
      position: absolute;
      background-color: $bgColor;
      -webkit-clip-path: polygon(40% 100%, 60% 100%, 60% 0%, 85% 0%, 85% 100%, 15% 100%, 15% 0%, 40% 0%);
      clip-path: polygon(40% 100%, 60% 100%, 60% 0%, 85% 0%, 85% 100%, 15% 100%, 15% 0%, 40% 0%);
      z-index: 2;
    }
  }

  img {
    max-width: 400px;
    max-height: 400px;
    transform-origin: center;
    transform: perspective(800px) rotateY(20deg);
    transition: 0.3s;
    -webkit-box-reflect: below 1px linear-gradient(transparent, transparent, #0004);
  }
}
</style>