<template>
  <page-list
    :list="list"
    :columns="columns"
    :group-actions="groupActions"
    :single-actions="singleActions"
    :export-data-options="exportDataOptions" />
</template>

<script>
import * as R from 'ramda'
import ColumnsMixin from '../mixins/columns'
import SingleActionsMixin from '../mixins/singleActions'
import { RuleTypes } from '@Bill/constants'
import expectStatus from '@/constants/expectStatus'
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'
import { getBrandFilter, getTenantFilter, getAccountFilter, getDomainFilter } from '@/utils/common/tableFilter'
import { arrayToObj } from '@/utils/utils'

const RuleTypesMap = arrayToObj(RuleTypes, 'key')

export default {
  name: 'SuggestAlertList',
  mixins: [WindowsMixin, ListMixin, ColumnsMixin, SingleActionsMixin],
  props: {
    id: String,
    cloudEnv: {
      type: String,
    },
    getParams: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: this.id,
        apiVersion: 'v1',
        resource: 'suggestsysalerts',
        getParams: this.getParam,
        steadyStatus: Object.values(expectStatus.suggestsysalert).flat(),
        filterOptions: {
          name: {
            label: this.$t('bill.text_72'),
            filter: true,
            formatter: val => {
              return `name.contains("${val}")`
            },
          },
          brand: getBrandFilter('compute_engine_brands'),
          projects: getTenantFilter(),
          cloudaccount: getAccountFilter(),
          project_domains: getDomainFilter(),
          type: {
            label: this.$t('bill.text_173'),
            filter: true,
            dropdown: true,
            distinctField: {
              type: 'field',
              key: 'type',
            },
            formatter: val => {
              return `type.contains("${val}")`
            },
            mapper: list => {
              return list.map(({ key, label }) => {
                return {
                  key,
                  label: RuleTypesMap[key] ? RuleTypesMap[key].label : label,
                }
              })
            },
          },
        },
        hiddenColumns: ['name', 'type', 'account'],
      }),
      exportDataOptions: {
        items: [
          { label: 'ID', key: 'id' },
          { label: this.$t('bill.text_72'), key: 'res_name' },
          { label: this.$t('bill.text_212'), key: 'type' },
          { label: this.$t('bill.text_89'), key: 'status' },
          { label: this.$t('bill.text_174'), key: 'rule_name' },
          { label: this.$t('bill.text_182'), key: 'amount' },
          { label: this.$t('dictionary.project'), key: 'project' },
          { label: this.$t('bill.text_81'), key: 'hypervisor' },
          { label: this.$t('bill.text_60'), key: 'manager' },
          { label: this.$t('bill.text_83'), key: 'region' },
        ],
      },
      groupActions: [],
    }
  },
  watch: {
    cloudEnv (val) {
      this.$nextTick(() => {
        this.list.fetchData(0)
      })
    },
  },
  created () {
    this.initSidePageTab('suggestsalert-detail')
    this.list.fetchData()
  },
  methods: {
    getParam () {
      const ret = {
        ...(R.is(Function, this.getParams) ? this.getParams() : this.getParams),
      }
      if (this.cloudEnv) ret.cloud_env = this.cloudEnv
      return ret
    },
    handleOpenSidepage (row) {
      this.sidePageTriggerHandle(this, 'SuggestsAlertSidePage', {
        id: row.id,
        resource: 'suggestsysalerts',
        apiVersion: 'v1',
        getParams: this.getParam,
      }, {
        list: this.list,
      })
    },
    openSuggestAlertDialog (obj) {
      this.createDialog('SuggestsAlertDeleteDialog', {
        data: [obj],
        columns: this.columns,
        onManager: this.onManager,
      })
    },
  },
}
</script>
