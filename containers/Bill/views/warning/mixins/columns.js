import { PLATFORMS, ACCOUNTS, REGIONS, DOMAINS, PROJECTS, CLOUDPROVIDERS, RESOURCES } from '@Bill/constants'
import { getCopyWithContentTableColumn } from '@/utils/common/tableColumn'
import BrandIcon from '@/sections/BrandIcon'
import i18n from '@/locales'

export default {

  created () {
    this.columns = [
      {
        field: 'brand',
        title: i18n.t('bill.text_81'),
        minWidth: 100,
        sortable: true,
        slots: {
          default: ({ row }) => {
            if (row.brand) {
              return [<BrandIcon name={ row.brand } key={row.id} />]
            }
            return PLATFORMS[0].item_name
          },
        },
      },
      getCopyWithContentTableColumn({
        field: 'account',
        title: i18n.t('bill.text_60'),
        hideField: true,
        message: (row) => {
          return row.account || ACCOUNTS[0].item_name
        },
        slotCallback: (row) => {
          return row.account || ACCOUNTS[0].item_name
        },
      }),
      getCopyWithContentTableColumn({
        field: 'cloudprovider_name',
        title: i18n.t('bill.text_233'),
        hideField: true,
        message: (row) => {
          return row.cloudprovider_name || CLOUDPROVIDERS[0].item_name
        },
        slotCallback: (row) => {
          return row.cloudprovider_name || CLOUDPROVIDERS[0].item_name
        },
      }),
      getCopyWithContentTableColumn({
        field: 'region',
        title: i18n.t('bill.text_83'),
        hideField: true,
        message: (row) => {
          return row.cloudprovider_name || REGIONS[0].item_name
        },
        slotCallback: (row) => {
          return row.cloudprovider_name || REGIONS[0].item_name
        },
      }),
      getCopyWithContentTableColumn({
        field: 'domain_filter',
        title: this.$t('dictionary.domain'),
        hideField: true,
        message: (row) => {
          return row.domain_filter || DOMAINS[0].item_name
        },
        slotCallback: (row) => {
          return row.domain_filter || DOMAINS[0].item_name
        },
      }),
      getCopyWithContentTableColumn({
        field: 'project_filter',
        title: this.$t('dictionary.project'),
        hideField: true,
        message: (row) => {
          return row.project_filter || PROJECTS[0].item_name
        },
        slotCallback: (row) => {
          return row.project_filter || PROJECTS[0].item_name
        },
      }),
      getCopyWithContentTableColumn({
        field: 'resource_type',
        title: i18n.t('bill.text_73'),
        hideField: true,
        message: (row) => {
          return row.resource_type || RESOURCES[0].item_name
        },
        slotCallback: (row) => {
          return row.resource_type || RESOURCES[0].item_name
        },
      }),
      getCopyWithContentTableColumn({
        field: 'cost_type',
        title: i18n.t('bill.text_229'),
        hideField: true,
        message: (row) => {
          return this.$t('billWarningCostTypes')[row.cost_type] || row.cost_type
        },
        slotCallback: (row) => {
          return this.$t('billWarningCostTypes')[row.cost_type] || row.cost_type
        },
      }),
      getCopyWithContentTableColumn({
        field: 'amount',
        title: i18n.t('bill.text_205'),
        hideField: true,
        message: (row) => {
          return `${row.currency === 'CNY' ? '¥' : '$'}${row.amount || 0}`
        },
        slotCallback: (row) => {
          return `${row.currency === 'CNY' ? '¥' : '$'}${row.amount || 0}`
        },
      }),
      getCopyWithContentTableColumn({
        field: 'created_at',
        title: i18n.t('bill.text_243'),
        hideField: true,
        message: (row) => {
          return this.$moment(row.created_at).fromNow()
        },
        slotCallback: (row) => {
          return this.$moment(row.created_at).fromNow()
        },
      }),
    ]
  },
}
