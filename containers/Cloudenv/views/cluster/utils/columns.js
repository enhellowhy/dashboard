import { CLUSTER_STRATEGY } from '@Cloudenv/constants/sched'
import i18n from '@/locales'

export const getStrategyTableColumn = () => {
  return {
    field: 'strategy',
    title: i18n.t('cloudenv.clusters.drs.strategy'),
    width: 80,
    formatter: ({ row }) => {
      return CLUSTER_STRATEGY[row.strategy] || '-'
    },
  }
}

export const getResourceTypeTableColumn = () => {
  return {
    field: 'resource_type',
    title: i18n.t('cloudenv.text_384'),
    width: 120,
    formatter: ({ row }) => {
      return i18n.t('cloudenv.clusters.hosts')
    },
  }
}

export const getResourceCountTableColumn = ({ vm = {} } = {}) => {
  return {
    field: 'resource_count',
    title: i18n.t('cloudenv.text_417'),
    width: 80,
    slots: {
      default: ({ row }, h) => {
        if (vm.isPreLoad && !row.resource_count) return [<data-loading />]
        return `${row.resource_count || 0}`
      },
    },
  }
}
