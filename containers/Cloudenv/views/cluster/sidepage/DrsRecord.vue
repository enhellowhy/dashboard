<template>
  <div class="drs-list">
    <page-list
      :list="list"
      :columns="columns"
      :export-data-options="exportDataOptions"
      :show-page="false"
      :refresh-method="refresh"
      default-search-key="guest_name"
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
  name: 'DrsRecord',
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
      guest_name: {
        label: this.$t('cloudenv.clusters.drs.guest_name'),
      },
      activity_id: {
        label: this.$t('cloudenv.clusters.drs.activity_id'),
      },
      // user: {
      //   label: this.$t('table.title.sponsor'),
      //   filter: true,
      //   formatter: val => {
      //     return `user.contains("${val}")`
      //   },
      // },
      // action: {
      //   label: this.$t('table.title.operation'),
      //   dropdown: true,
      //   multiple: true,
      //   distinctField: {
      //     type: 'field',
      //     key: 'action',
      //     getParams: () => {
      //       return this.objId && {
      //         filter: `obj_id.in(${this.objId})`,
      //       }
      //     },
      //   },
      //   mapper: (data, originData) => {
      //     const i18n = originData._i18n.action
      //     const keys = originData.action
      //
      //     const obj = {}
      //
      //     for (let i = 0, len = i18n.length; i < len; i++) {
      //       const label = i18n[i]
      //       const key = keys[i]
      //       if (obj[label]) {
      //         obj[label].push(key)
      //       } else {
      //         obj[label] = [key]
      //       }
      //     }
      //     return Object.keys(obj).filter(item => !!item).map((item) => ({ label: item, key: obj[item].join(',') }))
      //   },
      // },
      strategy: {
        label: this.$t('cloudenv.clusters.drs.strategy'),
        dropdown: true,
        items: [
          { label: this.$t('cloudenv.clusters.drs.strategy.usage'), key: 'usage' },
          { label: this.$t('cloudenv.clusters.drs.strategy.assigned'), key: 'assigned' },
        ],
      },
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
        resource: 'drsrecords',
        apiVersion: 'v1',
        getParams: this.getParam,
        filterOptions,
      }),
      exportDataOptions: {
        items: [
          { label: 'ID', key: 'id' },
          { label: this.$t('common_56'), key: 'obj_type' },
          // { label: this.$t('table.title.operation'), key: 'action' },
          { label: this.$t('cloudenv.clusters.drs.guest_name'), key: 'guest_name' },
          { label: this.$t('cloudenv.clusters.drs.from_host_name'), key: 'from_host_name' },
          { label: this.$t('cloudenv.clusters.drs.to_host_name'), key: 'to_host_name' },
          { label: this.$t('common.status'), key: 'success' },
          { label: this.$t('common_156'), key: 'start_time' },
          { label: this.$t('table.title.sponsor'), key: 'user' },
          { label: this.$t('table.title.desc'), key: 'notes' },
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
        // {
        //   title: '#ID',
        //   field: 'id',
        //   minWidth: 80,
        //   showOverflow: 'ellipsis',
        // },
        {
          title: this.$t('cloudenv.clusters.drs.activity_id'),
          field: 'activity_id',
          minWidth: 150,
          showOverflow: 'ellipsis',
        },
        getTimeTableColumn({
          field: 'start_time',
          title: this.$t('common_156'),
        }),
        // <side-page-trigger onTrigger={ () => this.sidePageTriggerHandle(row.guest_id, 'VmInstanceSidePage') }>{ row.guest_name }</side-page-trigger>
        getCopyWithContentTableColumn({
          title: this.$t('cloudenv.clusters.drs.guest_name'),
          field: 'guest_name',
          hideField: true,
          slotCallback: row => {
            return (
              <side-page-trigger onTrigger={ () => this.handleOpenServerSidepage(row, 'vm-instance-detail') }>{ row.guest_name }</side-page-trigger>
            )
          },
        }),
        getCopyWithContentTableColumn({
          title: this.$t('cloudenv.clusters.drs.from_host_name'),
          field: 'from_host_name',
          hideField: true,
          slotCallback: row => {
            return (
              <side-page-trigger onTrigger={ () => this.handleOpenSidepage(row.from_host_id, 'host-detail') }>{ row.from_host_name }</side-page-trigger>
            )
          },
        }),
        getCopyWithContentTableColumn({
          title: this.$t('cloudenv.clusters.drs.to_host_name'),
          field: 'to_host_name',
          hideField: true,
          slotCallback: row => {
            return (
              <side-page-trigger onTrigger={ () => this.handleOpenSidepage(row.to_host_id, 'host-detail') }>{ row.to_host_name }</side-page-trigger>
            )
          },
        }),
        getCopyWithContentTableColumn({
          title: this.$t('cloudenv.clusters.drs.strategy'),
          field: 'strategy',
          hideField: true,
          message: row => this.$te(`cloudenv.clusters.drs.strategy.${row.strategy}`) ? this.$t(`cloudenv.clusters.drs.strategy.${row.strategy}`) : row.strategy,
          slotCallback: row => this.$te(`cloudenv.clusters.drs.strategy.${row.strategy}`) ? this.$t(`cloudenv.clusters.drs.strategy.${row.strategy}`) : row.strategy,
        }),
        // {
        //   title: this.$t('compute.text_929'),
        //   field: '_i18n.action',
        //   minWidth: 80,
        //   showOverflow: 'ellipsis',
        //   slots: {
        //     default: ({ row }) => {
        //       const action = get(row, '_i18n.action', row.action)
        //       return [
        //         <list-body-cell-wrap copy field='_i18n.action' row={row} hideField={true} message={action}>
        //           {action}
        //           <a-button
        //             type="link"
        //             icon="filter"
        //             size="small"
        //             slot="appendActions"
        //             onClick={ () => {
        //               this.list.updateFilter({
        //                 key: 'action',
        //                 value: [row.action],
        //                 items: [
        //                   { key: row.action, label: action },
        //                 ],
        //               })
        //             } } />
        //         </list-body-cell-wrap>,
        //       ]
        //     },
        //   },
        // },
        {
          title: this.$t('table.title.action_result'),
          field: 'success',
          width: 80,
          slots: {
            default: ({ row }) => {
              const txt = row.success ? this.$t('common_159') : this.$t('common_160')
              const color = row.success ? '#67C23A' : '#F56C6C'
              return [<span style={{ color }}>{ txt }</span>]
            },
          },
        },
        {
          field: 'user',
          title: this.$t('table.title.sponsor'),
          minWidth: 80,
          slots: {
            default: ({ row }, h) => {
              const domain = row.project_domain
              const tenant = row.tenant
              const ret = [
                <list-body-cell-wrap style="margin: 3px 0 2px 0" copy field='user' row={row} />,
                <div>
                  <span class='text-weak' title={ this.$t('shareScope.domain') }> { domain } </span>
                  <span class='text-weak' title={ this.$t('shareScope.project') }> { tenant } </span>
                </div>,
              ]
              return ret
            },
          },
        },
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
            text = JSON.stringify(JSON.parse(row.notes), null, 4)
          } catch (e) {
            text = row.notes
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
    handleOpenServerSidepage (row, tab) {
      this.initSidePageTab(tab)
      this.sidePageTriggerHandle(this, 'VmInstanceSidePage', {
        id: row.guest_id,
        resource: 'servers',
      }, {
        list: this.list,
      })
    },
    handleOpenSidepage (id, tab) {
      this.initSidePageTab(tab)
      this.sidePageTriggerHandle(this, 'HostSidePage', {
        id: id,
        resource: 'hosts',
        currentTab: 'host-list',
      }, {
        list: this.list,
      })
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
.drs-list{
  position: relative;
  padding-bottom: 20px;
}
</style>
