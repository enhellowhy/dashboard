<template>
  <div>
    <page-header :title="$t('bill.text_244')">
      <template v-slot:title><currency class="position-absolute" style="right: 0;" /></template>
    </page-header>
    <page-body>
      <account-list id="BillAccountList" />
    </page-body>
  </div>
</template>

<script>
import AccountList from './components/List'
import currencyMixin from '@Bill/mixins/currency'

export default {
  name: 'BillAccount',
  components: {
    AccountList,
  },
  mixins: [currencyMixin],
}
</script>
