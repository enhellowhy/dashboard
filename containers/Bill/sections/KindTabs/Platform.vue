<template>
  <pie-list :dataList="dataList" :currencySign="currencySign" :list-title="$t('bill.text_67')" />
</template>

<script>
import kindTabsMixin from './kindTabsMixin'
import PieList from '@Bill/sections/PieList'

export default {
  name: 'KindTabsPlatform',
  components: {
    PieList,
  },
  mixins: [kindTabsMixin],
  data () {
    return {
      // queryType: 'platform_brand_expense',
      queryType: 'provider',
    }
  },
}
</script>
