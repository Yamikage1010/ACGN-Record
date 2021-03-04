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

    <!-- <float-ball :title="'Anime'" :subTitle="'动画'" :top="100" :left="300"> </float-ball>
    <float-ball :title="'Comic'" :subTitle="'漫画'" :top="100" :left="1200"> </float-ball>
    <float-ball :title="'Game'" :subTitle="'游戏'" :top="600" :left="300"> </float-ball>
    <float-ball :title="'Novel'" :subTitle="'小说'" :top="600" :left="1200"> </float-ball> -->
  </div>
</template>

<script>
import floatBall from '@/components/floatBall';
export default {
  components: {
    floatBall
  },
  data() {
    return {
      ballData: [
        {
          ballKey: 'Anime',
          title: 'Anime',
          subTitle: '动画',
          top: 100,
          left: 300
        },
        {
          ballKey: 'Comic',
          title: 'Comic',
          subTitle: '漫画',
          top: 100,
          left: 1200
        },
        {
          ballKey: 'Game',
          title: 'Game',
          subTitle: '游戏',
          top: 600,
          left: 300
        },
        {
          ballKey: 'Novel',
          title: 'Novel',
          subTitle: '小说',
          top: 600,
          left: 1200
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
