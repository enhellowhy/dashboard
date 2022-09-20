<template>
  <pie-list :dataList="dataList" :currencySign="currencySign" :list-title="$t('bill.text_64')" />
</template>

<script>
import kindTabsMixin from './kindTabsMixin'
import PieList from '@Bill/sections/PieList'

export default {
  name: 'KindTabsChargeType',
  components: {
    PieList,
  },
  mixins: [kindTabsMixin],
  data () {
    return {
      queryType: 'charge_type',
    }
  },
}
</script>
