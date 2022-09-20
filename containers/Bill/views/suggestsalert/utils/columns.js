import { getRuleTypeName, getRuleDesc } from '@Bill/utils'
import i18n from '@/locales'

export const getResNameTableColumn = ({ field = 'name' } = {}) => {
  return {
    field,
    title: i18n.t('bill.text_72'),
    minWidth: 70,
    showOverflow: 'title',
    slots: {
      default: ({ row }, h) => {
        return [
          <list-body-cell-wrap copy field={field} row={row} />,
        ]
      },
    },
  }
}

export const getTypeTableColumn = () => {
  return {
    field: 'type',
    title: i18n.t('bill.text_212'),
    minWidth: 70,
    showOverflow: 'title',
    formatter: ({ row }) => {
      return getRuleTypeName(row.type) || '-'
    },
  }
}

export const getMonitorConfigTableColumn = () => {
  return {
    field: 'monitor_config',
    title: i18n.t('bill.text_174'),
    minWidth: 70,
    showOverflow: 'title',
    formatter: ({ row }) => {
      const rules = JSON.stringify(row.monitor_config)
      return rules || '-'
    },
  }
}

export const getSuggestTableColumn = () => {
  return {
    field: 'suggest',
    title: i18n.t('bill.text_175'),
    minWidth: 70,
    showOverflow: 'title',
    formatter: ({ row }) => {
      return row.suggest || '-'
    },
  }
}

export const getProblemTableColumn = () => {
  return {
    field: 'problem',
    title: i18n.t('bill.text_187'),
    minWidth: 70,
    showOverflow: 'title',
    slots: {
      default: ({ row }, h) => {
        if (row.problem && row.problem.length > 0) {
          const problems = row.problem.map((item) => {
            return `${item.type}:${item.description}`
          }).join(',')
          return [
            <div class='text-truncate' title={ problems }>
              { problems }
            </div>,
          ]
        }
        return '-'
      },
    },
  }
}

export const getRuleNameTableColumn = ({ field = 'rule_name' } = {}) => {
  return {
    field,
    title: i18n.t('bill.text_174'),
    minWidth: 70,
    showOverflow: 'title',
    slots: {
      default: ({ row }, h) => {
        const ruleDesc = getRuleDesc(row.type, row.monitor_config, row)
        return [
          <div class='text-truncate' title={ ruleDesc }>
            { ruleDesc }
          </div>,
        ]
      },
    },
  }
}
