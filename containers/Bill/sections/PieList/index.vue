<template>
  <div class="bill-controls-platform">
    <a-row :gutter="24" class="h-100">
      <a-col :span="12">
        <div class="bill-kind-tabs-title">{{ listTitle }}</div>
        <div class="bill-kind-tabs-subtitle" v-if="subtitle">{{ subtitle }}</div>
        <scrollbar tag="ul" class="list-wrapper mt-2 pr-1" style="height: 230px;">
          <li class="list-item clearfix" v-for="item in _dataList" :key="item[nameKey]">
            <div class="item-side float-left">
              <div class="circle mr-2" :style="{'borderColor': item.color}" />
              <div class="name">{{ item[nameKey] }}</div>
            </div>
            <div class="item-side float-right">
              <div class="value">{{ currencySign }}{{ item[valueKey] | numerify('0,0.00') }} </div>
              <div class="percent ml-2">{{ percent(item[valueKey]) }}</div>
            </div>
          </li>
          <a-alert v-if="_dataList.length === 0" :message="$t('bill.text_85')" banner />
        </scrollbar>
      </a-col>
      <a-col :span="12" style="height: 320px;">
        <ring-base :seriesArr="_dataList" :subtext="totalMoney" :currencySign="currencySign" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import * as R from 'ramda'
import RingBase from '@Bill/components/BillRing'
import { numerify } from '@/filters'
import { chartColors } from '@/constants'

const formatNumber = value => {
  if (!value || value === 'NaN' || isNaN(value) || R.isNil(value)) return 0
  return Number(value)
}

export default {
  name: 'PieList',
  components: {
    RingBase,
  },
  props: {
    dataList: {
      type: Array,
      required: true,
    },
    nameKey: {
      type: String,
      default: 'item_name',
    },
    valueKey: {
      type: String,
      default: 'res_fee',
    },
    listTitle: {
      type: String,
      required: true,
    },
    subtitle: String,
    currencySign: {
      type: String,
      default: '￥',
    },
  },
  computed: {
    totalMoney () {
      const total = numerify(this.dataList.reduce((a, b) => (+a) + (+b[this.valueKey]), 0), '0.00')
      return formatNumber(total)
    },
    _dataList () {
      const zero = ['0', '0.0', '0.00']
      return this.dataList
        .map(val => {
          let value = 0
          if (val[this.valueKey]) value = formatNumber(val[this.valueKey]).toFixed(2)
          return { [this.nameKey]: val[this.nameKey], [this.valueKey]: value }
        })
        .filter(val => {
          return val[this.valueKey] && !zero.includes(val[this.valueKey])
        })
        .sort((a, b) => {
          return b.res_fee - a.res_fee
        })
        .map((val, i) => {
          return {
            ...val,
            color: chartColors[i] || chartColors[i % chartColors.length],
          }
        })
    },
  },
  methods: {
    percent (num) {
      if (!this.totalMoney) return '0%'
      return `${numerify((num / this.totalMoney) * 100, '0.00')}%`
    },
  },
}
</script>

<style lang="less" scoped>
.bill-controls-platform {
  .list-wrapper {
    :global(.el-scrollbar__wrap) {
      overflow-x: hidden;
    }
    ::v-deep ul {
      list-style: none;
      padding-left: 0;
    }
    ::v-deep .is-horizontal {
      display: none;
    }
    ::v-deep .scrollbar-wrap {
      overflow-x: hidden;
    }
    .list-item {
      line-height: 40px;
      height: 40px;
      border-bottom: 1px solid #DCE0E6;
      font-size: 12px;
      .item-side {
        display: flex;
      }
      .name {
        color: #000;
      }
      .value {
        color: #939EAB;
      }
      .percent {
        border: 1px solid #4DA1FF;
        color: #4DA1FF;
        height: 20px;
        line-height: 20px;
        margin-top: 10px;
        padding: 0 6px;
      }
      .circle {
        margin-top: 14px;
        height: 14px;
        width: 14px;
        border-radius: 50%;
        border: 1px solid #ccc;
      }
    }
  }
}
</style>
