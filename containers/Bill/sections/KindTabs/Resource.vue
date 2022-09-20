<template>
  <top10
    :data="dataList"
    :chartSettings="chartSettings"
    :columns="columns"
    :currencySign="currencySign"
    :top-title="$t('bill.text_71', [topLimitPropC])"
    @topLimitChange="topLimitChange"  />
<!--  :subtitle="$t('bill.text_62')"-->
<!--  @topLimitChange="topLimitChange"  />-->
</template>

<script>
import kindTabsMixin from './kindTabsMixin'
import Top10 from '@Bill/sections/Top10'
import { numerify } from '@/filters'

export default {
  name: 'KindTabsResource',
  components: {
    Top10,
  },
  mixins: [kindTabsMixin],
  data () {
    return {
      queryType: 'res_top10',
      topLimitProp: 10,
      chartSettings: {
        dimension: ['res_name'],
        metrics: ['res_fee'],
      },
      columns: [
        {
          field: 'res_name',
          title: this.$t('bill.text_72'),
          slots: {
            default: ({ row }, h) => {
              return [<list-body-cell-wrap copy row={ row } field='res_name' title={ row.res_name } />]
            },
          },
        },
        {
          field: 'res_type',
          title: this.$t('bill.text_73'),
          formatter: ({ row }) => this.$te(`dictionary.${row.res_type}`) ? this.$t(`dictionary.${row.res_type}`) : row.res_type,
        },
        {
          field: 'project_name',
          title: this.$t('dictionary.project'),
          slots: {
            default: ({ row }, h) => {
              return [<list-body-cell-wrap copy row={ row } field='project_name' title={ row.project_name } />]
            },
          },
        },
        {
          field: 'res_fee',
          title: this.$t('bill.text_35'),
          slots: {
            default: ({ row }, h) => {
              const money = numerify(row.res_fee, '0,0.00')
              return [<list-body-cell-wrap copy row={ row } field='res_fee' hideField title={ row.res_fee }><div class="text-right">{this.currencySign}{money}</div></list-body-cell-wrap>]
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
