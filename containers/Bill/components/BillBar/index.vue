<template>
  <div>
    <base-chart :chartType="chartType" :chartData="chartData" :chartConfig="chartConfig" :chartSettings="chartSettings" :chartExtend="chartExtend" :loading="loading" :emptyContent="emptyContent" />
  </div>
</template>

<script>
import * as R from 'ramda'
import { numerify } from '@/filters'
import { completionDate } from '@/utils/utils'

export default {
  name: 'BillBar',
  props: {
    seriesArr: {
      type: Array,
      required: true,
    },
    isHistogram: { // 默认表示 Y 轴是数据轴，竖向
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: '460px',
    },
    chartSettings: {
      type: Object,
      default: () => ({}),
    },
    splitLineShow: {
      type: Boolean,
      default: false,
    },
    emptyContent: {},
    currencySign: {
      type: String,
      default: '￥',
    },
    numerifyFormat: {
      type: String,
      default: '0,0.00',
    },
    showLegend: {
      type: Boolean,
      default: false,
    },
    isFormatNumber: {
      type: Boolean,
      default: true,
    },
    dateMode: {},
    showDataZoom: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      chartType: this.isHistogram ? 've-histogram' : 've-bar',
    }
  },
  computed: {
    chartData () {
      const chartData = {
        columns: [],
        rows: [],
      }
      if (this.seriesArr.length) {
        this.seriesArr.map(item => {
          const arr = Object.keys(item)
          chartData.columns = chartData.columns.concat(arr)
        })
        chartData.columns = Array.from(new Set(chartData.columns))
        if (this.dateMode === 'month') {
          chartData.rows = completionDate(this.seriesArr, new Date(), ['value'])
        } else if (this.dateMode === 'year') {
          chartData.rows = completionDate(this.seriesArr, new Date(), ['value'], true)
        } else {
          chartData.rows = this.seriesArr
        }
      }
      return chartData
    },
    chartExtend () {
      const commonSerie = {
        barMaxWidth: '16px',
        barCategoryGap: '60%',
      }
      if (!this.isHistogram) {
        commonSerie.label = {
          show: !this.isHistogram,
          normal: {
            formatter: params => `${this.currencySign}${numerify(params.value, this.numerifyFormat)}`,
            position: 'right',
            show: true,
            color: '#939EAB',
          },
          emphasis: {
            color: '#4DA1FF',
          },
        }
      }
      return {
        series (v) {
          if (v) return v.map(i => ({ ...i, ...commonSerie }))
          return []
        },
        xAxis: {
          boundaryGap: [0, 0.01],
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: this.isHistogram,
          },
        },
        yAxis: {
          nameGap: 30,
          splitLine: {
            show: this.splitLineShow,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter (value, index) {
              if (value.length > 24) {
                const start12 = value.slice(0, 6)
                const end12 = value.slice(value.length - 6)
                return `${start12}...${end12}`
              }
              return value
            },
          },
        },
        toolbox: {
          showTitle: false,
        },
      }
    },
    chartConfig () {
      // let title = {}
      // if (!this.seriesArr.length) {
      //   title = {
      //     show: true,
      //     textStyle: {
      //       color: 'grey',
      //       fontSize: 20,
      //     },
      //     text: '当前月份没有数据，请尝试其他月份',
      //     left: 'left',
      //     top: '20%',
      //   }
      // }
      const config = {
        // title,
        height: this.height,
        width: '100%',
        legend: {
          show: this.showLegend,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgb(77, 161, 255)',
              opacity: 0.1,
            },
          },
          position: (point, params, dom, rect, size) => {
            const series = params.map(line => `<div style="color: #616161;">${line.marker} <span>${line.seriesName}</span>  <span>${this.currencySign} ${R.is(Number, line.value) ? (this.isFormatNumber ? numerify(line.value, this.numerifyFormat) : line.value) : line.value}</span></div>`).join('')
            const wrapper = `<div class="chart-tooltip-wrapper">
                          <div style="color: #5D6F80;">${params[0].name}</div>
                          <div class="lines-wrapper">${series}</div>
                        </div>`
            dom.style.border = 'none'
            dom.style.backgroundColor = 'transparent'
            dom.innerHTML = wrapper
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          // top: '3%',
          containLabel: true,
        },
      }
      if (this.isHistogram) {
        config.toolbox = {
          show: true,
          feature: {
            magicType: { type: ['line', 'bar'] },
          },
          right: 20,
        }
        config.grid.top = '40px'
      }
      return config
    },
  },
}
</script>

<style lang="less" scoped>
::v-deep {
  .ve-bar {
    max-height: 1400px; // 30条数据的高度，超过30条数据滚动
    overflow: auto;
  }
}
</style>
