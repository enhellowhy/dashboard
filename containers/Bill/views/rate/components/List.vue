<template>
  <page-list
    :list="list"
    :columns="columns"
    :group-actions="groupActions"
    ref="pagelist"
    :export-data-options="exportDataOptions" />
</template>

<script>
import ColumnsMixin from '../mixins/columns'
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'

export default {
  name: 'BillRateList',
  mixins: [WindowsMixin, ListMixin, ColumnsMixin],
  props: {
    id: String,
    cloudEnv: {
      type: String,
    },
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'rates',
        apiVersion: 'v1',
        getParams: {
          details: true,
          action: 'querygroup',
          admin: this.$store.getters.isAdminMode,
          res_type: this.cloudEnv,
        },
      }),
      groupActions: [
        {
          label: this.$t('compute.perform_create'),
          action: () => {
            this.createDialog('CreateRateDialog', {
              title: this.$t('compute.perform_create'),
              onManager: this.onManager,
            })
          },
          meta: () => {
            const validate = this.cloudEnv === 'baremetal'
            const meta = {
              buttonType: 'primary',
              validate,
              tooltip: validate ? '' : this.$t('bill.rate_disable_tooltip'),
            }
            return meta
          },
        },
        // {
        //   label: this.$t('bill.text_258'),
        //   action: () => {
        //     this.list.onManager('get', {
        //       managerArgs: {
        //         id: 'sync',
        //       },
        //     })
        //   },
        //   meta: () => {
        //     return {
        //       buttonType: 'primary',
        //     }
        //   },
        // },
      ],
    }
  },
  computed: {
    exportDataOptions () {
      const exportMaps = {
        vm: [
          { key: 'res_type', label: this.$t('bill.text_88') },
          { key: 'medium_type', label: this.$t('table.title.disk_medium_type') },
          { key: 'storage_type', label: this.$t('table.title.storage_type') },
          { key: 'rate_text', label: this.$t('bill.text_159') },
          { key: 'unit', label: this.$t('bill.text_111') },
          { key: 'duration', label: this.$t('bill.duration') },
          { key: 'effective_date', label: this.$t('bill.text_162') },
          { key: 'until_time', label: this.$t('scope.text_791') },
        ],
        baremetal: [
          { key: 'brand', label: this.$t('bill.text_146') },
          { key: 'model', label: this.$t('bill.text_148') },
          { key: 'spec', label: this.$t('bill.text_150') },
          { key: 'rate_text', label: this.$t('bill.text_159') },
          { key: 'unit', label: this.$t('bill.text_111') },
          { key: 'duration', label: this.$t('bill.duration') },
          { key: 'effective_date', label: this.$t('bill.text_162') },
          { key: 'until_time', label: this.$t('scope.text_791') },
        ],
        gpu: [
          { key: 'brand', label: this.$t('bill.text_146') },
          { key: 'model', label: this.$t('bill.text_148') },
          { key: 'rate_text', label: this.$t('bill.text_159') },
          { key: 'unit', label: this.$t('bill.text_111') },
          { key: 'duration', label: this.$t('bill.duration') },
          { key: 'effective_date', label: this.$t('bill.text_162') },
          { key: 'until_time', label: this.$t('scope.text_791') },
        ],
      }
      return {
        items: exportMaps[this.cloudEnv],
        export: 'custom',
        exportType: {
          custom: { label: this.$t('common_96'), key: 'custom' },
        },
      }
    },
  },
  watch: {
    cloudEnv (val) { // 这里指 虚拟资源费率、裸金属服务器费率、GPU卡费率
      this.list.getParams = { ...this.list.getParams, res_type: val }
      this.fetchData()
    },
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.list.fetchData()
    },
    handleOpenSidepage (row) {
      this.sidePageTriggerHandle(this, 'BillRateSidePage', {
        id: row.id,
        resource: () => {
          return {
            data: row,
          }
        },
        type: this.cloudEnv,
      }, {
        list: this.list,
      })
    },
  },
}
</script>
