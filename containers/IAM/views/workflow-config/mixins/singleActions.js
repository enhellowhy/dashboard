import { mapGetters } from 'vuex'
import i18n from '@/locales'

export default {
  computed: mapGetters(['isAdminMode', 'l3PermissionEnable']),
  created () {
    this.singleActions = [
      {
        label: i18n.t('system.text_225'),
        action: (obj) => {
          this.createDialog('DisableDialog', {
            title: i18n.t('system.text_225'),
            name: i18n.t('system.text_12'),
            columns: this.columns,
            data: [obj],
            alert: i18n.t('system.text_552'),
            ok: async () => {
              try {
                let response = {}
                if (obj.type === 'service_desk') {
                  response = await this.changeExtraProcessDefinitionsStatus(obj, 'activate')
                } else {
                  // response = await this.onManager('batchUpdate', {
                  response = await this.onManager('update', {
                    // id: [obj.id],
                    id: obj.id,
                    managerArgs: {
                      data: {
                        // state: 'activate',
                        // 'process-key': obj.key,
                        enabled: true,
                      },
                    },
                  })
                }
                this.refresh()
                return response
              } catch (error) {
                throw error
              }
            },
          })
        },
        meta: (obj) => ({
          // validate: obj.suspended,
          validate: !obj.enabled,
        }),
      },
      {
        label: i18n.t('system.text_226'),
        action: (obj) => {
          this.createDialog('DisableDialog', {
            title: i18n.t('system.text_226'),
            name: i18n.t('system.text_12'),
            columns: this.columns,
            data: [obj],
            alert: i18n.t('system.text_553'),
            ok: async () => {
              try {
                let response = {}
                if (obj.type === 'service_desk') {
                  response = await this.changeExtraProcessDefinitionsStatus(obj, 'suspend')
                } else {
                  response = await this.onManager('update', {
                    id: obj.id,
                    managerArgs: {
                      data: {
                        // state: 'suspend',
                        // 'process-key': obj.key,
                        enabled: false,
                      },
                    },
                  })
                }
                this.refresh()
                return response
              } catch (error) {
                throw error
              }
            },
          })
        },
        meta: (obj) => ({
          // validate: !obj.suspended,
          validate: obj.enabled,
        }),
      },
      // {
      //   label: i18n.t('system.text_548'),
      //   action: (obj) => {
      //     this.createDialog('WorkflowConfigUpdateProcessDialog', {
      //       data: [obj],
      //       columns: this.columns,
      //       onManager: this.onManager,
      //       refresh: this.refresh,
      //     })
      //   },
      //   meta: (obj) => ({
      //     validate: obj.can_update,
      //   }),
      // },
    ]
  },
}
