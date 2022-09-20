import {
  getTypeTableColumn,
  getRuleNameTableColumn,
} from '../utils/columns'
import {
  getNameDescriptionTableColumn,
  getProjectTableColumn,
  getBrandTableColumn,
  getAccountTableColumn,
  getRegionTableColumn,
  getStatusTableColumn,
} from '@/utils/common/tableColumn'
import { numerify } from '@/filters'
import i18n from '@/locales'

export default {
  created () {
    this.columns = [
      getNameDescriptionTableColumn({
        field: 'res_name',
        title: this.$t('bill.text_72'),
        onManager: this.onManager,
        hideField: true,
        edit: () => { return false },
        editDesc: () => { return false },
        slotCallback: row => {
          return (
            <side-page-trigger onTrigger={() => this.handleOpenSidepage(row)}>{ row.res_name }</side-page-trigger>
          )
        },
      }),
      getStatusTableColumn({ statusModule: 'suggestsysalert' }),
      getTypeTableColumn(),
      getRuleNameTableColumn(),
      {
        field: 'amount',
        title: i18n.t('bill.text_182'),
        minWidth: 70,
        showOverflow: 'title',
        slots: {
          default: ({ row }, h) => {
            const price = numerify(Math.ceil(row.amount), '0,0.00')
            const currencyUnitMap = {
              CNY: {
                sign: '￥',
                cn: i18n.t('bill.text_29'),
              },
              USD: {
                sign: '$',
                cn: i18n.t('bill.text_31'),
              },
            }
            const currencyUnit = currencyUnitMap[row.currency] ? currencyUnitMap[row.currency].sign : '¥'
            if (!price) {
              return '-'
            }
            return [
              <span class="success-color"><a-icon type="fall" /> {currencyUnit}{ price }</span>,
            ]
          },
        },
      },
      getBrandTableColumn({ filed: 'res_meta.brand' }),
      getAccountTableColumn(),
      getProjectTableColumn(),
      getRegionTableColumn(),
    ]
  },
}
