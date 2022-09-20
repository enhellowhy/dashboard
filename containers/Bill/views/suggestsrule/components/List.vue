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
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'

export default {
  name: 'SuggestsRuleList',
  mixins: [WindowsMixin, ListMixin, ColumnsMixin, SingleActionsMixin],
  props: {
    id: String,
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'suggestsysrules',
        apiVersion: 'v1',
        getParams: { details: true },
        filterOptions: {
          name: {
            label: this.$t('bill.text_88'),
            filter: true,
            formatter: val => {
              return `name.contains("${val}")`
            },
          },
        },
      }),
      exportDataOptions: {
        items: [
          { label: 'ID', key: 'id' },
          { label: this.$t('bill.text_88'), key: 'name' },
          { label: this.$t('bill.text_191'), key: 'enabled' },
          { label: this.$t('bill.text_174'), key: 'setting' },
          { label: this.$t('bill.text_192'), key: 'updated_at' },
          { label: this.$t('bill.text_189'), key: 'period' },
          { label: this.$t('bill.text_198'), key: 'time_from' },
        ],
      },
      groupActions: [
        // {
        //   label: this.$t('bill.text_193'),
        //   permission: 'suggestsysrules_create',
        //   action: () => {
        //     this.createDialog('SuggestRuleCreateDialog', {
        //       columns: this.columns,
        //       data: this.list.selectedItems,
        //       onManager: this.onManager,
        //     })
        //   },
        //   meta: () => {
        //     return {
        //       buttonType: 'primary',
        //     }
        //   },
        // },
        // {
        //   label: this.$t('common.batchAction'),
        //   actions: () => {
        //     return [
        //       {
        //         label: this.$t('bill.text_194'),
        //         action: () => {
        //           this.list.batchPerformAction('enable', null, this.list.steadyStatus)
        //         },
        //         meta: () => {
        //           const validate = this.list.selectedItems.length && this.list.selectedItems.some(item => !item.enabled)
        //           return {
        //             validate,
        //             tooltip: !validate ? this.$t('bill.text_195') : '',
        //           }
        //         },
        //       },
        //       {
        //         label: this.$t('bill.text_196'),
        //         action: () => {
        //           this.createDialog('RuleSetDisabledDialog', {
        //             columns: this.columns,
        //             data: this.list.selectedItems,
        //             onManager: this.onManager,
        //           })
        //         },
        //         meta: () => {
        //           const validate = this.list.selectedItems.length && this.list.selectedItems.some(item => item.enabled)
        //           return {
        //             validate,
        //             tooltip: !validate ? this.$t('bill.text_197') : '',
        //           }
        //         },
        //       },
        //       {
        //         label: this.$t('bill.text_167'),
        //         action: () => {
        //           this.createDialog('DeleteResDialog', {
        //             vm: this,
        //             data: this.list.selectedItems,
        //             columns: this.columns,
        //             title: this.$t('bill.text_167'),
        //             name: this.$t('bill.text_174'),
        //             onManager: this.onManager,
        //           })
        //         },
        //         meta: () => {
        //           return {
        //             validate: this.list.allowDelete(),
        //           }
        //         },
        //       },
        //     ]
        //   },
        // },
        {
          label: this.$t('bill.text_194'),
          action: () => {
            this.list.batchPerformAction('enable', null, this.list.steadyStatus)
          },
          meta: () => {
            const validate = this.list.selectedItems.length && this.list.selectedItems.some(item => !item.enabled)
            return {
              validate,
              tooltip: !validate ? this.$t('bill.text_195') : '',
            }
          },
        },
        {
          label: this.$t('bill.text_196'),
          action: () => {
            this.createDialog('RuleSetDisabledDialog', {
              columns: this.columns,
              data: this.list.selectedItems,
              onManager: this.onManager,
            })
          },
          meta: () => {
            const validate = this.list.selectedItems.length && this.list.selectedItems.some(item => item.enabled)
            return {
              validate,
              tooltip: !validate ? this.$t('bill.text_197') : '',
            }
          },
        },
      ],
    }
  },
  computed: mapGetters(['isAdminMode']),
  created () {
    this.initSidePageTab('suggestsrule-detail')
    this.list.fetchData()
  },
  methods: {
    handleOpenSidepage (row) {
      this.sidePageTriggerHandle(this, 'SuggestsruleSidePage', {
        id: row.id,
        resource: 'suggestsysrules',
        apiVersion: 'v1',
        getParams: { details: true },
      }, {
        list: this.list,
      })
    },
  },
}
</script>
