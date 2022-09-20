import {
  getNameDescriptionTableColumn,
  getProjectTableColumn,
} from '@/utils/common/tableColumn'
import i18n from '@/locales'

export default {
  data () {
    return {
      id: undefined,
    }
  },
  created () {
    this.columns = [
      getNameDescriptionTableColumn({
        field: 'res_name',
        hideField: true,
        title: this.$t('bill.text_72'),
        onManager: this.onManager,
        slotCallback: row => {
          let text = row.res_name
          if (!row.resource_id) text = '-'
          return text
        },
      }),
      {
        field: 'type',
        title: i18n.t('bill.text_212'),
        minWidth: 120,
        formatter: ({ cellValue }) => {
          return this.$t('suggestsyRuleTypes')[cellValue] || cellValue
        },
      },
      // {
      //   field: 'ignore_alert',
      //   title: i18n.t('bill.text_226'),
      //   width: 120,
      //   slots: {
      //     default: ({ row }, h) => {
      //       return [<a-switch loading={this.id && this.id === row.id } onChange={(bool) => this.handleIgnoreChange(row, bool)} size="small" checked-children={i18n.t('bill.text_227')} un-checked-children={i18n.t('bill.text_228')} checked={!row.ignore_alert} />]
      //     },
      //   },
      // },
      {
        title: i18n.t('bill.text_219'),
        field: 'scope',
        width: 120,
        formatter: ({ cellValue }) => {
          return this.$t(`shareScope.${cellValue}`) || cellValue
        },
      },
      getProjectTableColumn(),
    ]
  },
  methods: {
    async handleIgnoreChange (row, bool) {
      this.id = row.id
      try {
        await this.onManager('performAction', {
          id: this.id,
          managerArgs: {
            action: 'toggle-alert',
          },
        })
        row.ignore_alert = bool
      } finally {
        this.id = undefined
      }
    },
  },
}
