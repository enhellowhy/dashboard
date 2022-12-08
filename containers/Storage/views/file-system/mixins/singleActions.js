import { disableDeleteAction, getSetPublicAction } from '@/utils/common/tableActions'
import i18n from '@/locales'

export default {
  created () {
    this.singleActions = [
      {
        label: i18n.t('storage.text_100'),
        permission: 'file_systems_perform_syncstatus',
        action: obj => {
          this.onManager('performAction', {
            steadyStatus: ['available'],
            id: obj.id,
            managerArgs: {
              action: 'syncstatus',
            },
          })
        },
        meta: () => ({
          validate: true,
        }),
      },
      {
        label: i18n.t('storage.text_65'),
        actions: (obj) => {
          return [
            getSetPublicAction(this, {
              name: this.$t('dictionary.filesystem'),
              scope: 'project',
              resource: 'file_systems',
            }, {
              permission: 'buckets_perform_public',
            }),
            {
              label: this.$t('storage.text_96', [this.$t('dictionary.project')]),
              permission: 'buckets_perform_change_owner',
              action: row => {
                this.createDialog('ChangeOwenrDialog', {
                  name: i18n.t('storage.filesystem'),
                  data: [row],
                  columns: this.columns,
                  onManager: this.onManager,
                  refresh: this.refresh,
                  resource: 'file_systems',
                })
              },
              meta: (obj) => {
                if (obj.is_public) {
                  return {
                    validate: false,
                    tooltip: i18n.t('common_614'),
                  }
                }
                const ret = {
                  validate: false,
                  tooltip: '',
                }
                if (this.isProjectMode) {
                  ret.tooltip = i18n.t('common_601')
                  return ret
                }
                return {
                  validate: true,
                }
              },
            },
            disableDeleteAction(this, {
              name: this.$t('dictionary.filesystem'),
            }),
            {
              label: i18n.t('storage.text_36'),
              permission: 'file_systems_delete',
              action: () => {
                this.createDialog('DeleteResDialog', {
                  vm: this,
                  title: i18n.t('storage.text_36'),
                  name: this.$t('dictionary.filesystem'),
                  data: [obj],
                  columns: this.columns,
                  onManager: this.onManager,
                  refresh: this.refresh,
                })
              },
              meta: () => this.$getDeleteResult(obj),
            },
          ]
        },
      },
    ]
  },
}
