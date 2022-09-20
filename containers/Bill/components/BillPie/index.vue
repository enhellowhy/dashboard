<template>
  <base-chart chartType="ve-pie" :chartData="chartData" :chartConfig="chartConfig" :chartSettings="chartSettings" :loading="loading" :emptyContent="emptyContent" />
</template>

<script>
// import * as R from 'ramda'
import { numerify } from '@/filters'
import i18n from '@/locales'

export default {
  name: 'BillPie',
  props: {
    seriesArr: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
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
    tooltipLabel: {
      type: String,
      default: i18n.t('bill.text_1'),
    },
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
    pieTitle: {
      type: String,
      default: '',
    },
    pieSubtext: {
      type: String,
      default: '',
    },
  },
  data () {
    return {}
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
        chartData.rows = this.seriesArr
      }
      return chartData
    },
    chartConfig () {
      const config = {
        height: '460px',
        width: '100%',
        legend: {
          show: this.showLegend,
        },
        title: {
          text: this.pieTitle,
          subtext: this.pieSubtext,
          left: 'center',
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true,
        },
      }
      return config
    },
  },
}
</script>
