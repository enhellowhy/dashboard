<template>
  <detail
    :on-manager="onManager"
    :data="data"
    :base-info="baseInfo"
    status-module="suggestsysalert"
    :is-edit-desc="false"
    :nameProps="{
      edit: false,
      field: 'res_name',
    }" />
</template>

<script>
import {
  getRuleNameTableColumn,
  getSuggestTableColumn,
} from '../utils/columns'
import { resSidepageMap } from '../constants'
import { getCopyWithContentTableColumn } from '@/utils/common/tableColumn'

export default {
  name: 'SuggestsalertDetail',
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
          field: 'res_name',
          title: this.$t('bill.text_72'),
          hideField: true,
          slotCallback: row => {
            if (!row.name) return '-'
            return [<side-page-trigger onTrigger={ () => this.handleOpenResDetail(row) }>{ row.res_name }</side-page-trigger>]
          },
        }),
        getRuleNameTableColumn(),
        getSuggestTableColumn(),
      ],
    }
  },
  methods: {
    handleOpenResDetail (row) {
      const resInfo = resSidepageMap[row.type]
      if (resInfo) {
        this.$emit('init-side-page-tab', resInfo.initSidePageTab)
        this.$emit('side-page-trigger-handle', this, resInfo.sidePageTriggerHandle, {
          id: row.res_id,
          resource: resInfo.resource,
          apiVersion: 'v2',
        }, {
          cancel: () => {
            this.$emit('single-refresh', this.data.id)
          },
        })
      }
    },
  },
}
</script>
