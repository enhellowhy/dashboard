<template>
  <div>
    <div class="detail-title">{{$t('loadbalancer.text_21')}}</div>
    <monitor-control v-model="form" @refresh="fetchData" />
    <div class="mt-3">
<!--      <a-row :gutter="8">-->
<!--        <a-col :span="12">-->
<!--          <div class="title mt-2">{{$t('network.text_488', [bpsUnit])}}</div>-->
<!--          <influx-line :options="netOpt" :time-format="timeFormat" />-->
<!--        </a-col>-->
<!--        <a-col :span="12">-->
<!--          <div class="title mt-3">{{$t('network.text_489')}}</div>-->
<!--          <influx-line :options="connectOpt" :time-format="timeFormat" />-->
<!--        </a-col>-->
<!--      </a-row>-->
      <a-row :gutter="8">
        <a-col :span="12">
<!--          <div class="title mt-3">{{$t('loadbalancer.text_20')}}</div>-->
<!--          <influx-line :options="stateOpt" :time-format="timeFormat" />-->
          <monitor-list
            :listData="listData"
            class="mt-3" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>

import { numerify } from '@/filters'
import MonitorControl from './MonitorControl'
import { CEHCK_STATUS_STATE, HAD_DASHBOARD_DATA } from './constants'
// import InfluxLine from './components/Line'
import MonitorList from '@/sections/Monitor/List'
import { lbQuery } from './utils'
import { sizestr, UNITS, getRequestT } from '@/utils/utils'

