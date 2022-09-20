<template>
  <div>
    <loading-block v-if="loading" />
    <template v-else>
      <a-row class="d-flex" :gutter="16">
        <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" v-for="obj in ringInfo" :key="obj.field">
          <usage-buckets-ring :title="obj.title" :field="obj.field" :options="obj.options" />
        </a-col>
      </a-row>
      <a-row class="d-flex" :gutter="16">
        <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" v-for="obj in userObjectsInfo" :key="obj.field">
<!--          <usage-user-objects-data :title="obj.title" :value="obj.options" /> 打脸不，用value传，还说options是undefined-->
          <usage-user-objects-data :title="obj.title" :options="obj.options" />
        </a-col>
      </a-row>
      <a-row class="d-flex mb-2" :gutter="{ lg: 24, xl: 12, xxl: 24 }">
        <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" v-for="obj in userSizeInfo" :key="obj.field">
          <usage-user-size-data :title="obj.title" :options="obj.options" />
        </a-col>
      </a-row>
      <a-row class="d-flex mb-2" :gutter="{ lg: 24, xl: 12, xxl: 24 }">
        <a-col class="flex-fill" :lg="12" :xl="8" v-for="obj in bucketList" :key="obj.field">
          <usage-buckets-list :title="obj.title" :data="obj.data" />
        </a-col>
      </a-row>
    </template>
  </div>
</template>

<script>
import {
  USER_SIZE_DATA,
  USER_OBJECTS_DATA,
  BUCKET_LIST,
  USAGE_BUCKETS_RING,
} from './constants'
import UsageUserObjectsData from './components/UsageUserObjectsData'
import UsageUserSizeData from './components/UsageUserSizeData'
import UsageBucketsRing from './components/UsageBucketsRing'
import UsageBucketsList from './components/UsageBucketsList'

export default {
  name: 'CloudenvUsageSidepage',
  components: {
    UsageUserObjectsData,
    UsageUserSizeData,
    UsageBucketsRing,
    UsageBucketsList,
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
      userSizeInfo: [],
      userObjectsInfo: [],
      bucketList: [],
      ringInfo: [],
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    initUserObjectsInfo () {
      const userObjectsInfo = []
      USER_OBJECTS_DATA.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos.os_users'
        }
        const allKey = `${key}.${obj.all}`
        const localKey = `${key}.${obj.local}`
        const externalKey = `${key}.${obj.external}`

        userObjectsInfo.push({
          field: obj.name,
          title: obj.name,
          options: {
            label: {
              all: obj.all_label,
              local: obj.local_label,
              external: obj.external_label,
            },
            value: {
              all: this.data[allKey],
              local: this.data[localKey],
              external: this.data[externalKey],
            },
          },
        })
      })
      return userObjectsInfo
    },
    initUserSizeInfo () {
      const userSizeInfo = []
      USER_SIZE_DATA.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos.os_users'
        }
        const allKey = `${key}.${obj.all}`
        const localKey = `${key}.${obj.local}`
        const externalKey = `${key}.${obj.external}`

        userSizeInfo.push({
          field: obj.name,
          title: obj.name,
          options: {
            label: {
              all: obj.all_label,
              local: obj.local_label,
              external: obj.external_label,
            },
            value: {
              all: this.data[allKey],
              local: this.data[localKey],
              external: this.data[externalKey],
            },
          },
        })
      })
      return userSizeInfo
    },
    initRingInfo () {
      const ringInfo = []
      const getUnuse = (sum = 0, use = 0) => {
        return sum - use
      }
      USAGE_BUCKETS_RING.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos.os_users'
        }
        const sum = `${key}.${obj.sum}`
        const use = `${key}.${obj.use}`

        ringInfo.push({
          field: sum,
          title: obj.name,
          options: {
            label: {
              sum: obj.sum_label || this.$t('common_234'),
              use: obj.use_label,
              unuse: obj.unuse_label,
            },
            value: {
              sum: this.data[sum],
              use: this.data[use],
              unuse: getUnuse(this.data[sum], this.data[use]),
            },
          },
        })
      })
      return ringInfo
    },
    initBucketList () {
      const bucketList = []
      BUCKET_LIST.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos.os_users'
        }
        const buckets = key ? `${key}.${obj.name}` : obj.name

        bucketList.push({
          name: obj.label,
          title: obj.label,
          data: this.data[buckets],
        })
      })
      return bucketList
    },
    async fetchData () {
      try {
        this.loading = true
        const params = { scope: this.$store.getters.scope }
        const { data } = await new this.$Manager('usages', 'v2').getSpecific({
          id: this.resource,
          spec: this.resId,
          params,
        })
        this.data = data
        this.ringInfo = this.initRingInfo()
        this.userSizeInfo = this.initUserSizeInfo()
        this.userObjectsInfo = this.initUserObjectsInfo()
        this.bucketList = this.initBucketList()
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
