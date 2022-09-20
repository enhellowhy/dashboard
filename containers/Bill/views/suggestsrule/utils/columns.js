import { getRuleDesc, getTimeWithI18n } from '@Bill/utils'
import i18n from '@/locales'

export const getSettingTableColumn = () => {
  return {
    field: 'setting',
    title: i18n.t('bill.text_174'),
    minWidth: 70,
    showOverflow: 'title',
    slots: {
      default: ({ row }, h) => {
        const ruleDesc = getRuleDesc(row.type, row.setting, row)
        return [
          <div class='text-truncate' title={ ruleDesc }>
            { ruleDesc }
          </div>,
        ]
      },
    },
  }
}

export const getPeriodTableColumn = () => {
  return {
    field: 'period',
    title: i18n.t('bill.text_189'),
    minWidth: 70,
    showOverflow: 'title',
    formatter: ({ row, cellValue }) => {
      return getTimeWithI18n(row.period)
    },
  }
}

export const getTimeFromTableColumn = () => {
  return {
    field: 'time_from',
    title: i18n.t('bill.text_198'),
    minWidth: 70,
    showOverflow: 'title',
    formatter: ({ row, cellValue }) => {
      return getTimeWithI18n(row.time_from)
    },
  }
}

export const getExecTimeTableColumn = ({ vm }) => {
  return {
    field: 'exec_time',
    title: i18n.t('bill.text_218'),
    minWidth: 70,
    showOverflow: 'title',
    formatter: ({ row, cellValue }) => {
      if (!cellValue) {
        return '-'
      }
      return vm.$moment(cellValue).fromNow()
    },
  }
}
