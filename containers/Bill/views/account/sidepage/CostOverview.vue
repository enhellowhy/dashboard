<template>
  <div class="bill">
    <kind-tabs :tabs="kindTabs" :account="currentAccount" :currencyParams="currencyParams" :currencySign="currencySign" />
  </div>
</template>

<script>
import KindTabs from '@Bill/sections/KindTabs'
import currencyRequest from '@Bill/mixins/currencyRequest'

export default {
  name: 'BillAccountDetailsCostOverView',
  components: {
    KindTabs,
  },
  mixins: [currencyRequest],
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      kindTabs: [
        {
          label: this.$t('bill.text_73'),
          key: 'resource-type',
        },
        {
          label: this.$t('bill.text_82'),
          key: 'resource',
          height: 470,
        },
        {
          label: this.$t('dictionary.cloudprovider'),
          key: 'cloudprovider',
          height: 470,
        },
        {
          label: this.$t('bill.text_83'),
          key: 'region',
        },
        {
          label: this.$t('bill.text_84'),
          key: 'charge-type',
        },
        {
          label: this.$t('dictionary.domain'),
          key: 'domain',
        },
        {
          label: this.$t('dictionary.project'),
          key: 'project',
          height: 470,
        },
      ],
    }
  },
  computed: {
    currentAccount () {
      return this.data.account || null
    },
  },
}
</script>
