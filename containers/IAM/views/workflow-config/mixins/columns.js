import { mapGetters } from 'vuex'
import {
  getCopyWithContentTableColumn,
} from '@/utils/common/tableColumn'
import { getWorkflowType } from '@/constants/workflow'
import i18n from '@/locales'

export default {
  computed: mapGetters(['isAdminMode', 'userInfo']),
  created () {
    this.columns = [
      getCopyWithContentTableColumn({
        field: 'name',
        title: i18n.t('system.text_529'),
        hideField: true,
        message: (row) => {
          const workflow = getWorkflowType(row.key)
          return workflow && workflow.name
        },
        slotCallback: row => {
          const workflow = getWorkflowType(row.key)
          return (
            <side-page-trigger onTrigger={ () => this.handleOpenSidepage(row) }>{ workflow && workflow.name }</side-page-trigger>
          )
        },
      }),
      {
        field: 'suspended',
        // field: 'enabled',
        title: i18n.t('system.text_163'),
        minWidth: 90,
        slots: {
          default: ({ row }, h) => {
            return [
              // <div class='text-truncate'>
              //   <status status={ !row.suspended } statusModule='enabled' />
              // </div>,
              <div class='text-truncate'>
                <status status={ row.enabled } statusModule='enabled' />
              </div>,
            ]
          },
        },
      },
      {
        field: 'deployment_time',
        title: i18n.t('system.text_530'),
        width: 170,
        formatter: ({ row }) => {
          if (row.created_at) {
            return this.$moment(row.created_at).format()
          }
          // if (row.deployment_time) {
          //   return this.$moment(row.deployment_time).format()
          // }
          return '-'
        },
      },
    ]
  },
  methods: {
    isOwnerPublic (obj) {
      // fix by http://bug.yunion.io/zentao/bug-view-2958.html 共享的权限在其他域下时应该不能做任何操作
      if (obj.is_public) {
        if (this.isAdminMode) return true
        if (obj.domain_id !== this.userInfo.domain.id) return false
      }
      return true
    },
  },
}
