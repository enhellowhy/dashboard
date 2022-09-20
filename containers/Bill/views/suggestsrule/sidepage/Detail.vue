<template>
  <detail
    :on-manager="onManager"
    :data="data"
    :isEditDesc="false"
    :isEditName="false"
    :base-info="baseInfo" />
</template>

<script>
import {
  getSettingTableColumn,
  getPeriodTableColumn,
  getTimeFromTableColumn,
} from '../utils/columns'
import {
  getEnabledTableColumn,
} from '@/utils/common/tableColumn'

export default {
  name: 'SuggestsRuleDetail',
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
        getEnabledTableColumn(),
        getSettingTableColumn(),
        getPeriodTableColumn(),
        getTimeFromTableColumn(),
        {
          field: 'exec_time',
          title: this.$t('bill.text_218'),
          minWidth: 70,
          showOverflow: 'title',
          formatter: ({ row, cellValue }) => {
            if (!cellValue) {
              return '-'
            }
            return this.$moment(cellValue).format()
          },
        },
      ],
    }
  },
}
</script>
