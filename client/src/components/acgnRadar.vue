<template>
  <div ref="acgnRadar" :style="{ width: width + 'px', height: height + 'px' }"></div>
</template>

<script>
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([TitleComponent, TooltipComponent, GridComponent, RadarChart, CanvasRenderer])
export default {
  props: {
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    },
    indicator: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataValue: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    dataValue: {
      handler(newVal, oldVal) {
        if (oldVal.length > 0) {
          this.radarOption.radar.indicator = this.indicator
          this.radarOption.series[0].data = [{ value: this.dataValue }]
          this.acgnRadar.setOption(this.radarOption)
        }
      },
      deep: true
    },
    indicator: {
      handler(newVal, oldVal) {
        if (oldVal.length > 0) {
          this.radarOption.radar.indicator = this.indicator
          this.radarOption.series[0].data = [{ value: this.dataValue }]
          this.acgnRadar.setOption(this.radarOption)
        }
      },
      deep: true
    }
  },
  data() {
    return {
      acgnRadar: '',
      radarOption: {
        tooltip: {},
        // legend: {
        //   data: ['战斗力数值 ~ ！！！']
        // },
        radar: {
          // shape: 'circle',
          axisName: {},
          indicator: []
        },
        series: [
          {
            name: '战斗力数值 ~ ！！！',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: []
          }
        ]
      }
    }
  },
  methods: {
    drawAcgnRadar() {
      this.acgnRadar = echarts.init(this.$refs.acgnRadar)
      this.acgnRadar.setOption(this.radarOption)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.radarOption.radar.indicator = this.indicator
      this.radarOption.series[0].data = [{ value: this.dataValue }]
      this.drawAcgnRadar()
    })
  }
}
</script>

<style lang="scss" scoped>
</style>