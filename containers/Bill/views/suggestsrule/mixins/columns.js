import {
  getSettingTableColumn,
  getExecTimeTableColumn,
  getPeriodTableColumn,
  getTimeFromTableColumn,
} from '../utils/columns'
import {
  getNameDescriptionTableColumn,
  getEnabledTableColumn,
} from '@/utils/common/tableColumn'
import i18n from '@/locales'

export default {
  created () {
    this.columns = [
      getNameDescriptionTableColumn({
        onManager: this.onManager,
        hideField: true,
        // edit: () => { return false },
        editDesc: () => { return false },
        formRules: [
          { required: true, message: i18n.t('bill.text_145') },
        ],
        slotCallback: row => {
          return (
            <side-page-trigger onTrigger={() => this.handleOpenSidepage(row)}>{ row.name }</side-page-trigger>
          )
        },
      }),
      getEnabledTableColumn(),
      getSettingTableColumn(),
      getPeriodTableColumn(),
      getTimeFromTableColumn(),
      getExecTimeTableColumn({ vm: this }),
    ]
  },
}
