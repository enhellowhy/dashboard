<template>
  <detail
    :onManager="onManager"
    :data="data"
    :base-info="baseInfo"
    :extra-info="extraInfo"
    :showName="false" />
</template>

<script>
import {
  getCopyWithContentTableColumn,
} from '@/utils/common/tableColumn'
import { getWorkflowType } from '@/constants/workflow'

export default {
  name: 'WorkflowConfigDetail',
  props: {
    data: {
      type: Object,
      required: true,
    },
    onManager: {
      type: Function,
      required: true,
    },
  },
  data () {
    return {
      baseInfo: [
        getCopyWithContentTableColumn({
          field: 'name',
          title: this.$t('system.text_529'),
          hideField: true,
          message: (row) => {
            const workflow = getWorkflowType(row.key)
            return workflow && workflow.name
          },
          slotCallback: row => {
            const workflow = getWorkflowType(row.key)
            return workflow && workflow.name
          },
        }),
        {
          field: 'suspended',
          title: this.$t('system.text_163'),
          formatter: ({ cellValue }) => {
            return <span style={{ color: cellValue ? '#8a94a6' : '#7ed321' }}>{cellValue ? this.$t('system.text_554') : this.$t('system.text_555') }</span>
          },
        },
        {
          field: 'created_time',
          title: this.$t('system.text_530'),
          formatter: ({ row }) => {
            // if (row.deployment && row.deployment.deployment_time) {
            //   return this.$moment(row.deployment.deployment_time).format(this.$t('system.text_556'))
            // }
            if (row.created_at) {
              return this.$moment(row.created_at).format()
            }
            return '-'
          },
        },
        {
          field: 'updated_time',
          title: this.$t('system.text_530'),
          formatter: ({ row }) => {
            // if (row.deployment && row.deployment.deployment_time) {
            //   return this.$moment(row.deployment.deployment_time).format(this.$t('system.text_556'))
            // }
            if (row.updated_at) {
              return this.$moment(row.updated_at).format()
            }
            return '-'
          },
        },
        // {
        //   field: 'deployment_time',
        //   title: this.$t('system.text_530'),
        //   formatter: ({ row }) => {
        //     // if (row.deployment && row.deployment.deployment_time) {
        //     //   return this.$moment(row.deployment.deployment_time).format(this.$t('system.text_556'))
        //     // }
        //     if (row.created_at) {
        //       return this.$moment(row.created_at).format()
        //     }
        //     return '-'
        //   },
        // },
      ],
      extraInfo: [],
    }
  },
}
</script>
