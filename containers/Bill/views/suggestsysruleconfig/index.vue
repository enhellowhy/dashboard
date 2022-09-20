<template>
  <div>
    <page-header :title="$t('bill.text_220')" />
    <page-body>
      <account-list id="BillAccountList" />
    </page-body>
  </div>
</template>

<script>
import AccountList from './components/List'
export default {
  name: 'BillAccount',
  components: {
    AccountList,
  },
}
</script>
