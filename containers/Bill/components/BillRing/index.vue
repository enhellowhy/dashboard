<template>
  <base-chart chartType="ve-ring" :chartData="chartData" :chartConfig="chartConfig" :chartSettings="chartSettings" :loading="loading" />
</template>

<script>
import { numerify } from '@/filters'

export default {
  name: 'PieBase',
  props: {
    seriesArr: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    subtext: {
      type: [String, Number],
    },
    currencySign: {
      type: String,
      default: '￥',
    },
  },
  data () {
    return {
      chartSettings: {
        // radius: ['40%', '60%'],
        offsetY: '55%',
        radius: ['55%', '80%'],
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
      },
    }
  },
  computed: {
    chartData () {
      const chartData = {
        columns: [],
        rows: [],
      }
      if (this.seriesArr.length) {
        chartData.columns = Object.keys(this.seriesArr[0])
        chartData.rows = this.seriesArr
      }
      return chartData
    },
    chartConfig () {
      const config = {
        height: '100%',
        width: '100%',
        legend: {
          show: false,
        },
        title: {
          text: this.$t('bill.text_2'),
          show: !!Number(this.subtext),
          subtext: `${this.currencySign}${numerify(this.subtext, '0,0.00')}`,
          textStyle: {
            color: '#999',
            fontSize: 16,
            align: 'center',
          },
          subtextStyle: {
            fontSize: 20,
            color: ['#333'],
            align: 'center',
          },
          left: 'center',
          top: '45%',
        },
        tooltip: {
          show: true,
          trigger: 'item',
          position: (point, params, dom, rect, size) => {
            const series = `<div style="color: #616161;">${params.marker} <span>${params.name}</span>  <span>${this.currencySign}${numerify(params.value, '0,0.00')}</span></div>`
            const wrapper = `<div class="chart-tooltip-wrapper">
                              <div class="lines-wrapper">${series}</div>
                            </div>`
            dom.style.border = 'none'
            dom.style.backgroundColor = 'transparent'
            dom.innerHTML = wrapper
          },
        },
      }
      return config
    },
  },
}
</script>
