<template>
  <detail
    :on-manager="onManager"
    :data="data"
    :base-info="baseInfo" />
</template>

<script>
import {
  getResourceTypeTableColumn,
  getResourceCountTableColumn,
} from '../utils/columns'
import {
  getUserTagColumn,
  getExtTagColumn,
} from '@/utils/common/detailColumn'

export default {
  name: 'ClusterDetail',
  props: {
    data: {
      type: Object,
      required: true,
    },
    onManager: {
      type: Function,
      required: true,
    },
    columns: Array,
  },
  data () {
    return {
      baseInfo: [
        getUserTagColumn({ onManager: this.onManager, resource: 'cluster', columns: () => this.columns, tipName: this.$t('cloudenv.clusters.hosts.text_0') }),
        getExtTagColumn({ onManager: this.onManager, resource: 'cluster', columns: () => this.columns, tipName: this.$t('cloudenv.clusters.hosts.text_0') }),
        getResourceTypeTableColumn(),
        getResourceCountTableColumn(),
        {
          field: 'drs_status',
          title: this.$t('cloudenv.clusters.drs.status'),
          // minWidth: 90,
          slots: {
            default: ({ row }, h) => {
              return [
                <div class='text-truncate'>
                  <status status={ row.drs_enabled } statusModule='enabled' />
                </div>,
              ]
            },
          },
        },
      ],
    }
  },
}
</script>
