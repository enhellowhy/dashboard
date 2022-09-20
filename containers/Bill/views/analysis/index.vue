<template>
  <div>
    <page-header :title="$t('bill.text_247')">
      <template v-slot:title><currency class="position-absolute" style="right: 0;" /></template>
    </page-header>
    <page-body>
      <analysis />
    </page-body>
  </div>
</template>

<script>
import Analysis from './components/index'
import currencyMixin from '@Bill/mixins/currency'

export default {
  name: 'BillAnalysis',
  components: {
    Analysis,
  },
  mixins: [currencyMixin],
}
</script>
