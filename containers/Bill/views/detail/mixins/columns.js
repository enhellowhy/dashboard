import { CHARGE_TYPE, PRICE_UNIT, PRECISION } from '@Bill/constants'
import {
  getBrandTableColumn,
  getProjectTableColumn,
} from '@/utils/common/tableColumn'
import { numerify } from '@/filters'
import i18n from '@/locales'
import { mathRoundFix } from '@/utils/utils'
import { getFieldCn } from '@Bill/views/rate/utils'

export default {
  created () {
    this.columns = [
      {
        field: 'bill_id',
        title: i18n.t('bill.text_134'),
        slots: {
          default: ({ row }) => {
            return [
              <div class='text-truncate'>
                <list-body-cell-wrap copy row={ row } field='bill_id' title={ row.bill_id } />
              </div>,
            ]
          },
        },
      },
      {
        field: 'res_type',
        title: i18n.t('bill.text_73'),
        formatter: ({ row }) => this.$te(`dictionary.${row.res_type}`) ? this.$t(`dictionary.${row.res_type}`) : row.res_type,
      },
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
        field: 'spec',
        title: i18n.t('storage.text_38'),
        align: 'left',
        formatter: ({ row }) => {
          switch (row.res_type) {
            case 'bucket':
              return getFieldCn(row.spec.split(' ')[0])
            case 'filesystem':
              return getFieldCn(row.spec.split(' ')[0])
            case 'disk':
              return getFieldCn(row.spec.split(' ')[0])
            default:
              return '-'
          }
        },
      },
      {
        field: 'usage',
        title: i18n.t('bill.text_131'),
        align: 'left',
        formatter: ({ row }) => {
          let unit = row.price_unit ? row.price_unit.replace(/\//g, '*') : ''
          unit = unit.startsWith('*') ? unit.substring(1) : unit
          const unitC = PRICE_UNIT[unit] || unit
          const usage = mathRoundFix(row.usage, PRECISION) // 保留6位小数，不够也不需要补0
          return `${usage} ${unitC}`
        },
      },
      // {
      //   field: 'usage_type',
      //   title: i18n.t('bill.text_138'),
      //   minWidth: 100,
      // },
      {
        field: 'item_rate',
        title: i18n.t('bill.text_37'),
        align: 'left',
        headerAlign: 'left',
        slots: {
          default: ({ row }) => {
            const money = numerify(row.item_rate, '0,0.000000')
            return [<list-body-cell-wrap copy row={ row } field='item_rate' hideField title={ row.item_rate }><div class="text-left">{this.currencySign}{ money }</div></list-body-cell-wrap>]
          },
        },
      },
      {
        field: 'item_fee',
        title: i18n.t('bill.text_125'),
        align: 'left',
        // headerAlign: 'left',
        slots: {
          default: ({ row }) => {
            const money = numerify(row.item_fee, '0,0.000000')
            return [<list-body-cell-wrap copy row={ row } field='item_fee' hideField title={ row.item_fee }><div class="text-left">{this.currencySign}{ money }</div></list-body-cell-wrap>]
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
      {
        field: 'start_time',
        title: i18n.t('bill.text_136'),
        minWidth: 100,
        // formatter: ({ row }) => `${this.$moment(row.start_time).format(i18n.t('bill.text_137'))} - ${this.$moment(row.end_time).format(i18n.t('bill.text_137'))}`,
        formatter: ({ row }) => `${this.$moment(row.start_time).format(i18n.t('bill.text_778'))} - ${this.$moment(row.end_time).format(i18n.t('bill.text_778'))}`,
      },
      getProjectTableColumn({ hidden: this.$store.getters.isProjectMode, minWidth: 'auto', field: 'project' }),
      {
        field: 'region',
        title: i18n.t('bill.text_83'),
        hidden: this.isOperation,
      },
      // {
      //   field: 'end_time',
      //   title: '使用时长',
      //   formatter: ({ row }) => this.$moment(row.start_time).from(row.end_time, true),
      // },
    ]
  },
  computed: {
    isOperation () {
      return process.env.VUE_APP_PLATFORM === 'operation'
    },
  },
}
