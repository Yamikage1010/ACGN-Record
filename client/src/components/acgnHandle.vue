<template>
  <div class="acgn-handle">{{ acgnContent.acgnType }}</div>
</template>

<script>
import { ACGN } from '@/common/acgn'
export default {
  props: {
    acgnContent: {
      default: () => {
        return {
          acgnType: ACGN.A
        }
      }
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
</style>