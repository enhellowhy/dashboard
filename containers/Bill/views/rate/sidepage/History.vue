<template>
  <page-list
    :list="list"
    :columns="columns"
    :singleActions="singleActions"
    :group-actions="groupActions" />
</template>

<script>
import { DURATION, RATE_UNIT } from '@Bill/constants'
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'

const toCN = v => {
  const unit = RATE_UNIT[v]
  return unit || v
}

export default {
  name: 'BillRateHistoryList',
  mixins: [WindowsMixin, ListMixin],
  props: {
    data: {
      type: Object,
      required: true,
    },
    params: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: 'BillRateHistoryList',
        resource: 'rates',
        apiVersion: 'v1',
        getParams: {
          details: true,
          id: this.data.id,
          res_type: this.data.res_type,
          model: this.data.model,
          sub_res_type: this.data.sub_res_type,
          action: 'queryhistory',
        },
      }),
      columns: [
        {
          field: 'rate',
          title: this.$t('bill.text_37'),
          formatter: ({ row }) => {
            if (+row.rate === -1) {
              return this.$t('bill.text_164')
            }
            const rateNum = Number(row.rate_text)
            const rate = rateNum.toFixed(5)
            if (row.res_type === 'outer_network_card') {
              return this.$t('bill.text_160', [rate, toCN(row.unit)])
            } else if (row.res_type === 'inner_network_card') {
              return this.$t('bill.text_160', [rate, toCN(row.unit)])
            }
            return this.$t('bill.text_161', [rate, DURATION[row.duration], toCN(row.unit)])
          },
        },
        {
          field: 'effective_date',
          title: this.$t('bill.text_162'),
          formatter: ({ row }) => {
            const date = row.effective_date.replace('TZ', '')
            const until_date = row.until_date ? row.until_date.replace('TZ', '') : null
            if (until_date) {
              return this.$t('bill.text_261', [this.$moment(date).format('YYYY-MM-DD'), this.$moment(until_date).format('YYYY-MM-DD')])
            }
            if (date) {
              return this.$moment(date).format('YYYY-MM-DD')
            }
          },
        },
        {
          field: 'effective_flag',
          title: this.$t('bill.text_89'),
          showOverflow: 'title',
          slots: {
            default: ({ row }, h) => {
              let s = ''
              if (+new Date(row.effective_date.replace('TZ', '')) > +new Date()) {
                s = 'is_not_effective'
              } else {
                if (row.effective_flag === 'NO') {
                  s = 'is_expire'
                } else {
                  s = 'is_effective'
                }
              }
              return [
                <div class='text-truncate'>
                  <status status={ s } statusModule="billrate" />
                </div>,
              ]
            },
          },
        },
      ],
      singleActions: [
        {
          label: this.$t('bill.text_165'),
          action: obj => {
            this.createDialog('BillRateSetDialog', {
              data: [obj],
              columns: this.columns,
              onManager: this.onManager,
              refresh: this.refresh,
              type: this.params.options.type,
            })
          },
          meta: obj => {
            let validate = false
            let tooltip = this.$t('bill.text_166')
            if (obj.effective_date) {
              if (+new Date(obj.effective_date.replace('TZ', '')) > +new Date() && obj.effective_flag === 'NO') {
                validate = true
                tooltip = ''
              }
            }
            return {
              validate,
              tooltip,
            }
          },
        },
        {
          label: this.$t('bill.text_167'),
          action: obj => {
            this.createDialog('DeleteResDialog', {
              data: [obj],
              columns: this.columns,
              onManager: this.onManager,
              title: this.$t('bill.text_167'),
              name: this.$t('bill.text_37'),
              success: () => {
                this.destroySidePages()
              },
            })
          },
          meta: obj => {
            let validate = false
            let tooltip = this.$t('bill.text_168')
            if (obj.effective_date) {
              if (+new Date(obj.effective_date.replace('TZ', '')) > +new Date() && obj.effective_flag === 'NO') {
                validate = true
                tooltip = ''
              }
            }
            return {
              validate,
              tooltip,
            }
          },
        },
      ],
      groupActions: [
        {
          label: this.$t('bill.text_169'),
          action: () => {
            this.createDialog('BillRateSetDialog', {
              data: [this.data],
              columns: this.columns,
              onManager: this.onManager,
              refresh: this.refresh,
              type: this.params.options.type,
              isCreate: true,
            })
          },
          meta: () => {
            return {
              buttonType: 'primary',
            }
          },
        },
      ],
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.list.fetchData()
    },
  },
}
</script>