export default {
  name: 'LblistenerDashboardMonitor',
  components: {
    MonitorControl,
    MonitorList,
    // InfluxLine,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      netOpt: {},
      connectOpt: {},
      negativeOpt: {},
      stateOpt: {},
      monitorList: [],
      bpsUnit: 'B',
      form: {
        time: {
          from: 'now-1h',
        }, // 1个月
        aggregate: 'mean',
      },
    }
  },
  computed: {
    listenerType () {
      return this.data.listener_type.toLowerCase()
    },
    hasDashboard () {
      return HAD_DASHBOARD_DATA.includes(this.data.listener_type)
    },
    timeFormat () {
      const from = this.form.time.from.replace(/\D+/g, '')
      const to = this.form.time.to ? this.form.time.to.replace(/\D+/g, '') : 0
      const timeRange = (from - to) * 3600 // 小时 -> 秒
      if (timeRange <= 3600 * 24) { // 小于1天
        return 'HH:mm:ss'
      } else if (timeRange >= (3600 * 24) && timeRange <= (3600 * 24 * 30)) { // 大于1天，小于30天
        return 'MM-DD HH:mm:ss'
      } else if (timeRange >= (3600 * 24 * 30) && timeRange <= (3600 * 24 * 30 * 12)) { // 大于1月，小于1年
        return 'MM-DD HH:mm:ss'
      } else { // 大于1年
        return 'YYYY-MM-DD HH:mm:ss'
      }
    },
    listData () {
      return this.monitorList.map(val => {
        const columns = (val.series && val.series.length) ? val.series[0].columns : []
        const rows = []

        const getGroupByKey = (tags, groupBy) => {
          const vals = []
          groupBy.forEach((key) => {
            const groupVal = tags[key]
            if (groupVal) {
              vals.push(groupVal)
            }
          })
          return vals.join(' ')
        }
        const format = '0.00' // 默认是保留小数点后两位
        val.series.forEach(item => {
          const tags = item.tags

          let groupByKey = ''
          groupByKey = getGroupByKey(tags, ['rip'])

          const row = {
            name: '',
            xData: [],
            yData: [],
          }
          item.points.forEach(point => {
            item.columns.forEach((column, i) => {
              if (column === 'time') {
                const momentObj = this.$moment(point[i])
                const time = momentObj._isAMomentObject ? momentObj.format(this.timeFormat) : point[0]
                row.xData.push(time)
              } else {
                if (groupByKey.length !== 0) {
                  row.name = groupByKey
                } else {
                  row.name = column
                }
                row.yData.push(numerify(point[i], format))
                // row.yData.push(point[i])
              }
            })
          })
          rows.push(row)
        })

        const unit = ''
        return {
          title: val.title,
          constants: CEHCK_STATUS_STATE.backendsState,
          lineConfig: val.lineConfig,
          noData: columns.length === 0,
          unit,
          chartData: {
            rows,
          },
        }
      }).filter(val => {
        return !(val.constants.noDataHide && val.noData)
        // return !val.noData
      })
    },
  },
  watch: {
    form: {
      deep: true,
      handler () {
        this.fetchData()
      },
    },
    'data.id' (key) {
      this.fetchData()
    },
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.getData('state', this.form.time, this.form.aggregate)
      // this.getData('rate', this.form.time, this.form.aggregate)
      // this.getData('accident', this.form.time, this.form.aggregate)
    },
    async getData (fieldType, time, aggregate) {
      const isRule = this.data.type === 2
      const p = {
        fieldType,
        lsType: this.listenerType,
        lsId: this.data.id,
        // lsId: 'dc0c55c1-5dd6-4c48-855c-c075abe6d34f',
        time,
        aggregate,
        isRule,
        scope: this.$store.getters.scope,
      }
      const { data } = await new this.$Manager('unifiedmonitors', 'v1')
        .performAction({
          id: 'query',
          action: '',
          data: lbQuery(p),
          params: { $t: getRequestT() },
        })
      this._getResultData(data, fieldType)
    },
    _getResultData ({ series }, fieldType) {
      switch (fieldType) {
        case 'bps':
          this.netOpt = this._getSeries(series, true)
          // eslint-disable-next-line no-case-declarations
          const { unit } = this.netOpt
          this.bpsUnit = unit
          break
        case 'rate':
          this.connectOpt = this._getSeries(series)
          break
        case 'state':
          // this.stateOpt = this._getSeries(series)
          this.getMonitorList(series)
          break
        case 'accident':
          // eslint-disable-next-line no-case-declarations
          const obj = {
            chart: {
              grid: {
                top: '25%',
              },
            },
          }
          this.negativeOpt = { ...this._getSeries(series), ...obj }
          break
      }
    },
    _getSeries (S, needCompute) {
      if (S && S[0]) {
        let series = S[0]
        if (needCompute) series = this.__autoCompute(series)
        return series
      }
      return {}
    },
    __autoCompute (series) {
      let { points } = series
      let unit = 'B'
      const deleteTimeValues = points.map(arr => arr.slice(0, arr.length - 1))
      let valueArr = deleteTimeValues.reduce((a, b) => a.concat(b))
      valueArr = valueArr.filter(val => val) // 过滤掉 0
      const maxValue = Math.max.apply(null, valueArr)
      if (maxValue >= 1024 && valueArr && valueArr.length > 0) {
        const maxValueStr = sizestr(maxValue, 'B', 1024)
        unit = maxValueStr.slice(-1) // 'B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'
        let scaleIndex = UNITS.findIndex(val => val === unit)
        scaleIndex = scaleIndex || UNITS[UNITS.length - 1]
        scaleIndex = scaleIndex < 0 ? 0 : scaleIndex
        const scale = Math.pow(1024, scaleIndex)
        points = points.map(arr => {
          return arr.map((item, i, arr) => {
            if (i === (arr.length - 1)) { // time
              return item
            }
            return item / scale
          })
        })
      }
      return {
        ...series,
        points,
        unit,
      }
    },
    getMonitorList (series) {
      const lineConfig = { // 宿主机指标比较多，样式fix
        tooltip: {
          confine: true,
        },
        grid: {
          top: '20%',
        },
      }
      const resList = []
      if (!series) series = []
      resList.push(
        {
          title: this.$t('loadbalancer.text_20'),
          series,
          lineConfig,
        },
      )

      this.monitorList = resList
    },
  },
}
</script>
