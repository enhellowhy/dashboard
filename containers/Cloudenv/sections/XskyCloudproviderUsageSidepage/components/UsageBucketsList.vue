<template>
  <div class="bucket-list">
    <h3>{{ title }}</h3>
    <vxe-grid
      highlight-hover-row
      class="mb-2"
      :data="data"
      :columns="columns" />
  </div>
</template>

<script>
import { sizestrWithUnit, sizestr } from '@/utils/utils'

export default {
  name: 'UsageBucketsRing',
  props: {
    title: {
      type: String,
    },
    field: {
      type: String,
    },
    data: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  data () {
    return {
      columns: [
        {
          field: 'name',
          title: this.$t('cloudenv.buckets'),
          sortable: true,
          minWidth: 80,
          showOverflow: 'title',
          formatter: ({ cellVal, row }) => {
            return row.name
          },
        },
        {
          field: 'local',
          title: this.$t('cloudenv.xsky.eos.local.objects.size'),
          minWidth: 80,
          showOverflow: 'title',
          formatter: ({ cellVal, row }) => {
            return sizestr(row.local_allocated_objects, 'B', 1000) + '/' + sizestrWithUnit(row.local_allocated_size, 'B', 1024)
          },
        },
        {
          field: 'external',
          title: this.$t('cloudenv.xsky.eos.external.objects.size'),
          minWidth: 80,
          showOverflow: 'title',
          formatter: ({ cellVal, row }) => {
            return sizestr(row.external_allocated_objects, 'B', 1000) + '/' + sizestrWithUnit(row.external_allocated_size, 'B', 1024)
          },
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.bucket-list {
  width: 100%;
  height: 197px;
  padding: 20px 10px;
  margin-bottom: 16px;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
  h3 {
    font-size: 14px;
    font-weight: bolder;
  }
  .label {
    font-size: 14px;
    font-weight: bolder;
  }
}
</style>
