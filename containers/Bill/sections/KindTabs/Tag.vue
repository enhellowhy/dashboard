<template>
  <pie-list :dataList="dataListC" :currencySign="currencySign" :list-title="$t('bill.text_75')" :subtitle="$t('bill.text_62')" />
</template>

<script>
import kindTabsMixin from './kindTabsMixin'
import PieList from '@Bill/sections/PieList'

export default {
  name: 'KindTabsLabel',
  components: {
    PieList,
  },
  mixins: [kindTabsMixin],
  data () {
    return {
      queryType: 'tag_stat',
    }
  },
  computed: {
    dataListC () {
      return this.dataList.map(val => {
        return {
          ...val,
          item_name: val.item_name.replace('user:', ''),
        }
      })
    },
  },
}
</script>
