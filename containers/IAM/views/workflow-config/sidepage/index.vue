<template>
  <base-side-page
    @cancel="cancelSidePage"
    :title="$t('system.text_13')"
    icon="res-repair-order-configuration"
    :res-name="workflowType && workflowType.name"
    :actions="params.actions"
    :current-tab="params.windowData.currentTab"
    :tabs="detailTabs"
    :loaded="loaded"
    @tab-change="handleTabChange">
    <template v-slot:actions>
      <actions :options="singleActions" :row="detailData" button-type="link" button-size="small" />
    </template>
    <component :is="params.windowData.currentTab" :res-id="data.id" :id="listId" :data="detailData" :onManager="onManager" :getParams="getParams" />
  </base-side-page>
</template>

<script>
import ColumnsMixin from '../mixins/columns'
import SingleActionsMixin from '../mixins/singleActions'
import WorkflowConfigDetail from './Detail'
import SidePageMixin from '@/mixins/sidePage'
import WindowsMixin from '@/mixins/windows'
import Actions from '@/components/PageList/Actions'
import { getWorkflowType } from '@/constants/workflow'

export default {
  name: 'WorkflowConfigSidePage',
  components: {
    WorkflowConfigDetail,
    Actions,
  },
  mixins: [SidePageMixin, WindowsMixin, ColumnsMixin, SingleActionsMixin],
  data () {
    return {
      detailTabs: [
        { label: this.$t('system.text_159'), key: 'workflow-config-detail' },
        { label: this.$t('system.text_17'), key: 'event-drawer' },
      ],
    }
  },
  computed: {
    getParams () {
      return null
    },
    workflowType () {
      return getWorkflowType(this.detailData.key)
    },
    listId () {
      switch (this.params.windowData.currentTab) {
        case 'event-drawer':
          return 'EventListForWorkflowConfigSidePage'
        default:
          return ''
      }
    },
  },
}
</script>
