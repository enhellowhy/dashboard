import { mapGetters } from 'vuex'
import i18n from '@/locales'
import { disableUpdateTypes } from '@Bill/views/suggestsrule/constants'

export default {
  computed: mapGetters(['isAdminMode']),
  created () {
    this.singleActions = [
      {
        label: i18n.t('bill.text_165'),
        action: (obj) => {
          this.createDialog('UpdateSuggestruleDialog', {
            data: [obj],
            columns: [this.columns[0], this.columns[2], this.columns[3]],
            onManager: this.onManager,
            refresh: this.refresh,
          })
        },
        meta: obj => {
          const meta = {
            validate: true,
            tooltip: '',
          }
          if (disableUpdateTypes.includes(obj.type)) {
            meta.validate = false
            meta.tooltip = i18n.t('bill.text_275')
          }
          return meta
        },
      },
      {
        label: i18n.t('bill.text_194'),
        action: (obj) => {
          this.onManager('performAction', {
            steadyStatus: 'running',
            id: obj.id,
            managerArgs: {
              action: 'enable',
            },
          })
        },
        meta: (obj) => ({
          validate: !obj.enabled,
          tooltip: obj.enabled ? i18n.t('bill.text_216') : '',
        }),
      },
      {
        label: i18n.t('bill.text_196'),
        action: (obj) => {
          this.createDialog('RuleSetDisabledDialog', {
            columns: this.columns,
            data: [obj],
            onManager: this.onManager,
          })
        },
        meta: (obj) => ({
          validate: obj.enabled,
          tooltip: !obj.enabled ? i18n.t('bill.text_217') : '',
        }),
      },
      // {
      //   label: i18n.t('bill.text_167'),
      //   permission: 'suggestsysrules_delete',
      //   action: (obj) => {
      //     this.createDialog('DeleteResDialog', {
      //       vm: this,
      //       data: [obj],
      //       columns: this.columns,
      //       title: i18n.t('bill.text_167'),
      //       name: i18n.t('bill.text_174'),
      //       onManager: this.onManager,
      //     })
      //   },
      //   meta: (obj) => this.$getDeleteResult(obj),
      // },
    ]
  },
}
