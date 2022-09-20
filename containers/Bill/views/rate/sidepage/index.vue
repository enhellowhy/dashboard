<template>
  <base-side-page
    @cancel="cancelSidePage"
    :title="$t('bill.text_38')"
    icon="res-rate"
    :res-name="toVmName(detailData)"
    :current-tab="params.windowData.currentTab"
    :loaded="loaded"
    :tabs="detailTabs"
    @tab-change="handleTabChange">
    <component :is="params.windowData.currentTab" :res-id="data.id" :data="detailData" :params="params" />
  </base-side-page>
</template>

<script>
import ColumnsMixin from '../mixins/columns'
import History from './History'
import { toVmName } from '@Bill/views/rate/utils'
import SidePageMixin from '@/mixins/sidePage'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'BillRateSidePage',
  components: {
    History,
  },
  mixins: [SidePageMixin, WindowsMixin, ColumnsMixin],
  data () {
    return {
      detailTabs: [
        { label: this.$t('bill.text_170'), key: 'history' },
      ],
    }
  },
  methods: {
    toVmName,
  },
}
</script>
