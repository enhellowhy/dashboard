import {
  getCopyWithContentTableColumn,
  getTimeTableColumn,
} from '@/utils/common/tableColumn'
import { WORKFLOW_TYPES } from '@/constants/workflow'
import i18n from '@/locales'
import { statusMap, auditStatusMap } from '../../utils'
import {
  getProcessDefinitionNameTableColumn,
  getResourceNameTableColumn,
  getResourceProjectTableColumn,
} from '../../utils/columns'
const R = require('ramda')

export default {
  created () {
    const getStatusToolTip = (row) => {
      if (row.metadata) {
        // const sysWarn = row.metadata.sys_warn
        // const titleCon = sysWarn || sysError
        const sysError = row.metadata.sys_error
        const titleCon = sysError
        if (titleCon) {
          // const aIcon = <a-icon type="exclamation-circle" class={ { 'ml-1 oc-pointer': true, 'warning-color': sysWarn, 'error-color': sysError } } />
          const aIcon = <a-icon type="exclamation-circle" class={ { 'm-1 oc-pointer': true, 'error-color': sysError } } />
          return <a-tooltip placement="right">
            <template slot="title">
              { titleCon }
            </template>
            { aIcon }
          </a-tooltip>
        }
      }
      return null
    }
    this.columns = [
      getCopyWithContentTableColumn({
        field: 'id',
        title: i18n.t('common_350'),
        hideField: true,
        minWidth: 80,
        onManager: this.onManager,
        slotCallback: row => {
          return (
            <side-page-trigger onTrigger={ () => this.handleOpenSidepage(row) }>{ row.id }</side-page-trigger>
          )
        },
      }),
      {
        field: 'initiator_name',
        title: i18n.t('common_371'),
        hideField: true,
        minWidth: 80,
        showOverflow: 'title',
        onManager: this.onManager,
        slots: {
          default: ({ row }, h) => {
            const name = row.variables.initiator_name
            return [<list-body-cell-wrap copy row={row.variables} field="initiator_name" title={name}/>]
          },
        },
      },
      getProcessDefinitionNameTableColumn(),
      getResourceNameTableColumn(),
      getResourceProjectTableColumn({
        field: 'variables.resource_project_name',
        title: this.$t('dictionary.project'),
      }),
      {
        field: 'state',
        title: i18n.t('common_372'),
        minWidth: 80,
        showOverflow: 'title',
        slots: {
          default: ({ row }, h) => {
            const statusObj = statusMap(row.process_definition_key)[row.state]
            if (statusObj) {
              //   return [
              //     <span style={{ color: statusObj.color }}>{statusObj.text}</span>,
              //   ]
              // }
              return [
                <div class="d-flex">
                  <status status={row.state} statusModule={'workflowState'}/>
                </div>,
              ]
            }
          },
        },
      },
      {
        field: 'audit_status',
        title: i18n.t('common_401'),
        minWidth: 80,
        showOverflow: 'title',
        slots: {
          default: ({ row }, h) => {
            // let href
            // if (process.env.NODE_ENV === 'production') { //default is process.env.NODE_ENV==='development'
            //   href = 'https://bpm.lixiangoa.com/apps/desktop/process/app_3qedx9grhl/' + row.external_id
            // } else {
            //   href = 'https://bpm-test.lixiangoa.com/apps/desktop/process/app_3qedx9grhl/' + row.external_id
            // }
            // const href = 'https://bpm-test.lixiangoa.com/apps/desktop/process/app_3qedx9grhl/' + row.external_id
            const href = 'https://bpm.lixiangoa.com/apps/desktop/process/app_3qedx9grhl/' + row.external_id
            if (row.variables.audit_status) {
              const statusObj = auditStatusMap(row.process_definition_key)[row.variables.audit_status]
              if (row.process_definition_key === WORKFLOW_TYPES.CUSTOMER_SERVICE) {
                return [
                  <span style="color: #f6a100;">{row.audit_state}</span>,
                ]
              }
              if (statusObj) {
                return [
                  // <span style={{ color: statusObj.color }}>{statusObj.text}</span>,
                  <span><a href={href} target="_blank" style={{ color: statusObj.color }}>{statusObj.text}</a></span>,
                ]
              }
            } else if (row.state === 'PENDING') {
              return [
                <span><a href={href} target="_blank" style="color: #f6a100;">{i18n.t('common.auditing')}</a></span>,
              ]
            }
          },
        },
      },
      {
        field: 'status',
        title: i18n.t('common_402'),
        minWidth: 100,
        showOverflow: 'title',
        sortable: true,
        slots: {
          default: ({ row }, h) => {
            // const bizStatus = row.variables.biz_status
            // const tooltip = <span class='ml-1'><a-tooltip title={ i18n.t('workflow.biz_field') }><a-icon type="question-circle" /></a-tooltip></span>
            if (row.status === 'success' || row.status === 'fail' || row.status === 'operating') {
              // if ((row.state === 'COMPLETED' || row.state === 'CUSTOM_TODO') && bizStatus) {
              if (row.status === 'fail') {
                return [
                  <div class="d-flex">
                    <status status={row.status} statusModule={'workflowBiz'}/>
                    { getStatusToolTip(row) }
                  </div>,
                ]
              }
              return [
                // <div class="d-flex"><status status={ bizStatus } statusModule={ 'workflowBiz' } />{ bizStatus === 'fail' ? tooltip : null }</div>,
                <div class="d-flex">
                  <status status={row.status} statusModule={'workflowBiz'}/>
                </div>,
              ]
            }
            return '-'
          },
        },
      },
      {
        field: 'assignee',
        title: i18n.t('common_399'),
        width: 120,
        showOverflow: 'title',
        slots: {
          default: ({ row }) => {
            const assignees = []
            if (R.isNil(row.log) || row.log.length === 0 || R.isNil(row.log[row.log.length - 1].task_assignee_name)) return '-'
            if (row.log[row.log.length - 1].task_assignee_avatar.length > 1) {
              row.log[row.log.length - 1].task_assignee_avatar.forEach((item) => {
                assignees.push(<span><a-avatar src={item} /></span>)
              })
            } else {
              assignees.push(<span><a-avatar src={row.log[row.log.length - 1].task_assignee_avatar[0]} /></span>)
              assignees.push(<span>&nbsp;&nbsp;</span>)
              assignees.push(<span>{row.log[row.log.length - 1].task_assignee_name[0]}</span>)
            }
            // return assignees
            return assignees.length > 0 ? assignees : '-'
            // const assignees = []
            // if (Array.isArray(row.tasks)) {
            //   row.tasks.forEach((item) => {
            //     if (!item.delete_reason) {
            //       assignees.push(item.assignee_name)
            //     }
            //   })
            // } else {
            //   if (row.tasks && !row.delete_reason) {
            //     assignees.push(row.tasks.assignee_name)
            //   }
            // }
            // return assignees.length > 0 ? assignees.join(',') : '-'
          },
        },
      },
      getTimeTableColumn({ field: 'start_time', title: i18n.t('common_374') }),
      getTimeTableColumn({ field: 'end_time', title: i18n.t('common_387') }),
    ]
  },
}
