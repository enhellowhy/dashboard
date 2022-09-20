<template>
  <top10
    :columns="columns"
    :data="dataList"
    :currencySign="currencySign"
    :bar-name="$t('bill.text_68', [$t('dictionary.project')])"
    :top-title="$t('bill.text_69', [$t('dictionary.project'), topLimitPropC])"
    @topLimitChange="topLimitChange" />
<!--  :subtitle="$t('bill.text_62')"-->
<!--  @topLimitChange="topLimitChange" />-->
</template>

<script>
import kindTabsMixin from './kindTabsMixin'
import Top10 from '@Bill/sections/Top10'
import { numerify } from '@/filters'

export default {
  name: 'BillControlsKindTabsProject',
  components: {
    Top10,
  },
  mixins: [kindTabsMixin],
  props: {
    domain: {
      type: String,
    },
  },
  data () {
    return {
      // queryType: 'project_expense',
      queryType: 'project',
      topLimitProp: 10,
      columns: [
        {
          field: 'item_name',
          title: this.$t('dictionary.project'),
        },
        {
          field: 'res_fee',
          title: this.$t('bill.text_35'),
          formatter: ({ row }) => `${this.currencySign}${numerify(row.res_fee, '0,0.00')}`,
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
