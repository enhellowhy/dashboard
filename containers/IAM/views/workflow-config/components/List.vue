<template>
  <page-list
    :list="list"
    :columns="columns"
    :single-actions="singleActions"
    :group-actions="groupActions"
    :export-data-options="exportDataOptions" />
</template>

<script>
import { mapGetters } from 'vuex'
import ColumnsMixin from '../mixins/columns'
import SingleActionsMixin from '../mixins/singleActions'
import ListMixin from '@/mixins/list'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'WorkflowConfigList',
  mixins: [WindowsMixin, ListMixin, ColumnsMixin, SingleActionsMixin],
  props: {
    id: String,
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'workflow_process_definitions',
        apiVersion: 'v1',
        getParams: this.getParam,
        filterOptions: {
          process_definition_name: {
            label: this.$t('system.text_101'),
          },
        },
      }),
      exportDataOptions: {
        items: [
          { label: 'ID', key: 'id' },
          { label: this.$t('system.text_529'), key: 'name' },
          { label: this.$t('system.text_163'), key: 'enabled' },
          { label: this.$t('system.text_530'), key: 'created_at' },
          // { label: this.$t('system.text_163'), key: 'suspended' },
          // { label: this.$t('system.text_530'), key: 'deployment_time' },
        ],
      },
      // groupActions: [
      //   {
      //     label: this.$t('system.text_531'),
      //     action: () => {
      //       this.createDialog('WorkflowConfigProcessDialog', {
      //         title: this.$t('system.text_531'),
      //         data: this.list.selectedItems,
      //         onManager: this.onManager,
      //         refresh: this.refresh,
      //       })
      //     },
      //     meta: () => {
      //       return {
      //         buttonType: 'primary',
      //       }
      //     },
      //   },
      // ],
    }
  },
  computed: mapGetters(['isAdminMode', 'userInfo']),
  created () {
    this.initSidePageTab('workflow-config-detail')
    this.list.fetchData()
  },
  methods: {
    getParam () {
      const ret = {
        user_id: this.isAdminMode ? '' : this.userInfo.id,
      }
      return ret
    },
    handleOpenSidepage (row) {
      this.sidePageTriggerHandle(this, 'WorkflowConfigSidePage', {
        id: row.id,
        resource: 'workflow_process_definitions',
        apiVersion: 'v1',
        getParams: this.getParam,
      }, {
        list: this.list,
      })
    },
    changeExtraProcessDefinitionsStatus (obj, state) {
      return new this.$Manager('extra-process-definitions', 'v1')
        .batchUpdate({
          ids: [obj.id],
          data: {
            state,
            'process-key': obj.key,
          },
        })
    },
  },
}
</script>
