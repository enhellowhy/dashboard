<template>
  <monitor
    :time.sync="time"
    :timeGroup.sync="timeGroup"
    :monitorList="monitorList"
    :singleActions="singleActions"
    :loading="loading"
    @refresh="fetchData" />
</template>

<script>
import _ from 'lodash'
import { XSKY_USER_MONITOR_OPTS } from '../constants'
import { UNITS, autoComputeUnit } from '@/utils/utils'
import Monitor from '@/sections/Monitor'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'CloudproviderMonitorSidepage',
  components: {
    Monitor,
  },
  mixins: [WindowsMixin],
  props: {
    resId: {
      type: String,
      required: true,
    },
    data: { // listItemData
      type: Object,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      singleActions: [],
      loading: false,
      time: '1h',
      timeGroup: '5m',
      monitorList: [],
    }
  },
  computed: {
    hostType () {
      return this.data.host_type
    },
    monitorConstants () {
      return XSKY_USER_MONITOR_OPTS
    },
    hostId () {
      return this.data.id
    },
  },
  created () {
    this.fetchData()
    this.fetchDataDebounce = _.debounce(this.fetchData, 500)
    this.baywatch(['time', 'timeGroup', 'data.id'], this.fetchDataDebounce)
  },
  methods: {
    async fetchData () {
      try {
        this.loading = true
        const params = {
          scope: this.$store.getters.scope,
          from: this.time,
          interval: this.timeGroup,
        }
        const { data } = await new this.$Manager('usages', 'v2').getSpecific({
          id: this.resource,
          spec: this.resId,
          params,
        })
        const keyPrefix = 'xsky.eos.os_users.samples'
        this.data = data
        const resList = []
        for (let idx = 0; idx < this.monitorConstants.length; idx++) {
          const val = this.monitorConstants[idx]
          const key = `${keyPrefix}.${val.name}`
          resList.push({
            title: val.label,
            constants: val,
            series: data[key],
          })
          if (idx === this.monitorConstants.length - 1) {
            this.loading = false
            this.getMonitorList(resList)
          }
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        throw error
      }
    },
    baywatch (props, watcher) {
      const iterator = function (prop) {
        this.$watch(prop, watcher)
      }
      props.forEach(iterator, this)
    },
    getMonitorList (resList) {
      const lineConfig = { // 宿主机指标比较多，样式fix
        tooltip: {
          confine: true,
        },
        grid: {
          top: '20%',
        },
      }
      this.monitorList = resList.map(result => {
        const {
          unit,
          transfer,
        } = result.constants
        const isSizestrUnit = UNITS.includes(unit)
        let series = result.series
        if (!series) series = []
        if (isSizestrUnit || unit === 'bps') {
          series = series.map(serie => {
            return autoComputeUnit(serie, unit, transfer)
          })
        }
        return {
          title: result.title,
          series,
          constants: result.constants,
          lineConfig,
        }
      })
    },
  },
}
</script>
