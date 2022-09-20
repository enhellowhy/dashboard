<template>
  <div>
    <loading-block v-if="loading" />
    <template v-else>
      <a-row class="d-flex" :gutter="16">
        <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" v-for="obj in objectsInfo" :key="obj.field">
<!--          <usage-user-objects-data :title="obj.title" :value="obj.options" /> 打脸不，用value传，还说options是undefined-->
          <usage-objects-data :title="obj.title" :options="obj.options" />
        </a-col>
      </a-row>
      <a-row class="d-flex mb-2" :gutter="{ lg: 24, xl: 12, xxl: 24 }">
        <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" v-for="obj in sizeInfo" :key="obj.field">
          <usage-size-data :title="obj.title" :options="obj.options" />
        </a-col>
      </a-row>
      <a-row class="d-flex mb-2" :gutter="{ lg: 24, xl: 12, xxl: 24 }">
        <a-col class="flex-fill" :lg="12" :xl="8" v-for="obj in localStorageClassList" :key="obj.field">
          <usage-storage-class-list :title="obj.title" :data="obj.data" />
        </a-col>
      </a-row>
      <a-row class="d-flex mb-2" :gutter="{ lg: 24, xl: 12, xxl: 24 }">
        <a-col class="flex-fill" :lg="12" :xl="8" v-for="obj in externalStorageClassList" :key="obj.field">
          <usage-storage-class-list :title="obj.title" :data="obj.data" />
        </a-col>
      </a-row>
    </template>
  </div>
</template>

<script>
import {
  SIZE_DATA,
  OBJECTS_DATA,
  LOCAL_STORAGE_CLASSES,
  EXTERNAL_STORAGE_CLASSES,
} from './constants'
import UsageObjectsData from './components/UsageObjectsData'
import UsageSizeData from './components/UsageSizeData'
import UsageStorageClassList from './components/UsageStorageClassList'

export default {
  name: 'UsageSidepage',
  components: {
    UsageObjectsData,
    UsageSizeData,
    UsageStorageClassList,
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
      sizeInfo: [],
      objectsInfo: [],
      localStorageClassList: [],
      externalStorageClassList: [],
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    initObjectsInfo () {
      const userObjectsInfo = []
      OBJECTS_DATA.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos.os_buckets.usages'
        }
        const allKey = `${key}.${obj.all}`
        const localKey = `${key}.${obj.local}`
        const externalKey = `${key}.${obj.external}`
        const allQuota = `${key}.${obj.all_quota}`
        const localQuota = `${key}.${obj.local_quota}`
        const externalQuota = `${key}.${obj.external_quota}`

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
              allQuota: this.data[allQuota],
              localQuota: this.data[localQuota],
              externalQuota: this.data[externalQuota],
            },
          },
        })
      })
      return userObjectsInfo
    },
    initSizeInfo () {
      const userSizeInfo = []
      SIZE_DATA.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos.os_buckets.usages'
        }
        const allKey = `${key}.${obj.all}`
        const localKey = `${key}.${obj.local}`
        const externalKey = `${key}.${obj.external}`
        const allQuota = `${key}.${obj.all_quota}`
        const localQuota = `${key}.${obj.local_quota}`
        const externalQuota = `${key}.${obj.external_quota}`

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
              allQuota: this.data[allQuota],
              localQuota: this.data[localQuota],
              externalQuota: this.data[externalQuota],
            },
          },
        })
      })
      return userSizeInfo
    },
    initLocalStorageClassList () {
      const localStorageClassList = []
      LOCAL_STORAGE_CLASSES.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos.os_buckets.usages'
        }
        const k = key ? `${key}.${obj.name}` : obj.name

        localStorageClassList.push({
          name: obj.label,
          title: obj.label,
          data: this.data[k],
        })
      })
      return localStorageClassList
    },
    initExternalStorageClassList () {
      const externalStorageClassList = []
      EXTERNAL_STORAGE_CLASSES.forEach((obj) => {
        let key = ''
        if (!obj.noPerfix) {
          key = 'xsky.eos.os_buckets.usages'
        }
        const k = key ? `${key}.${obj.name}` : obj.name

        externalStorageClassList.push({
          name: obj.label,
          title: obj.label,
          data: this.data[k],
        })
      })
      return externalStorageClassList
    },
    async fetchData () {
      try {
        this.loading = true
        const { data } = await new this.$Manager('buckets')
          .performAction({
            id: this.resId,
            action: 'sync-usages',
          })
        // const { data } = await new this.$Manager('usages', 'v2').getSpecific({
        //   id: this.resource,
        //   spec: this.resId,
        //   params,
        // })
        this.data = data
        this.sizeInfo = this.initSizeInfo()
        this.objectsInfo = this.initObjectsInfo()
        this.localStorageClassList = this.initLocalStorageClassList()
        this.externalStorageClassList = this.initExternalStorageClassList()
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
