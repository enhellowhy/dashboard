import i18n from '@/locales'
export default {
  data () {
    return {
      okButtonProps: {
        disabled: true,
      },
    }
  },
  created () {
    this.singleActions = [
      {
        label: i18n.t('bill.text_167'),
        permission: 'costalerts_delete',
        action: (obj) => {
          this.createDialog('DeleteResDialog', {
            name: i18n.t('bill.text_230'),
            title: i18n.t('bill.text_167'),
            vm: this,
            data: [obj],
            columns: this.columns,
            onManager: this.onManager,
          })
        },
      },
    ]
  },
}
