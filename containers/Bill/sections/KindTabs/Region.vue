<template>
  <pie-list :dataList="dataList" :currencySign="currencySign" :list-title="$t('bill.text_70')" :subtitle="$t('bill.text_62')" />
</template>

<script>
import kindTabsMixin from './kindTabsMixin'
import PieList from '@Bill/sections/PieList'

export default {
  name: 'KindTabsRegion',
  components: {
    PieList,
  },
  mixins: [kindTabsMixin],
  data () {
    return {
      queryType: 'region_expense',
    }
  },
}
</script>
