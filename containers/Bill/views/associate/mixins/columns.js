import { CHARGE_TYPE, DIC, PRICE_UNIT, PRECISION } from '@Bill/constants'
import {
  getBrandTableColumn,
  getProjectTableColumn,
} from '@/utils/common/tableColumn'
import { numerify } from '@/filters'
import i18n from '@/locales'
import { mathRoundFix, sizestrWithUnit } from '@/utils/utils'

export default {
  created () {
    this.columns = [
      {
        field: 'resource_name',
        title: i18n.t('bill.text_127'),
        sortable: true,
        slots: {
          default: ({ row }) => {
            return [
              <div class='text-truncate'>
                <list-body-cell-wrap copy row={ row } field='resource_name' title={ row.resource_name } />
                <list-body-cell-wrap copy row={ row } field='resource_id' hideField title={ row.resource_id }><span style="color: #999;">{ row.resource_id }</span></list-body-cell-wrap>
              </div>,
            ]
          },
        },
      },
      {
        field: 'resource_type',
        title: i18n.t('bill.resource_type'),
        formatter: ({ row }) => {
          if (this.$te(`bill_resource_type.${row.resource_type}`)) {
            return this.$t(`bill_resource_type.${row.resource_type}`)
          }
          return row.resource_type
        },
      },
      {
        field: 'spec',
        title: i18n.t('bill.text_121'),
        formatter: ({ row }) => {
          if (row.resource_type === 'baremetal') {
            const ret = []
            const cpu_pair = row.spec.split('/')[0]
            const cpu = cpu_pair.split(':')[1]
            const mem_pair = row.spec.split('/')[1]
            const mem = mem_pair.split(':')[1]
            ret.push(i18n.t('compute.text_292', [cpu]))
            ret.push(this.$t('compute.text_293', [sizestrWithUnit(mem.substr(0, mem.length - 1), 'M', 1024)]))
            return ret.join('、')
          } else {
            return row.spec
          }
        },
      },
      {
        field: 'amount_table',
        title: i18n.t('bill.text_128'),
        type: 'expand',
        slots: {
          default: ({ row }) => {
            if (row.currency === 'USD') return i18n.t('bill.text_257', [numerify(row.total_amount, '0,0.000000')])
            return i18n.t('bill.text_129', [numerify(row.total_amount, '0,0.000000')])
          },
          content: ({ row }) => {
            const columns = [
              {
                field: 'usage_type',
                title: i18n.t('bill.text_73'),
                formatter: ({ row }) => {
                  if (this.$te(`bill_resource_type.${row.usage_type}`)) {
                    return this.$t(`bill_resource_type.${row.usage_type}`)
                  }
                  return row.usage_type
                },
              },
              {
                field: 'spec',
                title: i18n.t('bill.text_121'),
                formatter: ({ row }) => {
                  if (row.usage_type === 'disk') {
                    const spec_type = DIC[row.spec.split(' ')[0]]
                    const spec_size = row.spec.split(' ')[1]
                    return `${spec_type} ${spec_size}`
                  }
                  if (row.resource_type === 'baremetal') {
                    const ret = []
                    const cpu_pair = row.spec.split('/')[0]
                    const cpu = cpu_pair.split(':')[1]
                    const mem_pair = row.spec.split('/')[1]
                    const mem = mem_pair.split(':')[1]
                    ret.push(i18n.t('compute.text_292', [cpu]))
                    ret.push(this.$t('compute.text_293', [sizestrWithUnit(mem.substr(0, mem.length - 1), 'M', 1024)]))
                    return ret.join('、')
                  }
                  return row.spec
                },
              },
              {
                field: 'usage',
                title: i18n.t('bill.text_131'),
                // align: 'right',
                formatter: ({ row }) => {
                  let unit = row.price_unit ? row.price_unit.replace(/\//g, '*') : ''
                  unit = unit.startsWith('*') ? unit.substring(1) : unit
                  const unitC = PRICE_UNIT[unit] || unit
                  const usage = mathRoundFix(row.total_usage, PRECISION) // 保留6位小数，不够也不需要补0
                  return `${usage} ${unitC}`
                },
              },
              {
                field: 'rate',
                title: i18n.t('bill.text_37'),
                formatter: ({ row }) => {
                  const currency = this.currencySign === '￥' ? this.$t('bill.text_29') : this.$t('bill.text_31')
                  const price_unit = PRICE_UNIT[row.price_unit] || row.price_unit
                  return `${mathRoundFix(row.rate, PRECISION, true)} ${currency}${price_unit}`
                },
              },
              {
                field: 'total_amount',
                title: i18n.t('bill.text_123'),
                formatter: ({ row }) => {
                  return `${this.currencySign}${mathRoundFix(row.total_amount, PRECISION, true)}`
                },
              },
              {
                field: 'discount_amount',
                title: i18n.t('bill.text_124'),
                formatter: ({ row }) => {
                  return `${this.currencySign}${mathRoundFix(row.discount_amount, PRECISION, true)}`
                },
              },
              {
                field: 'amount',
                title: i18n.t('bill.text_125'),
                formatter: ({ row }) => {
                  return `${this.currencySign}${mathRoundFix(row.total_amount, PRECISION, true)}`
                },
              },
            ]
            return <vxe-grid size="mini" border columns={columns} data={row.content} />
          },
        },
      },
      // {
      //   field: 'reserved',
      //   title: i18n.t('bill.text_122'),
      //   formatter: ({ row }) => row.reserved ? i18n.t('bill.text_132') : i18n.t('bill.text_133'),
      // },
      {
        // field: 'gross_amount',
        field: 'total_amount',
        title: i18n.t('bill.text_123'),
        // align: 'right',
        // headerAlign: 'right',
        slots: {
          default: ({ row }) => {
            const money = numerify(row.total_amount, '0,0.000000')
            return [<list-body-cell-wrap copy row={ row } field='total_amount' hideField title={ row.total_amount }><div class="text-left">{this.currencySign}{ money }</div></list-body-cell-wrap>]
          },
        },
      },
      {
        field: 'discount_amount',
        title: i18n.t('bill.text_124'),
        // align: 'right',
        // headerAlign: 'right',
        slots: {
          default: ({ row }) => {
            const money = numerify(row.discount_amount, '0,0.000000')
            return [<list-body-cell-wrap copy row={ row } field='discount_amount' hideField title={ row.discount_amount }><div class="text-left">{this.currencySign}{ money }</div></list-body-cell-wrap>]
          },
        },
      },
      {
        field: 'amount',
        title: i18n.t('bill.text_125'),
        // headerAlign: 'right',
        sortable: true,
        slots: {
          default: ({ row }) => {
            const money = numerify(row.total_amount, '0,0.000000')
            return [<list-body-cell-wrap copy row={ row } field='total_amount' hideField title={ row.total_amount }><div class="text-left">{this.currencySign}{ money }</div></list-body-cell-wrap>]
          },
        },
      },
      {
        field: 'charge_type',
        title: i18n.t('bill.text_84'),
        formatter: ({ row }) => CHARGE_TYPE[row.charge_type] || row.charge_type,
      },
      getBrandTableColumn(),
      // {
      //   field: 'account',
      //   title: i18n.t('bill.text_60'),
      //   slots: {
      //     default: ({ row }) => {
      //       const ret = []
      //       ret.push(
      //         <list-body-cell-wrap hide-field copy field='account' row={row}>
      //           <span style={{ color: '#0A1F44' }}>{ row.account }</span>
      //         </list-body-cell-wrap>,
      //       )
      //       if (row.cloudprovider_name) {
      //         ret.push(
      //           <list-body-cell-wrap hide-field copy field='cloudprovider_name' row={row}>
      //             <span style={{ color: '#53627C' }}>{ row.cloudprovider_name }</span>
      //           </list-body-cell-wrap>,
      //         )
      //       }
      //       return ret
      //     },
      //   },
      // },
      getProjectTableColumn({ hidden: this.$store.getters.isProjectMode, minWidth: 'auto', field: 'project' }),
      {
        field: 'region',
        title: i18n.t('bill.text_83'),
      },
    ]
  },
}
