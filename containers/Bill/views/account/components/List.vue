<template>
  <page-list
    :list="list"
    :columns="columns" />
</template>

<script>
import ColumnsMixin from '../mixins/columns'
import currencyRequest from '@Bill/mixins/currencyRequest'
import { getNameFilter, getBrandFilter } from '@/utils/common/tableFilter'
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'

export default {
  name: 'BillAccountsList',
  mixins: [WindowsMixin, currencyRequest, ListMixin, ColumnsMixin],
  props: {
    id: String,
    getParams: {
      type: Object,
      default: () => ({ account_id: 'accountList', details: true }),
    },
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'bill_balances',
        apiVersion: 'v1',
        getParams: this.getParams,
        steadyStatus: ['connected', 'disconnected', 'init', 'delete_failed', 'deleted'],
        filterOptions: {
          name: getNameFilter(),
          brand: getBrandFilter(),
        },
      }),
      exportDataOptions: {
        items: [
          { label: this.$t('bill.text_88'), key: 'account_name' },
          { label: this.$t('bill.text_89'), key: 'status' },
          { label: this.$t('bill.text_81'), key: 'platform_brand' },
          { label: this.$t('bill.text_90'), key: 'balance' },
        ],
      },
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.list.getParams = { ...this.list.getParams, ...this.currencyParams }
      this.list.fetchData()
    },
    handleOpenSidepage (row) {
      this.sidePageTriggerHandle(this, 'BillAccountSidePage', {
        id: row.id,
        resource: () => {
          return {
            data: row,
          }
        },
      }, {
        list: this.list,
      })
    },
  },
}
</script>
