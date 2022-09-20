<template>
  <div class="storage-list">
    <h3>{{ title }}</h3>
    <vxe-grid
      highlight-hover-row
      class="mb-2"
      :data="data"
      :columns="columns" />
  </div>
</template>

<script>
import { sizestrWithUnit, tenthousandstr } from '@/utils/utils'

export default {
  name: 'Usages',
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
          field: 'buckets',
          title: this.$t('dashboard.text_154'),
          minWidth: 80,
          showOverflow: 'title',
          formatter: ({ cellVal, row }) => {
            return row.bucket_num
          },
        },
        {
          field: 'capacity',
          title: this.$t('storage.capacity'),
          minWidth: 80,
          showOverflow: 'title',
          formatter: ({ cellVal, row }) => {
            return sizestrWithUnit(row.allocated_size, 'B', 1024)
          },
        },
        {
          field: 'objects',
          title: this.$t('storage.objects'),
          minWidth: 80,
          showOverflow: 'title',
          formatter: ({ cellVal, row }) => {
            return tenthousandstr(row.allocated_objects, '个', 10000)
          },
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.storage-list {
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
