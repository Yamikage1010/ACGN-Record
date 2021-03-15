<template>
  <span style="opacity: 0">{{ charSpace }} </span>
</template>

<script>
export default {
  props: {
    spaceNum: {
      type: Number,
      default: 1
    }
  },
  watch: {
    spaceNum(newValue) {
      for (let i = 0; i < newValue - 1; i++) {
        this.charSpace += '—'
      }
    }
  },
  data() {
    return {
      charSpace: '—'
    }
  }
}
</script>
