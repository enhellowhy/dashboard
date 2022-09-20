<template>
  <div>
    <page-header :title="$t('bill.text_38')" :tabs="cloudEnvOptions" :current-tab.sync="cloudEnv" />
    <page-body>
      <rate-list :id="listId" :cloud-env="cloudEnv" />
    </page-body>
  </div>
</template>

<script>
import RateList from './components/List'

export default {
  name: 'ResourceIndex',
  components: {
    RateList,
  },
  data () {
    return {
      listId: 'BillAssociateList',
      cloudEnvOptions: [
        { key: 'vm', label: this.$t('bill.text_154') },
        { key: 'baremetal', label: this.$t('bill.text_155') },
        { key: 'gpu', label: this.$t('bill.text_156') },
      ],
      cloudEnv: 'vm',
    }
  },
}
</script>
