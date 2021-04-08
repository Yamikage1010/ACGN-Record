<template>
  <button
    class="acgn-button"
    :class="{ 'acgn-button-danger': buttonType === 'danger' }"
    :style="{ width: width + 'px', fontSize: fontSize + 'px', cursor: disabled ? 'wait' : 'pointer' }"
    @click="click"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    width: {
      default: 100
    },
    fontSize: {
      default: 15
    },
    disabled: {
      default: false
    },
    buttonType: {
      default: 'normal'
    },
    noStop: {
      default: false
    }
  },
  methods: {
    click(event) {
      this.$emit('click')
      if (!this.noStop) {
        event.stopPropagation()
      }
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
.acgn-button-danger {
  background-color: #ff4c4c;
  &:hover {
    background-color: #ff0000;
  }
}
</style>