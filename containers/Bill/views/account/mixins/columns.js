import {
  getBrandTableColumn,
  getStatusTableColumn,
  getNameDescriptionTableColumn,
} from '@/utils/common/tableColumn'
import { numerify } from '@/filters'
import i18n from '@/locales'

export default {
  created () {
    this.columns = [
      getNameDescriptionTableColumn({
        onManager: this.onManager,
        hideField: true,
        edit: false,
        showDesc: false,
        slotCallback: row => {
          return (
            <side-page-trigger onTrigger={() => this.handleOpenSidepage(row)}>{ row.name }</side-page-trigger>
          )
        },
      }),
      getStatusTableColumn({ statusModule: 'cloudaccount' }),
      getBrandTableColumn({ field: 'platform_brand' }),
      {
        field: 'balance',
        title: i18n.t('bill.text_90'),
        formatter: ({ row }) => {
          if (row.balance_available === false) return '-'
          return `${this.currencySign}${numerify(row.balance, '0,0.00')}`
        },
      },
    ]
  },
}
