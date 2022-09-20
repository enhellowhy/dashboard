import LbListCell from '@Loadbalancer/views/lb/components/LbListCell'
import { LB_SCHEDULER_MAP } from '@Loadbalancer/constants/lb'
import {
  getNameDescriptionTableColumn,
  getStatusTableColumn,
  getProjectTableColumn,
  getBrandTableColumn,
} from '@/utils/common/tableColumn'
import i18n from '@/locales'

export default {
  components: {
    LbListCell,
  },
  computed: {
    columns () {
      const arr = [
        getNameDescriptionTableColumn({
          onManager: this.onManager,
          hideField: true,
          steadyStatus: this.steadyStatus,
          title: i18n.t('network.text_21'),
          slotCallback: row => {
            return (
              <side-page-trigger onTrigger={ () => this.handleOpenSidepage(row) }>{ row.name }</side-page-trigger>
            )
          },
        }),
        getStatusTableColumn({ statusModule: 'lb' }),
        getBrandTableColumn(),
        {
          field: 'listener_type&listener_port',
          title: i18n.t('loadbalancer.text_10'),
          minWidth: 150,
          // formatter: ({ row }) => `${row.listener_type}:${row.listener_port}`,
          formatter: ({ row }) => {
            if (!row.listener_type) return '-'
            return row.listener_type.toUpperCase() + ': ' + row.listener_port
          },
        },
        {
          field: 'listener_type&backend_server_port',
          title: i18n.t('loadbalancer.text_11'),
          minWidth: 150,
          formatter: ({ row }) => {
            if (!row.listener_type) return '-'
            return row.listener_type.toUpperCase() + ': ' + row.backend_server_port
          },
        },
        {
          field: 'check_status',
          title: i18n.t('loadbalancer.text_19'),
          minWidth: 100,
          slots: {
            default: ({ row }, h) => {
              if (!row.check_status) return '-'
              if (row.check_status === 'success') {
                return [
                  <div class="d-flex">
                    <status status='正常' statusModule={'backendsState'}/>
                  </div>,
                ]
              } else if (!row.backend_err_list) {
                return [
                  <div class="d-flex">
                    <status status='异常' statusModule={'backendsState'}/>
                  </div>,
                ]
              } else {
                var ret = []
                const color = '#F56C6C'
                ret.push(<a-tooltip title={row.backend_err_list.toString()}><icon type="exclamation-circle" fill="#555" style={{ color: color }} /></a-tooltip>)
                ret.push(<span class="ml-2" style="color: #F56C6C;">异常</span>)
                // ret.push(<span class="ml-2">异常</span>)
                return ret
                // return (
                //   <icon className='ml-2' type='exclamation-circle-filled' style={{ color: '#1890ff' }}/>
                // )
              }
            },
          },
          // formatter: ({ row }) => {
          //   if (!row.backend_err_list) return '-'
          //   if (row.backend_err_list.length === 0) {
          //     return (
          //       <div class="d-flex">
          //         <status status='正常' statusModule={'backendsState'}/>
          //       </div>
          //     )
          //   } else {
          //     // var ret = []
          //     // ret.push(<a-tooltip title={i18n.t('compute.text_562')}><icon class='ml-2' type='exclamation-circle-filled' style={{ color: '#1890ff' }} /></a-tooltip>)
          //     // return ret
          //     return (
          //       <icon className='ml-2' type='exclamation-circle-filled' style={{ color: '#1890ff' }}/>
          //     )
          //   }
          // },
        },
        {
          field: 'scheduler',
          title: i18n.t('network.text_423'),
          minWidth: 100,
          formatter: ({ row }) => {
            if (!row.scheduler || row.redirect === 'raw') return '-'
            const scheduler = LB_SCHEDULER_MAP[row.scheduler]
            return scheduler ? scheduler.text : row.scheduler
          },
        },
        // {
        //   field: 'backend_group',
        //   title: i18n.t('network.text_139'),
        //   minWidth: 200,
        //   slots: {
        //     default: ({ row }) => {
        //       return [
        //         <side-page-trigger onTrigger={ () => this.handleOpenLbbgSidepage(row) }>{ row.backend_group }</side-page-trigger>,
        //       ]
        //     },
        //   },
        // },
        getStatusTableColumn({
          minWidth: 100,
          statusModule: 'lbHealth',
          field: 'health_check',
          title: i18n.t('network.text_469'),
          slotCallback: (row) => {
            return row.redirect === 'raw' ? '-' : null
          },
        }),
        getStatusTableColumn({ minWidth: 100, statusModule: 'lbAcl', field: 'acl_status', title: i18n.t('network.text_142') }),
        getStatusTableColumn({ minWidth: 100, statusModule: 'lbRedirect', field: 'redirect', title: i18n.t('network.text_368') }),
        getProjectTableColumn(),
      ]
      if (this.data.provider && this.data.provider.toUpperCase() !== 'onecloud') arr.splice(7, 1)
      if (this.data.provider && (this.data.provider.toLowerCase() === 'azure' || this.data.provider.toLowerCase() === 'google')) {
        arr.splice(3, 0, {
          field: 'metadata',
          title: i18n.t('network.text_248'),
          minWidth: 200,
          slots: {
            default: ({ row }) => {
              return row.metadata && row.metadata['ext:FrontendIP'] ? row.metadata['ext:FrontendIP'] : '-'
            },
          },
        })
      }
      return arr
    },
  },
  methods: {
    handleOpenLbbgSidepage (row) {
      this.sidePageTriggerHandle(this, 'LoadbalancerbackendgroupSidePage', {
        id: row.backend_group_id,
        resource: 'loadbalancerbackendgroups',
        lbData: this.data, // this.data 就是 list.vue 里面接收的prop
      }, {
        list: this.list,
      })
    },
  },
}
