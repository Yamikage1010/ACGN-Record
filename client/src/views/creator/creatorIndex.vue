<template>
  <div>
    <float-ball
      v-for="item in ballData"
      :key="item.ballKey"
      :ballKey="item.ballKey"
      :title="item.title"
      :subTitle="item.subTitle"
      :top="item.top"
      :left="item.left"
    ></float-ball>
    <!-- <float-ball :title="'add'" :subTitle="'新增作品'" :top="300" :left="300"> </float-ball>
    <float-ball :title="'manage'" :subTitle="'管理作品'" :top="300" :left="1200"> </float-ball> -->
  </div>
</template>

<script>
import floatBall from '@/components/floatBall'
export default {
  components: {
    floatBall
  },
  data() {
    return {
      ballData: [
        {
          ballKey: 'add',
          title: 'add',
          subTitle: '新增作品',
          top: 300,
          left: 300
        },
        {
          ballKey: 'manage',
          title: 'manage',
          subTitle: '管理作品',
          top: 300,
          left: 1200
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
