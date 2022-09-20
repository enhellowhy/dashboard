import { mapGetters } from 'vuex'
import i18n from '@/locales'

export default {
  computed: mapGetters(['isAdminMode']),
  created () {
    this.singleActions = [
      // {
      //   label: '开启忽略结果',
      //   action: (obj) => {
      //     this.onManager('update', {
      //       id: obj.id,
      //       managerArgs: {
      //         data: { ignore_alert: true },
      //       },
      //     })
      //   },
      //   meta: (obj) => ({
      //     validate: !obj.enabled,
      //     tooltip: obj.enabled ? '请选择已禁用的规则' : '',
      //   }),
      // },
      // {
      //   label: '禁用忽略结果',
      //   action: (obj) => {
      //     this.onManager('update', {
      //       id: obj.id,
      //       managerArgs: {
      //         data: { ignore_alert: false },
      //       },
      //     })
      //   },
      //   meta: (obj) => ({
      //     validate: obj.enabled,
      //     tooltip: !obj.enabled ? '请选择已启用的规则' : '',
      //   }),
      // },
      // {
      //   label: '修改忽略结果',
      //   action: (obj) => {
      //     this.createDialog('UpdateSuggestRuleConfig', {
      //       data: [obj],
      //       columns: this.columns,
      //       onManager: this.onManager,
      //     })
      //   },
      // },
      {
        label: i18n.t('bill.text_271'),
        action: (obj) => {
          this.createDialog('DeleteResDialog', {
            vm: this,
            data: [obj],
            columns: this.columns.filter(item => {
              return ['ignore_alert'].indexOf(item.field) === -1
            }),
            title: i18n.t('bill.text_271'),
            unit: obj.resource_id ? i18n.t('bill.text_272') : i18n.t('bill.text_270'),
            name: i18n.t('bill.text_175'),
            onManager: this.onManager,
          })
        },
        meta: (obj) => this.$getDeleteResult(obj),
      },
    ]
  },
}
