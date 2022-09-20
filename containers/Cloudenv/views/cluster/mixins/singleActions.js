import { mapGetters } from 'vuex'
import i18n from '@/locales'

export default {
  computed: mapGetters(['isAdminMode']),
  created () {
    this.singleActions = [
      {
        label: i18n.t('cloudenv.text_454'),
        action: obj => {
          this.createDialog('AssociatedHostResourcesDialog', {
            data: [obj],
            columns: this.columns,
            onManager: this.onManager,
          })
        },
        meta: () => {
          const ret = {
            validate: true,
            tooltip: null,
          }
          if (!this.isAdminMode) {
            ret.validate = false
            return ret
          }
          return ret
        },
      },
      {
        label: i18n.t('cloudenv.text_311'),
        actions: obj => {
          return [

            {
              label: i18n.t('cloudenv.text_423'),
              action: obj => {
                this.createDialog('SetOwnerDialog', {
                  data: [obj],
                  columns: this.columns,
                  title: i18n.t('cloudenv.text_423'),
                  tipName: i18n.t('cloudenv.clusters.hosts.text_0'),
                  onManager: this.onManager,
                  tipname: this.$t('dictionary.hostcluster'),
                  action: i18n.t('cloudenv.text_423'),
                })
              },
              meta: () => {
                const ret = {
                  validate: true,
                  tooltip: null,
                }
                if (!this.isAdminMode) {
                  ret.validate = false
                }
                return ret
              },
            },
            {
              label: i18n.t('cloudenv.clusters.drs.strategy.text_0'),
              action: obj => {
                this.createDialog('SetClusterStrategyDialog', {
                  data: [obj],
                  columns: this.columns,
                  title: i18n.t('cloudenv.clusters.drs.strategy.text_0'),
                  onManager: this.onManager,
                })
              },
              meta: () => {
                const ret = {
                  validate: true,
                  tooltip: null,
                }
                if (!this.isAdminMode) {
                  ret.validate = false
                }
                return ret
              },
            },
            {
              label: i18n.t('cloudenv.clusters.drs.enable'),
              action: (obj) => {
                this.createDialog('DisableDialog', {
                  title: i18n.t('cloudenv.clusters.drs.enable'),
                  name: i18n.t('cloudenv.clusters.hosts.text_0'),
                  columns: this.columns,
                  data: [obj],
                  alert: i18n.t('cloudenv.clusters.drs.enable.text'),
                  ok: async () => {
                    try {
                      let response = {}
                      response = await this.onManager('performAction', {
                        id: obj.id,
                        managerArgs: {
                          action: 'drs-enabled',
                          data: {
                            drs_enabled: true,
                          },
                        },
                      })
                      this.refresh()
                      return response
                    } catch (error) {
                      throw error
                    }
                  },
                })
              },
              meta: (obj) => ({
                validate: !obj.drs_enabled,
              }),
            },
            {
              label: i18n.t('cloudenv.clusters.drs.disable'),
              action: (obj) => {
                this.createDialog('DisableDialog', {
                  title: i18n.t('cloudenv.clusters.drs.disable'),
                  name: i18n.t('cloudenv.clusters.hosts.text_0'),
                  columns: this.columns,
                  data: [obj],
                  alert: i18n.t('cloudenv.clusters.drs.disable.text'),
                  ok: async () => {
                    try {
                      let response = {}
                      response = await this.onManager('performAction', {
                        id: obj.id,
                        managerArgs: {
                          action: 'drs-enabled',
                          data: {
                            drs_enabled: false,
                          },
                        },
                      })
                      this.refresh()
                      return response
                    } catch (error) {
                      throw error
                    }
                  },
                })
              },
              meta: (obj) => ({
                validate: obj.drs_enabled,
              }),
            },
            {
              label: i18n.t('cloudenv.text_108'),
              action: obj => {
                this.createDialog('DeleteResDialog', {
                  vm: this,
                  data: [obj],
                  columns: this.columns,
                  title: i18n.t('cloudenv.text_108'),
                  name: this.$t('dictionary.hostcluster'),
                  onManager: this.onManager,
                  success: () => {
                    this.destroySidePages()
                  },
                })
              },
              meta: obj => {
                const ret = {
                  validate: obj.can_delete,
                  tooltip: null,
                }
                if (!this.isAdminMode) {
                  ret.validate = false
                }
                return ret
              },
            },
          ]
        },
      },
    ]
  },
}
