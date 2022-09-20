<template>
  <div class="activity-list">
    <page-list
      :list="list"
      :columns="columns"
      :export-data-options="exportDataOptions"
      :show-page="false"
      :refresh-method="refresh"
      default-search-key="name"
      :single-actions="singleActions" />
  </div>
</template>

<script>
import { getTimeRangeFilter } from '@/utils/common/tableFilter'
import {
  getCopyWithContentTableColumn,
  getTimeTableColumn,
} from '@/utils/common/tableColumn'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'Activity',
  mixins: [WindowsMixin],
  props: {
    resId: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  data () {
    const filterOptions = {
      // name: {
      //   label: this.$t('cloudenv.clusters.drs.activity_name'),
      // },
      success: {
        label: this.$t('table.title.action_result'),
        dropdown: true,
        items: [
          { label: this.$t('operation.success.true'), key: true },
          { label: this.$t('operation.success.false'), key: false },
        ],
      },
      start_time: getTimeRangeFilter({ label: this.$t('common_156'), field: 'start_time' }),
    }
    if (this.$store.getters.isProjectMode) delete filterOptions.tenant
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'clusteractivities',
        apiVersion: 'v1',
        getParams: this.getParam,
        filterOptions,
      }),
      exportDataOptions: {
        items: [
          // { label: 'ID', key: 'id' },
          // { label: this.$t('table.title.operation'), key: 'action' },
          { label: this.$t('cloudenv.clusters.activity.name'), key: 'name' },
          { label: this.$t('common.status'), key: 'success' },
          { label: this.$t('common_156'), key: 'start_time' },
          { label: this.$t('table.title.desc'), key: 'reason' },
        ],
        limit: () => Object.keys(this.list.data).length,
        export: 'custom',
        notCombineListParams: true,
        exportType: {
          custom: { label: this.$t('common_158'), key: 'custom' },
          allFilter: { label: this.$t('common_96'), key: 'allFilter' },
        },
        getParams: ({ exportType }) => {
          let params = {}
          if (exportType === 'allFilter') {
            params = {
              filter: this.list.params.filter,
              export_limit: 0,
            }
          }
          return params
        },
      },
      columns: [
        {
          title: '#ID',
          field: 'id',
          minWidth: 120,
          showOverflow: 'ellipsis',
        },
        getCopyWithContentTableColumn({
          title: this.$t('cloudenv.clusters.activity.name'),
          field: 'name',
          hideField: true,
          // message: row => this.$te(`cloudenv.clusters.activity.${row.name}`) ? this.$t(`cloudenv.clusters.activity.${row.name}`) : row.name,
          slotCallback: row => this.$te(`cloudenv.clusters.activity.${row.name}`) ? this.$t(`cloudenv.clusters.activity.${row.name}`) : row.name,
        }),
        {
          title: this.$t('cloudenv.clusters.activity.migrate_number'),
          field: 'migrate_number',
          width: 100,
          slots: {
            default: ({ row }, h) => {
              if (row.migrate_number > -1) {
                // if ((row.state === 'COMPLETED' || row.state === 'CUSTOM_TODO') && bizStatus) {
                return [<span style='bold'>{ row.migrate_number }</span>]
              }
              return '-'
            },
          },
        },
        {
          title: this.$t('system.text_164'),
          field: 'status',
          width: 80,
          slots: {
            default: ({ row }, h) => {
              if (row.status === 'succeed' || row.status === 'failed' || row.status === 'execution' || row.status === 'part_succeed') {
                // if ((row.state === 'COMPLETED' || row.state === 'CUSTOM_TODO') && bizStatus) {
                return [
                  // <div class="d-flex"><status status={ bizStatus } statusModule={ 'workflowBiz' } />{ bizStatus === 'fail' ? tooltip : null }</div>,
                  <div class="d-flex">
                    <status status={row.status} statusModule={'clusteractivitie'}/>
                  </div>,
                ]
              }
              return '-'
            },
          },
        },
        getCopyWithContentTableColumn({
          title: this.$t('cloudenv.clusters.drs.strategy'),
          field: 'strategy',
          hideField: true,
          message: row => this.$te(`cloudenv.clusters.drs.strategy.${row.strategy}`) ? this.$t(`cloudenv.clusters.drs.strategy.${row.strategy}`) : row.strategy,
          slotCallback: row => this.$te(`cloudenv.clusters.drs.strategy.${row.strategy}`) ? this.$t(`cloudenv.clusters.drs.strategy.${row.strategy}`) : row.strategy,
        }),
        getTimeTableColumn({
          field: 'start_time',
          title: this.$t('cloudenv.text_461'),
        }),
        getTimeTableColumn({
          field: 'end_time',
          title: this.$t('cloudenv.text_462'),
        }),
        // {
        //   field: 'owner_tenant',
        //   title: this.$t('table.title.owner_project'),
        //   showOverflow: 'title',
        //   minWidth: 120,
        //   slots: {
        //     default: ({ row }, h) => {
        //       const domain = row.owner_domain
        //       const ret = [
        //         <list-body-cell-wrap copy field='owner_tenant' row={row} />,
        //         <list-body-cell-wrap hide-field copy field="domain" row={{ domain }}>
        //           <span class='text-weak'>{ domain }</span>
        //         </list-body-cell-wrap>,
        //       ]
        //       return ret
        //     },
        //   },
        // },
      ],
      singleActions: [{
        label: this.$t('common.view'),
        action: row => {
          let text = ''
          try {
            text = JSON.stringify(JSON.parse(row.reason), null, 4)
          } catch (e) {
            text = row.reason
          }
          this.clickHandler(text)
        },
      }],
    }
  },
  created () {
    this.initSidePageTab('cloudregion-detail')
    this.list.fetchData()
  },
  methods: {
    clickHandler (val) {
      this.createDialog('EventLogDialog', {
        data: val,
      })
    },
    getParam () {
      const param = {}
      const filter = []
      if (this.resId) {
        filter.push([`cluster_id.in('${this.resId}')`])
      }
      param.filter = filter
      return param
    },
    refresh (clearSelected) {
      clearSelected()
      this.list.reset()
      this.list.fetchData()
    },
  },
}
</script>
<style lang="less" scoped>
.activity-list{
  position: relative;
  padding-bottom: 20px;
}
</style>
