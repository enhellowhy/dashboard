<template>
  <div class="bill-controls-top10_bar-wrapper">
    <div class="d-flex">
      <div style="width: 550px">
        <bill-pie :seriesArr="data" :chartSettings="chartSettings" :pieTitle="pieTitle" :pieSubtext="pieSubtext" :emptyContent="$t('bill.text_85')" :currencySign="currencySign" />
      </div>
      <div class="flex-fill">
        <slot name="buttons" />
        <vxe-grid
          class="w-100 mt-4"
          resizable
          border
          :columns="columns"
          :data="data" />
      </div>
    </div>
  </div>
</template>

<script>
import BillPie from '@Bill/components/BillPie'

export default {
  name: 'BillControlsTop10',
  components: {
    BillPie,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    currencySign: {
      type: String,
      default: '￥',
    },
    columns: {
      type: Array,
      required: true,
    },
    chartSettings: {
      type: Object,
      default: () => ({
        dimension: ['item_name'],
        metrics: ['res_fee'],
      }),
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
}
</script>
