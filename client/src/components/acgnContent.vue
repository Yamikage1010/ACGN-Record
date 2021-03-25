<template>
  <div class="acgnContent">
    {{ windowType }} <a href="https://bangumi.tv/subject_search/clannad?cat=all" target="_blank"> 跳转至bangumi搜索 </a>
  </div>
</template>

<script>
export default {
  props: {
    windowType: {
      default: 'Animetion'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>