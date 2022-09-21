import i18n from '@/locales'
// export default {
//   created () {
//     this.singleActions = []
//   },
// }

export default {
  created () {
    this.singleActions = [
      {
        label: i18n.t('system.text_153'),
        actions: (row) => {
          const ret = []
          if (row.key === 'apply-machine') {
            ret.push(
              {
                label: i18n.t('common.rebuild_resource'),
                action: () => {
                  this.createDialog('RetryServerCreateDialog', {
                    data: [row],
                    title: i18n.t('common.rebuild_resource'),
                    columns: this.columns,
                    onManager: this.onManager,
                  })
                },
                meta: () => {
                  if (row.status === 'fail') {
                    return {
                      validate: true,
                      // tooltip: this.$t('common_603'),
                    }
                  }
                  return {
                    validate: false,
                  }
                },
              },
            )
          }
          ret.push(
            {
              label: i18n.t('system.text_129'),
              action: () => {
                this.createDialog('DeleteResDialog', {
                  vm: this,
                  data: [row],
                  columns: this.columns,
                  title: i18n.t('system.text_129'),
                  name: this.$t('common.workflow.records'),
                  onManager: this.onManager,
                })
              },
              meta: () => this.$getDeleteResult(row),
            },
          )
          return ret
          // return [
          //   {
          //     label: i18n.t('common.rebuild_resource'),
          //     action: () => {
          //       this.createDialog('RetryServerCreateDialog', {
          //         data: [row],
          //         title: i18n.t('common.rebuild_resource'),
          //         columns: this.columns,
          //         onManager: this.onManager,
          //       })
          //     },
          //     meta: () => {
          //       if (row.status === 'fail') {
          //         return {
          //           validate: true,
          //           // tooltip: this.$t('common_603'),
          //         }
          //       }
          //       return {
          //         validate: false,
          //       }
          //     },
          //   },
          //   {
          //     label: i18n.t('system.text_129'),
          //     action: () => {
          //       this.createDialog('DeleteResDialog', {
          //         vm: this,
          //         data: [row],
          //         columns: this.columns,
          //         title: i18n.t('system.text_129'),
          //         name: this.$t('common.workflow.records'),
          //         onManager: this.onManager,
          //       })
          //     },
          //     meta: () => this.$getDeleteResult(row),
          //   },
          // ]
        },
      },
    ]
  },
}
