<template>
  <pie-list :dataList="dataList" :currencySign="currencySign" :list-title="$t('bill.text_66')" :subtitle="$t('bill.text_62')" />
</template>

<script>
import kindTabsMixin from './kindTabsMixin'
import PieList from '@Bill/sections/PieList'

export default {
  name: 'KindTabsDomain',
  components: {
    PieList,
  },
  mixins: [kindTabsMixin],
  data () {
    return {
      queryType: 'domain_expense',
    }
  },
}
</script>
