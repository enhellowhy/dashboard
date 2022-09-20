import {
  getStrategyTableColumn,
  getResourceTypeTableColumn,
  getResourceCountTableColumn,
} from '../utils/columns'
import {
  getNameDescriptionTableColumn,
  getTagTableColumn,
  getTimeTableColumn,
} from '@/utils/common/tableColumn'

export default {
  created () {
    this.columns = [
      getNameDescriptionTableColumn({
        onManager: this.onManager,
        hideField: true,
        slotCallback: row => {
          return (
            <side-page-trigger onTrigger={() => this.handleOpenSidepage(row)}>{ row.name }</side-page-trigger>
          )
        },
        formRules: [
          { required: true, message: this.$t('cloudenv.text_190') },
        ],
      }),
      getTagTableColumn({
        onManager: this.onManager,
        needExt: true,
        resource: 'clusters',
        columns: () => this.columns,
        tipName: this.$t('dictionary.hostcluster'),
      }),
      {
        field: 'drs_status',
        title: this.$t('cloudenv.clusters.drs.status'),
        minWidth: 90,
        slots: {
          default: ({ row }, h) => {
            return [
              <div class='text-truncate'>
                <status status={ row.drs_enabled } statusModule='enabled' />
              </div>,
            ]
          },
        },
      },
      getStrategyTableColumn(),
      getResourceTypeTableColumn(),
      getResourceCountTableColumn({ vm: this }),
      {
        field: 'scope',
        title: this.$t('table.title.scope_range'),
        minWidth: 120,
        slots: {
          default: ({ row }) => {
            if (this.isPreLoad && (!row.project_domain && !row.project)) return [<data-loading />]
            let ret = this.$t('cloudenv.text_504')
            if (!this.$store.getters.l3PermissionEnable) {
              if (row.project) {
                ret = this.$t('cloudenv.text_506', [row.project])
                return ret
              }
              return this.$t('shareScope.system')
            }
            if (row.project_domain) {
              ret = this.$t('cloudenv.text_505', [row.project_domain])
            }
            if (row.project) {
              ret = this.$t('cloudenv.text_506', [row.project])
            }
            return ret
          },
        },
      },
      getTimeTableColumn(),
    ]
  },
}
