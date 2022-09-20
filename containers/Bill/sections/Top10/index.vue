<template>
  <div class="bill-controls-top10_bar-wrapper">
    <div v-if="topTitle" class="d-flex justify-content-between align-items-center">
      <div class="bill-kind-tabs-title">{{ topTitle }}</div>
      <a-select v-model="topLimit" @change="limitChange" style="width: 90px;">
        <a-select-option v-for="item in topOpts" :key="item.key" :value="item.key">{{ item.label }}</a-select-option>
      </a-select>
    </div>
    <div class="bill-kind-tabs-subtitle" v-if="subtitle">{{ subtitle }}</div>
    <bill-bar :seriesArr="barData" :yAxisData="barData.yAxisData" :height="barHeight" :chartSettings="chartSettings" :emptyContent="$t('bill.text_85')" :currencySign="currencySign" />
    <div class="table">
      <vxe-grid
        class="mt-4"
        size="mini"
        border
        :columns="columns"
        max-height="400"
        :data="sortArr(data, false)" />
      <div class="vxe-grid--pager-wrapper">
        <div class="vxe-pager size--mini">
          <div class="vxe-pager--wrapper">
            <span class="vxe-pager--total">{{ total }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BillBar from '@Bill/components/BillBar'
import i18n from '@/locales'

export default {
  name: 'BillControlsTop10Bar',
  components: {
    BillBar,
  },
  props: {
    header: Object,
    rightBtns: Array,
    data: {
      type: Array,
      default: () => [],
    },
    currencySign: {
      type: String,
      default: '￥',
    },
    topTitle: String,
    columns: {
      type: Array,
      required: true,
    },
    subtitle: String,
    chartSettings: {
      type: Object,
      default: () => ({
        dimension: ['item_name'],
        metrics: ['res_fee'],
        // 展示映射
        labelMap: {
          res_fee: i18n.t('bill.text_1'),
        },
      }),
    },
    topLimitProp: {
      type: Number,
      default: 10,
    },
  },
  data () {
    return {
      topLimit: this.topLimitProp,
      topOpts: [
        { key: 10, label: 'TOP10' },
        { key: 20, label: 'TOP20' },
        { key: 30, label: 'TOP30' },
        { key: 0, label: this.$t('bill.text_259') },
      ],
    }
  },
  computed: {
    barHeight () {
      let len = this.data.length
      if (len > 20) len = 20
      if (len) return `${Math.max(200, len * 50)}px`
      return '300px'
    },
    barData () {
      return this.sortArr(this.data) // 和 sortData 相反
    },
    total () {
      const total = this.data.length || 0
      return this.$t('monitor_metric_78', [total])
    },
  },
  methods: {
    sortArr (arr, isTopMode = true, field = 'res_fee') {
      const Arr = JSON.parse(JSON.stringify(arr))
      if (isTopMode) {
        return Arr.sort((a, b) => a[field] - b[field])
      } else {
        return Arr.sort((a, b) => b[field] - a[field])
      }
    },
    limitChange (limit) {
      this.$emit('topLimitChange', limit)
    },
  },
}
</script>
