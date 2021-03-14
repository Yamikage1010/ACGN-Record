<template>
  <div class="acgn-button" :style="{ width: width + 'px', fontSize: fontSize + 'px' }" @click="click">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      default: 100
    },
    fontSize: {
      default: 15
    }
  },
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.acgn-button {
  background-color: $acgnThemeBGColor;
  outline: none;
  border: none;
  padding: 5px 10px 5px 10px;
  color: #fff;
  margin-top: 30px;
  border-radius: 5px;
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: $acgnThemeBGColorHover;
    transform: scale(1.03);
    cursor: pointer;
  }
}
</style>