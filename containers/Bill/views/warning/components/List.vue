<template>
  <page-list
    show-tag-columns
    :list="list"
    :columns="columns"
    :single-actions="singleActions"
    :group-actions="groupActions" />
</template>

<script>
import * as R from 'ramda'
import { mapGetters } from 'vuex'
import ColumnsMixin from '../mixins/columns'
import SingleActionsMixin from '../mixins/singleActions'
import { getBrandFilter } from '@/utils/common/tableFilter'
import ListMixin from '@/mixins/list'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'BillWarningList',
  mixins: [WindowsMixin, ListMixin, ColumnsMixin, SingleActionsMixin],
  props: {
    id: String,
    getParams: {
      type: [Function, Object],
    },
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'costalerts',
        apiVersion: 'v1',
        getParams: this.getParam,
        filterOptions: {
          brand: getBrandFilter(),
          cost_type: {
            label: this.$t('bill.text_229'),
            dropdown: true,
            items: Object.keys(this.$t('billWarningCostTypes')).map(k => {
              return { label: this.$t('billWarningCostTypes')[k], key: k }
            }),
          },
        },
      }),
      groupActions: [
        {
          label: this.$t('bill.text_193'),
          permission: 'costalerts_create',
          action: () => {
            this.$router.push({
              name: 'BillWarningForm',
            })
          },
          meta: () => {
            return {
              buttonType: 'primary',
            }
          },
        },
        {
          label: this.$t('bill.text_167'),
          permission: 'costalerts_delete',
          action: () => {
            this.createDialog('DeleteResDialog', {
              name: this.$t('bill.text_230'),
              title: this.$t('bill.text_167'),
              vm: this,
              data: this.list.selectedItems,
              columns: this.columns,
              onManager: this.onManager,
            })
          },
          meta: () => this.$getDeleteResult(this.list.selectedItems),
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['isAdminMode']),
  },
  created () {
    this.initSidePageTab('agent-detail')
    this.list.fetchData()
  },
  methods: {
    getParam () {
      const ret = {
        ...(R.is(Function, this.getParams) ? this.getParams() : this.getParams),
      }
      return ret
    },
    handleOpenSidepage (row) {
      console.log(this.$store)
      this.sidePageTriggerHandle(this, 'AgentSidePage', {
        id: row.id,
        resource: 'loadbalanceragents',
        getParams: this.getParam,
      }, {
        list: this.list,
      })
    },
  },
}
</script>
