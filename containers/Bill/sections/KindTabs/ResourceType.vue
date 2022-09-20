<template>
  <pie-list :dataList="dataList" :currencySign="currencySign" :list-title="$t('bill.text_74')" />
</template>

<script>
import kindTabsMixin from './kindTabsMixin'
import PieList from '@Bill/sections/PieList'

export default {
  name: 'KindTabsResourceType',
  components: {
    PieList,
  },
  mixins: [kindTabsMixin],
  data () {
    return {
      queryType: 'resource_type',
    }
  },
}
</script>
