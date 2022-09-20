<template>
  <div>
    <loading-block v-if="loading" />
    <template v-else>
      <a-row class="d-flex mb-2" :gutter="{ lg: 24, xl: 12, xxl: 24 }">
<!--        <a-col class="flex-fill" :lg="12" :xl="8" v-for="obj in bucketStatistics" :key="bucketStatistics.field">-->
        <a-col class="flex-fill" :lg="12" :xl="8" :key="bucketStatistics.field">
          <usages :title="bucketStatistics.title" :data="bucketStatistics.data" />
        </a-col>
      </a-row>
    </template>
  </div>
</template>

<script>
import {
  BUCKET_USAGES,
} from './constants'
import Usages from './components/Usages'

export default {
  name: 'ProjectUsagesStatistics',
  components: {
    Usages,
  },
  props: {
    onManager: {
      type: Function,
      required: true,
    },
    resId: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      data: {},
      loading: false,
      bucketStatistics: {},
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    initBucketStatistics () {
      const bucketStatistics = {}
      BUCKET_USAGES.forEach((obj) => {
        const k = obj.name
        bucketStatistics.name = obj.label
        bucketStatistics.title = obj.label
        bucketStatistics.data = this.data[k]
      })
      return bucketStatistics
    },
    async fetchData () {
      try {
        this.loading = true
        const { data } = await new this.$Manager('projects', 'v1')
          .performAction({
            id: this.resId,
            action: 'sync-usages',
          })
        this.data = data
        this.bucketStatistics = this.initBucketStatistics()
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="less" scoped>
::v-deep .detail-item {
  .detail-item-title {
    width: 220px !important;
  }

  .detail-item-value {
    margin-left: 220px;
  }
}
</style>
