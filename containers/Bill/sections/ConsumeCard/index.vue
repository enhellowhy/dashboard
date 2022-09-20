<template>
  <bill-card :header="header" :rightBtns="rightBtns">
    <bill-bar
      :isHistogram="true"
      :splitLineShow="splitLineShow"
      :height="height"
      :seriesArr="seriesArrC"
      :loading="loading"
      :showLegend="showLegend"
      :chartSettings="chartSettings"
      :tooltipLabel="tooltipLabel"
      :currencySign="currencySign"
      :numerifyFormat="numerifyFormat"
      :isFormatNumber="isFormatNumber"
      :dateMode="dateMode" />
    <slot slot="header-right" name="header-right" />
  </bill-card>
</template>

<script>
import BillCard from '@Bill/components/BillCard'
import BillBar from '@Bill/components/BillBar'
import i18n from '@/locales'

export default {
  name: 'ConsumeCard',
  components: {
    BillCard,
    BillBar,
  },
  props: {
    header: Object,
    rightBtns: Array,
    height: {
      type: String,
      default: '300px',
    },
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
      default: () => ({
        labelMap: {
          value: i18n.t('bill.text_1'),
        },
      }),
    },
    splitLineShow: {
      type: Boolean,
      default: false,
    },
    tooltipLabel: {
      type: String,
    },
    currencySign: {
      type: String,
      default: '￥',
    },
    numerifyFormat: {
      type: String,
    },
    showLegend: {
      type: Boolean,
      default: false,
    },
    isFormatNumber: {
      type: Boolean,
      default: true,
    },
    dateMode: {
    },
    dateType: String,
  },
  computed: {
    seriesArrC () {
      return this.seriesArr.map(val => {
        const time = val.time.replace('TZ', '')
        return {
          ...val,
          time: this.$moment(time).format(this.timeFormat),
        }
      })
    },
    timeFormat () {
      if (this.dateType) {
        if (this.dateType.includes('month')) {
          return 'YYYY-MM'
        }
        if (this.dateType.includes('day')) {
          return 'MM-DD'
        }
      }
      return 'YYYY-MM-DD'
    },
  },
}
</script>
