<template>
  <base-side-page
    @cancel="cancelSidePage"
    :title="$t('cloudenv.clusters.hosts.text_0')"
    icon="res-host"
    :res-name="detailData.name"
    :actions="params.actions"
    :current-tab="params.windowData.currentTab"
    :loaded="loaded"
    :tabs="detailTabs"
    @tab-change="handleTabChange">
    <template v-slot:actions>
      <actions :options="singleActions" :row="detailData" button-type="link" button-size="small" />
    </template>
    <component :is="params.windowData.currentTab" :data="detailData" :on-manager="onManager" :res-id="data.id" :id="listId" :getParams="getParams" :columns="columns" />
  </base-side-page>
</template>

<script>
import SingleActionsMixin from '../mixins/singleActions'
import ColumnsMixin from '../mixins/columns'
import ClusterDetail from './Detail'
import Dashboard from './Dashboard'
import DrsRecord from './DrsRecord'
import Activity from './Activity'
import HostList from '@Compute/views/host/components/List'
import SidePageMixin from '@/mixins/sidePage'
import WindowsMixin from '@/mixins/windows'
import Actions from '@/components/PageList/Actions'

export default {
  name: 'ClusterSidePage',
  components: {
    Actions,
    ClusterDetail,
    HostList,
    Activity,
    DrsRecord,
    Dashboard,
  },
  mixins: [SidePageMixin, WindowsMixin, SingleActionsMixin, ColumnsMixin],
  data () {
    return {}
  },
  computed: {
    detailTabs () {
      // const data = this.detailData
      const detailTabs = [
        { label: this.$t('cloudenv.text_237'), key: 'cluster-detail' },
        { label: this.$t('compute.text_233'), key: 'activity' },
        { label: this.$t('cloudenv.clusters.drs.record'), key: 'drs-record' },
        { label: this.$t('cloudenv.text_101'), key: 'host-list' },
        { label: this.$t('cloudenv.text_319'), key: 'dashboard' },
        { label: this.$t('cloudenv.text_15'), key: 'event-drawer' },
      ]
      // if (data.resource_type === 'hosts') {
      //   const tabs = [
      //     { label: this.$t('cloudenv.text_424'), key: 'physicalmachine-list' },
      //   ]
      //   detailTabs.splice(1, 0, ...tabs)
      // }
      return detailTabs
    },
    getParams () {
      const params = {
        // 'physicalmachine-list': {
        //   details: true,
        //   cluster: this.data.id,
        //   baremetal: true,
        // },
        'host-list': {
          detail: true,
          cluster: this.data.id,
          baremetal: false,
        },
      }
      return params[this.params.windowData.currentTab] || {
        details: true,
        cluster: this.data.id,
      }
    },
    listId () {
      switch (this.params.windowData.currentTab) {
        case 'event-drawer':
          return 'EventListForClusterSidePage'
        case 'host-list':
          return 'HostListForClusterSidePage'
        case 'activity':
          return 'ActivitySidePage'
        case 'drs-record':
          return 'DrsRecordSidePage'
        default:
          return ''
      }
    },
  },
}
</script>
