<template>
  <div>
    <page-header :title="$t('bill.text_246')">
      <template v-slot:title><currency class="position-absolute" style="right: 0;" /></template>
    </page-header>
    <page-body>
      <statistic />
    </page-body>
  </div>
</template>

<script>
import Statistic from './components/index'
import currencyMixin from '@Bill/mixins/currency'

export default {
  name: 'BillStatistic',
  components: {
    Statistic,
  },
  mixins: [currencyMixin],
}
</script>
