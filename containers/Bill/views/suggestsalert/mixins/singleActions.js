import { mapGetters } from 'vuex'
import i18n from '@/locales'
import { arrToObjByKey } from '@/utils/utils'

export default {
  computed: mapGetters(['isAdminMode']),
  created () {
    this.singleActions = [
      {
        label: i18n.t('bill.text_177'),
        action: (obj) => {
          this.createDialog('SuggestsAlertDeleteDialog', {
            vm: this,
            data: [obj],
            columns: this.columns,
            onManager: this.onManager,
          })
        },
        meta: (obj) => {
          return {
            validate: true,
          }
        },
      },
      {
        label: i18n.t('bill.text_269'),
        action: (obj) => {
          this.onManager('performAction', {
            id: obj.id,
            managerArgs: {
              action: 'ignore',
              data: {
                scope: this.$store.getters.scope,
              },
            },
          }).then(ret => {
            this.$message.success(i18n.t('bill.text_59'))
            this.destroySidePage(this.windowId)
            this.refresh()
          })
        },
        meta: (obj) => {
          return {
            validate: true,
          }
        },
      },
      {
        label: i18n.t('bill.text_268'),
        action: (obj) => {
          const columnsMap = arrToObjByKey(this.columns, 'field')
          this.createDialog('BatchIgnoreDialog', {
            vm: this,
            data: [obj],
            columns: [columnsMap.type.data, columnsMap.rule_name.data],
            onManager: this.onManager,
            refresh: this.refresh,
            success: () => {
              this.destroySidePage(this.windowId)
            },
          })
        },
        meta: (obj) => {
          return {
            validate: true,
          }
        },
      },
    ]
  },
}
