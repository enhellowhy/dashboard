<template>
  <div>
    <loading-block v-if="loading" />
    <!-- <detail
      v-else
      :data="data"
      :base-info="baseInfo"
      :on-manager="onManager"
      :showDesc="false"
      :hiddenKeys="['id', 'name', 'status', 'project_domain', 'tenant', 'created_at', 'updated_at']" /> -->
    <template v-else>
      <a-row class="d-flex" :gutter="16">
        <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" v-for="obj in allocatedInfo" :key="obj.field">
          <usage-double-quota :title="obj.title" :options="obj.options" />
        </a-col>
      </a-row>
      <a-row class="d-flex" :gutter="16">
        <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" v-for="obj in ringInfo" :key="obj.field">
          <usage-ring :title="obj.title" :field="obj.field" :options="obj.options" />
        </a-col>
        <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" v-for="obj in dnsInfo" :key="obj.field">
          <usage-dns :title="obj.title" :label="obj.field" :value="obj.value()" />
        </a-col>
      </a-row>
      <a-row class="d-flex" :gutter="16">
        <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" v-for="obj in baseInfo" :key="obj.field">
          <usage-quota :title="obj.title" :value="obj.value()" />
        </a-col>
      </a-row>
      <a-row class="mb-2" :gutter="{ lg: 24, xl: 12, xxl: 24 }">
        <a-col class="mb-3" :lg="12" :xl="8" v-for="item in userTopList" :key="item.name">
          <top5 :topMsg="item" />
        </a-col>
      </a-row>
      <a-row class="mb-2" :gutter="{ lg: 24, xl: 12, xxl: 24 }">
        <a-col class="mb-3" :lg="12" :xl="8" v-for="item in bucketTopList" :key="item.name">
          <top5 :topMsg="item" />
        </a-col>
      </a-row>
    </template>
  </div>
</template>

<script>
import * as R from 'ramda'
import Top5 from './components/Top5'
import { USAGE_ALLOCATED_DATAS, USAGE_CONFIG_MAP, USAGE_DNS_DATAS, USAGE_RING_DATAS, USER_TOP5, BUCKET_TOP5 } from './constants'
import UsageQuota from './components/UsageQuota'
import UsageDoubleQuota from './components/UsageDoubleQuota'
import UsageRing from './components/UsageRing'
import UsageDns from './components/UsageDNS'

export default {
  name: 'CloudenvUsageSidepage',
  components: {
    UsageQuota,
    UsageDns,
    UsageDoubleQuota,
    UsageRing,
    Top5,
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
      allocatedInfo: [],
      baseInfo: [],
      ringInfo: [],
      dnsInfo: [],
      userTopList: [],
      bucketTopList: [],
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    initBaseInfo () {
      const baseInfo = []
      Object.keys(USAGE_CONFIG_MAP).forEach((key) => {
        const item = USAGE_CONFIG_MAP[key] || {}
        if (!item.noPerfix) {
          key = `xsky.eos.${key}`
        }
        baseInfo.push({
          field: key,
          title: item.zh_cn || key,
          value: () => {
            return R.is(Function, item.formatter) ? item.formatter(this.data[key]) : `${this.data[key] || 0} ${item.unit || ''}`
          },
        })
      })
      return baseInfo
    },
    initDnsInfo () {
      const dnsInfo = []
      USAGE_DNS_DATAS.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos'
        }
        const dns = key ? `${key}.${obj.eos_dns}` : obj.eos_dns
        dnsInfo.push({
          field: obj.eos_dns_label,
          title: obj.name,
          value: () => {
            return this.data[dns]
          },
        })
      })
      return dnsInfo
    },
    initAllocatedInfo () {
      const allocatedInfo = []
      USAGE_ALLOCATED_DATAS.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos'
        }
        const objects = key ? `${key}.${obj.objects}` : obj.objects
        const size = key ? `${key}.${obj.size}` : obj.size

        allocatedInfo.push({
          field: obj.name,
          title: obj.name,
          options: {
            label: {
              objects: obj.objects_label,
              size: obj.size_label,
            },
            value: {
              objects: this.data[objects],
              size: this.data[size],
            },
          },
        })
      })
      return allocatedInfo
    },
    initRingInfo () {
      const ringInfo = []
      USAGE_RING_DATAS.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos'
        }
        const name = key ? `${key}.${obj.eos_name}` : obj.eos_name
        const pool = key ? `${key}.${obj.eos_index_pool}` : obj.eos_index_pool
        const status = key ? `${key}.${obj.eos_status}` : obj.eos_status

        ringInfo.push({
          field: obj.name,
          title: obj.name,
          options: {
            label: {
              eosName: obj.eos_name_label,
              eosStatus: obj.eos_status_label,
              eosIndexpool: obj.eos_index_pool_label,
            },
            value: {
              eosName: this.data[name],
              eosIndexpool: this.data[pool],
              eosStatus: this.data[status],
            },
          },
        })
      })
      return ringInfo
    },
    initUserTopList () {
      const userTopList = []
      USER_TOP5.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos.user'
        }
        const users = key ? `${key}.${obj.name}` : obj.name

        userTopList.push({
          name: obj.label,
          title: obj.label,
          data: this.data[users],
          unit: obj.unit,
        })
      })
      return userTopList
    },
    initBucketTopList () {
      const bucketTopList = []
      BUCKET_TOP5.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos.bucket'
        }
        const buckets = key ? `${key}.${obj.name}` : obj.name

        bucketTopList.push({
          name: obj.label,
          title: obj.label,
          data: this.data[buckets],
          unit: obj.unit,
        })
      })
      return bucketTopList
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
        this.dnsInfo = this.initDnsInfo()
        this.baseInfo = this.initBaseInfo()
        this.ringInfo = this.initRingInfo()
        this.allocatedInfo = this.initAllocatedInfo()
        this.userTopList = this.initUserTopList()
        this.bucketTopList = this.initBucketTopList()
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
