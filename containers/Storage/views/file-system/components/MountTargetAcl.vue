<template>
  <page-list
    :list="list"
    :columns="columns"
    :single-actions="singleActions"
    :group-actions="groupActions" />
</template>

<script>
import {
  getStatusTableColumn,
  // getTimeTableColumn,
} from '@/utils/common/tableColumn'
import { getRwAccessTypeColumn, getUserAccessTypeColumn, getRootUserAccessTypeColumn } from '../mixins/columns'
import ListMixin from '@/mixins/list'
import expectStatus from '@/constants/expectStatus'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'MountTargetAclList',
  mixins: [WindowsMixin, ListMixin],
  props: {
    id: {
      type: String,
      required: true,
    },
    getParams: {
      type: [Function, Object],
    },
  },
  data () {
    // const validate = this.id !== 'default'
    const validate = true
    return {
      list: this.$list.createList(this, {
        resource: 'mount_target_acls',
        // getParams: {
        //   // order: 'desc',
        //   // order_by: 'priority',
        //   file_system_id: this.id,
        // },
        getParams: this.getParams,
        steadyStatus: Object.values(expectStatus.nas).flat(),
      }),
      columns: [
        {
          field: 'source',
          title: this.$t('storage.access.group.rule.source'),
          minWidth: 30,
          showOverflow: 'ellipsis',
        },
        getStatusTableColumn({ statusModule: 'mountTargetAcl' }),
        getRwAccessTypeColumn(),
        getUserAccessTypeColumn(),
        getRootUserAccessTypeColumn(),
        // {
        //   field: 'priority',
        //   title: this.$t('storage.access.group.rule.priority'),
        // },
        {
          field: 'description',
          title: this.$t('compute.text_312'),
          slots: {
            default: ({ row }, h) => {
              const ret = []
              ret.push(h('list-body-cell-wrap', {
                props: {
                  edit: true,
                  copy: true,
                  field: 'description',
                  row,
                  onManager: this.onManager,
                  formRules: [],
                },
              }))
              return ret
            },
          },
        },
      ],
      singleActions: [
        {
          label: this.$t('common.action.edit'),
          // permission: 'access_group_rules_update',
          action: obj => {
            this.createDialog('MountTargetAclEditDialog', {
              data: [obj],
              title: this.$t('common.action.edit'),
              columns: this.columns,
              onManager: this.onManager,
              refresh: this.refresh,
            })
          },
          meta: () => {
            const ret = {
              validate,
            }
            if (!validate) {
              ret.tooltip = this.$t('storage.default.access.group.can.not.edit.rules')
            }
            return ret
          },
        },
        {
          label: this.$t('common.action.delete'),
          // permission: 'access_group_rules_delete',
          action: obj => {
            this.createDialog('DeleteResDialog', {
              vm: this,
              data: [obj],
              columns: this.columns,
              title: this.$t('storage.text_36'),
              name: this.$t('storage.xgfs.nfs.share.acl.rule'),
              onManager: this.onManager,
              refresh: this.refresh,
            })
          },
          meta: (obj) => {
            const ret = {
              validate,
            }
            if (!validate) {
              ret.tooltip = this.$t('storage.default.access.group.can.not.delete.rules')
            }
            return ret
          },
        },
      ],
      groupActions: [
        {
          label: this.$t('common.action.create'),
          permission: 'access_group_rules_create',
          action: () => {
            this.createDialog('MountTargetAclEditDialog', {
              title: this.$t('common.action.create'),
              data: [{}],
              onManager: this.onManager,
              refresh: this.refresh,
              file_system_id: this.id,
            })
          },
          meta: () => {
            const ret = {
              buttonType: 'primary',
              validate,
            }
            if (!validate) {
              ret.tooltip = this.$t('storage.default.access.group.can.not.add.rules')
            }
            return ret
          },
        },
        // {
        //   label: this.$t('common.action.delete'),
        //   permission: 'access_group_rules_delete',
        //   action: () => {
        //     this.createDialog('DeleteResDialog', {
        //       vm: this,
        //       data: this.list.selectedItems,
        //       columns: this.columns,
        //       title: this.$t('common.action.delete'),
        //       name: this.$t('dictionary.access_group_rule'),
        //       onManager: this.onManager,
        //     })
        //   },
        //   meta: () => {
        //     const ret = {
        //       validate,
        //     }
        //     if (!validate) {
        //       ret.tooltip = this.$t('storage.default.access.group.can.not.delete.rules')
        //     }
        //     return ret
        //   },
        // },
      ],
    }
  },
  created () {
    this.list.fetchData()
  },
}
</script>
