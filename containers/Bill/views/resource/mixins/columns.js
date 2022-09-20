import { CHARGE_TYPE, PRICE_UNIT, PRECISION } from '@Bill/constants'
import {
  getBrandTableColumn,
  getProjectTableColumn,
} from '@/utils/common/tableColumn'
import { numerify } from '@/filters'
import i18n from '@/locales'
import { mathRoundFix } from '@/utils/utils'

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
        field: 'res_type',
        title: i18n.t('bill.text_73'),
        formatter: ({ row }) => this.$te(`dictionary.${row.res_type}`) ? this.$t(`dictionary.${row.res_type}`) : row.res_type,
      },
      {
        field: 'usage',
        title: i18n.t('bill.text_131'),
        formatter: ({ row }) => {
          let unit = row.price_unit ? row.price_unit.replace(/\//g, '*') : ''
          unit = unit.startsWith('*') ? unit.substring(1) : unit
          const unitC = PRICE_UNIT[unit] || unit
          const usage = mathRoundFix(row.total_usage, PRECISION) // 保留6位小数，不够也不需要补0
          return `${usage} ${unitC}`
        },
      },
      // {
      //   field: 'usage_type',
      //   title: i18n.t('bill.text_138'),
      // },
      {
        field: 'amount',
        title: i18n.t('bill.text_125'),
        sortable: true,
        align: 'left',
        // headerAlign: 'right',
        slots: {
          default: ({ row }) => {
            const money = numerify(row.total_amount, '0,0.000000')
            return [<list-body-cell-wrap copy row={ row } field='amount' hideField title={ row.total_amount }><div class="text-left">{this.currencySign}{ money }</div></list-body-cell-wrap>]
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
        hidden: this.isOperation,
      },
    ]
  },
  computed: {
    isOperation () {
      return process.env.VUE_APP_PLATFORM === 'operation'
    },
  },
}
