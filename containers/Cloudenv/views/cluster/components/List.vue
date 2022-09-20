<template>
  <page-list
    :list="list"
    :columns="columns"
    :group-actions="groupActions"
    :single-actions="singleActions"
    :export-data-options="exportDataOptions" />
</template>

<script>
import { mapGetters } from 'vuex'
import ColumnsMixin from '../mixins/columns'
import SingleActionsMixin from '../mixins/singleActions'
import { RES_TYPES } from '../utils'
import { getNameFilter, getCreatedAtFilter } from '@/utils/common/tableFilter'
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'

const getParams = { details: true }

export default {
  name: 'ClusterList',
  mixins: [WindowsMixin, ListMixin, ColumnsMixin, SingleActionsMixin],
  props: {
    id: String,
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'clusters',
        getParams,
        filterOptions: {
          name: getNameFilter(),
          resource_type: {
            label: this.$t('cloudenv.text_384'),
            dropdown: true,
            multiple: true,
            items: Object.keys(RES_TYPES).map(key => {
              return { label: RES_TYPES[key], key }
            }),
          },
          created_at: getCreatedAtFilter(),
        },
        hiddenColumns: ['created_at'],
      }),
      exportDataOptions: {
        items: [
          { label: 'ID', key: 'id' },
          { label: this.$t('cloudenv.text_95'), key: 'name' },
          { label: this.$t('cloudenv.text_384'), key: 'resource_type' },
          { label: this.$t('cloudenv.text_417'), key: 'resource_count' },
          { label: this.$t('common.createdAt'), key: 'created_at' },
        ],
      },
      groupActions: [
        {
          label: this.$t('cloudenv.text_104'),
          action: () => {
            this.createDialog('CreateClusterDialog', {
              onManager: this.onManager,
            })
          },
          meta: () => {
            const ret = {
              validate: true,
              tooltip: null,
              buttonType: 'primary',
            }
            if (!this.isAdminMode) {
              ret.validate = false
            }
            return ret
          },
        },
        {
          label: this.$t('table.action.set_tag'),
          action: () => {
            this.createDialog('SetTagDialog', {
              data: this.list.selectedItems,
              columns: this.columns,
              onManager: this.onManager,
              params: {
                resources: 'cluster',
              },
              mode: 'add',
            })
          },
          meta: () => {
            return {
              validate: this.list.selectedItems.length > 0,
            }
          },
        },
        {
          label: this.$t('cloudenv.text_108'),
          action: () => {
            this.createDialog('DeleteResDialog', {
              vm: this,
              data: this.list.selectedItems,
              columns: this.columns,
              title: this.$t('cloudenv.clusters.hosts.delete'),
              name: this.$t('dictionary.hostcluster'),
              onManager: this.onManager,
            })
          },
          meta: () => {
            const ret = {
              validate: this.list.allowDelete(),
              tooltip: null,
            }
            if (!this.isAdminMode) {
              ret.validate = false
            }
            return ret
          },
        },
      ],
    }
  },
  computed: mapGetters(['isAdminMode']),
  created () {
    this.initSidePageTab('cluster-detail')
    this.list.fetchData()
  },
  methods: {
    handleOpenSidepage (row) {
      this.sidePageTriggerHandle(this, 'ClusterSidePage', {
        id: row.id,
        resource: 'clusters',
        getParams,
      }, {
        list: this.list,
      })
    },
  },
}
</script>
