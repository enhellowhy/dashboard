<template>
  <top10
    yAxisDataNameKey="item_name"
    :columns="columns"
    :data="dataList"
    :bar-name="$t('dictionary.cloudprovider')"
    :top-title="$t('bill.text_65', [topLimitPropC])"
    :subtitle="$t('bill.text_62')"
    :currencySign="currencySign"
    @topLimitChange="topLimitChange" />
</template>

<script>
import kindTabsMixin from './kindTabsMixin'
import Top10 from '@Bill/sections/Top10'
import { numerify } from '@/filters'

export default {
  name: 'BillControlKindTabsCloudprovider',
  components: {
    Top10,
  },
  mixins: [kindTabsMixin],
  data () {
    return {
      queryType: 'cloudprovider_expense',
      topLimitProp: 10,
      columns: [
        {
          field: 'item_name',
          title: `${this.$t('dictionary.cloudprovider')}(${this.$t('dictionary.cloudaccount')})`,
          slots: {
            default: ({ row }) => {
              return [<list-body-cell-wrap copy row={ row } field='item_name' title={ row.item_name } />]
            },
          },
        },
        {
          field: 'res_fee',
          title: this.$t('bill.text_35'),
          slots: {
            default: ({ row }) => {
              const money = numerify(row.res_fee, '0,0.00')
              return [<list-body-cell-wrap copy row={ row } field='amount' hideField title={ row.res_fee }><div class="text-right">{this.currencySign}{ money }</div></list-body-cell-wrap>]
            },
          },
        },
      ],
    }
  },
  computed: {
    topLimitPropC () {
      if (this.topLimitProp === 0) {
        return ''
      }
      return `TOP${this.topLimitProp}`
    },
  },
}
</script>
