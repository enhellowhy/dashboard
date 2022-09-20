<template>
  <base-side-page
    @cancel="cancelSidePage"
    :title="$t('bill.text_244')"
    icon="res-cloudaccount"
    :res-name="detailData.name"
    :current-tab="params.windowData.currentTab"
    :loaded="loaded"
    :tabs="detailTabs"
    @tab-change="handleTabChange">
    <component :is="params.windowData.currentTab" :res-id="data.id" :data="detailData" :on-manager="onManager" />
  </base-side-page>
</template>

<script>
import ColumnsMixin from '../mixins/columns'
import AccountOverview from './AccountOverview'
import CostOverview from './CostOverview'
import SidePageMixin from '@/mixins/sidePage'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'BillAccountSidePage',
  components: {
    AccountOverview,
    CostOverview,
  },
  mixins: [SidePageMixin, WindowsMixin, ColumnsMixin],
  data () {
    return {
      detailTabs: [
        { label: this.$t('bill.text_100'), key: 'account-overview' },
        { label: this.$t('bill.text_101'), key: 'cost-overview' },
      ],
    }
  },
}
</script>
