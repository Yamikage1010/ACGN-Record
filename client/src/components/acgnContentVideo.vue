<template>
  <div class="acgnContentVideo">
    <div
      class="title"
      :style="{ top: videoPlay ? '-50px' : '30%', transform: videoPlay ? '' : 'perspective(800px) rotateY(20deg)' }"
    >
      {{ videoData.title }}
    </div>
    <!-- <div class="play-or-pause" @click="videoSS">
      <div class="pause-icon" v-if="videoPlay"></div>
      <div class="play-icon" v-else></div>
    </div> -->
    <video
      ref="videoDom"
      :style="{ transform: videoPlay ? '' : 'perspective(800px) rotateY(20deg)' }"
      :src="'http://localhost:9810/acgnrecord/video/' + videoData.video"
      controls
      controlslist="nodownload noremoteplayback"
      disablePictureInPicture
    >
      您的浏览器不支持该视频播放组件。
    </video>
  </div>
</template>

<script>
export default {
  props: {
    videoData: Object
  },
  mounted() {
    this.$nextTick(() => {
      this.videoPlayer = this.$refs.videoDom
      this.videoPlayer.addEventListener('play', (event) => {
        // console.log(event)
        // console.log(this.videoPlayer.currentTime)
        // console.log(this.currentTime)
        this.videoPlay = true
      })
      this.videoPlayer.addEventListener('pause', (event) => {
        // console.log(event)
        // console.log(this.videoPlayer.currentTime)
        // console.log(this.currentTime)
        this.videoPlay = false
      })
      console.log(this.videoPlayer.duration)
    })
  },
  data() {
    return {
      duration: 0,
      videoPlayer: '',
      currentTime: 0,
      videoPlay: false
    }
  },
  methods: {
    videoSS() {
      if (this.videoPlay) {
        this.videoStop()
      } else {
        this.videoStart()
      }
    },
    videoStart() {
      this.videoPlayer.play()
      this.videoPlay = true
      console.log(this.videoPlayer.duration)
      console.log(this.videoPlayer.currentTime)
    },
    videoStop() {
      this.videoPlayer.pause()
      this.videoPlay = false
      console.log(this.videoPlayer.duration)
      console.log(this.videoPlayer.currentTime)
    },
    videoJump() {
      this.videoPlayer.currentTime = 30
    }
  }
}
</script>

<style lang="scss" scoped>
.acgnContentVideo {
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  video {
    width: 400px;
    transform-origin: center;
    transition: 0.3s;
    -webkit-box-reflect: below 1px linear-gradient(transparent, transparent, #0004);
  }
  &:hover {
    .play-or-pause {
      opacity: 1;
      transform: perspective(800px) rotateY(0);
    }
    .title {
      background-color: $bgColor;
      color: $fontColor;
    }
    img {
      transform: perspective(800px) rotateY(0);
    }
  }
  .title {
    width: 100%;
    height: 50px;
    background-color: $fontColor;
    color: $bgColor;
    font-size: 22px;
    line-height: 50px;
    position: absolute;
    transition: 0.3s;
    transform-origin: center;
    z-index: 3;
  }
}
</style>