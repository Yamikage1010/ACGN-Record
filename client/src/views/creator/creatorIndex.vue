<template>
  <div>
    <float-ball :title="'add'" :subTitle="'新增作品'" :top="300" :left="300"> </float-ball>
    <float-ball :title="'manage'" :subTitle="'管理作品'" :top="300" :left="1200"> </float-ball>
  </div>
</template>

<script>
import floatBall from '@/components/floatBall';
export default {
  components: {
    floatBall
  }
};
</script>

<style lang="scss" scoped></style>
