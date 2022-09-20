<template>
  <div>
    <div v-if="hadMonitor">
<!--      <monitor-->
<!--        :time.sync="time"-->
<!--        :timeGroup.sync="timeGroup"-->
<!--        :monitorList="monitorList"-->
<!--        :loading="loading"-->
<!--        @refresh="fetchData" />-->
      <monitor-control v-model="form" :time.sync="time" :loading="loading" :listenerOpts="listenerList" @refresh="fetchData" />
      <monitor-list
        :listData="listData"
        :loading="loading"
        class="mt-3" />
    </div>
    <template v-else>
      <a-alert
        :message="$t('db.text_183')"
        class="mb-2"
        type="warning" />
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import * as R from 'ramda'
import { numerify } from '@/filters'
import { LB_MONITOR_OPTS } from '@Loadbalancer/constants/lb'
import { UNITS, autoComputeUnit, autoComputeUnitWithMaxValue, getRequestT } from '@/utils/utils'
import MonitorControl from './MonitorControl'
// import Monitor from '@/sections/Monitor'
import MonitorList from '@/sections/Monitor/List'
import WindowsMixin from '@/mixins/windows'
import { HYPERVISORS_MAP } from '@/constants'
import { getSignature } from '@/utils/crypto'

export default {
  name: 'LbMnitorSidepage',
  components: {
    // Monitor,
    MonitorList,
    MonitorControl,
  },
  mixins: [WindowsMixin],
  props: {
    data: { // listItemData
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      loading: false,
      time: '1h',
      timeGroup: '5m',
      monitorList: [],
      listenerList: [],
      filterList: ['dpvs_in_bytes_total', 'dpvs_out_bytes_total', 'dpvs_in_packets_total', 'dpvs_out_packets_total'],
      form: {
        time: {
          from: 'now-1h',
        }, // 1个月
        // aggregate: 'mean',
        listener: '',
        showBackend: false,
      },
    }
  },
  computed: {
    brand () {
      if (this.data.brand) {
        return this.data.brand.toLowerCase()
      }
      return ''
    },
    hadMonitor () {
      const brand = this.data.brand.toLowerCase()
      const surportBrand = [HYPERVISORS_MAP.azure.key, HYPERVISORS_MAP.kvm.brand.toLowerCase()]
      return surportBrand.includes(brand)
    },
    monitorConstants () {
      const brand = this.brand
      return LB_MONITOR_OPTS[brand] || []
    },
    dbId () {
      return this.data.id
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
        const getRowId = (group, rows) => {
          let id = -1
          rows.some((row, i) => {
            if (row.name === group) {
              console.log(i, row.name)
              id = i
              return true
            }
          })
          return id
        }
        const format = val.constants.format || '0.00' // 默认是保留小数点后两位

        if (!this.form.showBackend) {
          val.series.forEach((item, index) => {
            if (rows.length !== 0) {
              item.points.forEach((point, i) => {
                if (i < rows[0].yData.length) {
                  if (this.filterList.includes(val.constants.name)) {
                    rows[0].yData[i] = rows[0].yData[i] + ((point[0] - point[1]) / point[2])
                  } else {
                    rows[0].yData[i] = rows[0].yData[i] + point[0]
                  }
                  // if (index === val.series.length - 1) {
                  //   rows[0].yData[i] = numerify(rows[0].yData[i], format)
                  // }
                }
              })
            } else {
              const row = {
                name: '',
                xData: [],
                yData: [],
              }
              item.points.forEach(point => {
                if (this.filterList.includes(val.constants.name)) {
                  const col = [val.constants.as, 'time']
                  col.forEach(column => {
                    if (column === 'time') {
                      const momentObj = this.$moment(point[3])
                      const time = momentObj._isAMomentObject ? momentObj.format(this.timeFormatStr) : point[3]
                      row.xData.push(time)
                    } else {
                      row.name = column
                      row.yData.push((point[0] - point[1]) / point[2])
                    }
                  })
                } else {
                  item.columns.forEach((column, i) => {
                    if (column === 'time') {
                      const momentObj = this.$moment(point[i])
                      const time = momentObj._isAMomentObject ? momentObj.format(this.timeFormatStr) : point[0]
                      row.xData.push(time)
                    } else {
                      row.name = column
                      row.yData.push(point[i])
                    }
                  })
                }
              })
              rows.push(row)
            }
          })
        } else {
          val.series.forEach(item => {
            const tags = item.tags

            let groupByKey = ''
            if (val.constants.groupBy && val.constants.groupBy.length !== 0) {
              groupByKey = getGroupByKey(tags, val.constants.groupBy)
            }

            let rowId = -1
            if ((groupByKey.length !== 0) && (rows.length !== 0)) {
              rowId = getRowId(groupByKey, rows)
            }

            if (rowId === -1) {
              const row = {
                name: '',
                xData: [],
                yData: [],
              }
              item.points.forEach(point => {
                if (this.filterList.includes(val.constants.name)) {
                  const col = [val.constants.as, 'time']
                  col.forEach(column => {
                    if (column === 'time') {
                      const momentObj = this.$moment(point[3])
                      const time = momentObj._isAMomentObject ? momentObj.format(this.timeFormatStr) : point[3]
                      row.xData.push(time)
                    } else {
                      row.name = groupByKey
                      // if (groupByKey.length !== 0) {
                      //   row.name = groupByKey
                      // } else {
                      //   row.name = column
                      // }
                      row.yData.push((point[0] - point[1]) / point[2])
                    }
                  })
                } else {
                  item.columns.forEach((column, i) => {
                    if (column === 'time') {
                      const momentObj = this.$moment(point[i])
                      const time = momentObj._isAMomentObject ? momentObj.format(this.timeFormatStr) : point[0]
                      row.xData.push(time)
                    } else {
                      row.name = groupByKey
                      row.yData.push(point[i])
                    }
                  })
                }
              })
              rows.push(row)
            } else {
              item.points.forEach((point, i) => {
                if (i < rows[rowId].yData.length) {
                  if (this.filterList.includes(val.constants.name)) {
                    rows[rowId].yData[i] = rows[rowId].yData[i] + ((point[0] - point[1]) / point[2])
                  } else {
                    // rows[rowId].yData[i] = rows[rowId].yData[i] + numerify(point[0], format)
                    rows[rowId].yData[i] = rows[rowId].yData[i] + point[0]
                  }
                }
              })
            }
          })
        }

        let unit = _.get(val.series, '[0].unit') || val.constants.unit || ''
        if (rows.length !== 0) {
          if (val.constants.name === 'dpvs_out_bytes_total' || val.constants.name === 'dpvs_in_bytes_total') {
            let maxValue = 0
            rows.forEach(row => {
              maxValue = Math.max.apply(null, row.yData)
            })
            let scale = 1
            if (maxValue !== 0) {
              const unitScale = autoComputeUnitWithMaxValue(val.constants.unit, val.constants.transfer, maxValue)
              console.log('unit', unitScale.unit)
              unit = unitScale.unit
              scale = unitScale.scale
            }
            rows.forEach(row => {
              row.yData.forEach((data, i) => {
                row.yData[i] = numerify(data / scale, format)
              })
            })
          } else {
            rows.forEach(row => {
              row.yData.forEach((data, i) => {
                row.yData[i] = numerify(data, format)
              })
            })
          }
        }
        return {
          title: val.title,
          constants: val.constants,
          lineConfig: val.lineConfig,
          noData: columns.length === 0,
          unit,
          chartData: {
            rows,
          },
        }
      }).filter(val => {
        return !(val.constants.noDataHide && val.noData)
      })
    },
  },
  created () {
    // this.fetchListener()
    this.fetchData(this.form.listener)
    this.fetchDataDebounce = _.debounce(this.fetchData, 500)
    this.baywatch(['time', 'timeGroup', 'data.id', 'form.time', 'form.listener', 'form.showBackend'], this.fetchDataDebounce)
  },
  methods: {
    async fetchData () {
      this.loading = true
      let listenerList = []
      if (this.listenerList.length === 0) {
        const manager = new this.$Manager('loadbalancerlisteners')
        try {
          const params = {
            loadbalancer: this.dbId,
            scope: this.$store.getters.scope,
            limit: 0,
          }
          const ret = await manager.list({
            params,
          })
          listenerList = ret.data.data || []
          listenerList.map(item => {
            this.listenerList.push({
              label: item.listener_type.toUpperCase() + ': ' + item.listener_port,
              port: item.listener_port,
              type: item.listener_type,
              id: item.id,
            })
          })
          this.form.listener = this.listenerList[0].id
        } catch (err) {
          this.loading = false
          throw err
        }
      }
      const resList = []
      for (let idx = 0; idx < this.monitorConstants.length; idx++) {
        const val = this.monitorConstants[idx]
        try {
          const { data } = await new this.$Manager('unifiedmonitors', 'v1')
            .performAction({
              id: 'query',
              action: '',
              data: this.genQueryData(val),
              params: { $t: getRequestT() },
            })
          resList.push({ title: val.label, constants: val, series: data.series })
          if (idx === this.monitorConstants.length - 1) {
            this.loading = false
            this.getMonitorList(resList)
          }
        } catch (error) {
          this.loading = false
          throw error
        }
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
        const { unit, transfer } = result.constants
        const isSizestrUnit = UNITS.includes(unit)
        let series = result.series
        if (!series) series = []
        if (isSizestrUnit || unit === 'bps') {
          if (result.constants.name !== 'dpvs_out_bytes_total' && result.constants.name !== 'dpvs_in_bytes_total') {
          // if (!this.filterList.includes(result.constants.name)) {
            series = series.map(serie => {
              return autoComputeUnit(serie, unit, transfer)
            })
          }
        }
        return {
          title: result.title,
          series,
          constants: result.constants,
          lineConfig,
        }
      })
    },
    genQueryData (val) {
      let select = []
      if (this.filterList.includes(val.name)) {
        const max = [
          {
            type: 'field',
            params: ['value'],
          },
          { // 对应 mean(val.seleteItem)
            type: 'max',
            params: [],
          },
          { // 确保后端返回columns有 val.label 的别名
            type: 'alias',
            params: ['最大值'],
          },
        ]
        const min = [
          {
            type: 'field',
            params: ['value'],
          },
          { // 对应 mean(val.seleteItem)
            type: 'min',
            params: [],
          },
          { // 确保后端返回columns有 val.label 的别名
            type: 'alias',
            params: ['最小值'],
          },
        ]
        const count = [
          {
            type: 'field',
            params: ['value'],
          },
          { // 对应 mean(val.seleteItem)
            type: 'count',
            params: [],
          },
          { // 确保后端返回columns有 val.label 的别名
            type: 'alias',
            params: ['计数'],
          },
        ]
        select.push(max)
        select.push(min)
        select.push(count)
      } else {
        const asItems = val.as.split(',')
        select = val.seleteItem.split(',').map((val, i) => {
          return [
            {
              type: 'field',
              params: [val],
            },
            { // 对应 mean(val.seleteItem)
              type: val.selectType ? val.selectType : 'mean',
              params: [],
            },
            { // 确保后端返回columns有 val.label 的别名
              type: 'alias',
              params: [asItems[i]],
            },
          ]
        })
      }
      const tags = [
        {
          key: 'listener_uuid',
          value: this.form.listener,
          // value: 'dc0c55c1-5dd6-4c48-855c-c075abe6d34f',
          operator: '=',
        },
      ]
      const group_by = [
        {
          type: 'tag',
          params: ['listener_uuid'],
        },
        {
          type: 'tag',
          params: ['instance'],
        },
        {
          type: 'tag',
          params: ['rip'],
        },
      ]
      // if (val.groupBy && (val.groupBy.length !== 0) && this.form.showBackend) {
      //   val.groupBy.forEach(group => {
      //     group_by.push({
      //       type: 'tag',
      //       params: [group],
      //     })
      //   })
      // }

      if (R.is(Object, val.tags)) {
        R.forEachObjIndexed((value, key) => {
          tags.push({
            condition: 'AND',
            key,
            value,
            operator: '=',
          })
        }, val.tags)
      }
      const from = this.form.time.from.replace(/\D+/g, '')
      const to = this.form.time.to ? this.form.time.to.replace(/\D+/g, '') : 0
      const timeDiff = (from - to) * 3600 // 小时 -> 秒
      // console.log('timeDiff')
      // console.log(timeDiff)
      // let interval = `${timeDiff / 50}s`
      let interval = '5m'
      if (timeDiff <= 3600 * 3) { // 3小时内
        interval = '5s'
      } else if (timeDiff > (3600 * 3) && timeDiff <= (3600 * 6)) { // 大于3小时，6小时内
        interval = '15s'
      } else if (timeDiff > (3600 * 6) && timeDiff <= (3600 * 24)) { // 大于6小时，1天内
        interval = '1m'
      } else if (timeDiff > (3600 * 24) && timeDiff <= (3600 * 24 * 3)) { // 大于1天，3天内
        interval = '2m'
      } else { // 大于3天
        interval = '5m'
      }
      // const timeObj = {
      //   from: time.from,
      //   to: time.to ? 'now' : time.to,
      // }
      const data = {
        metric_query: [
          {
            model: {
              measurement: val.fromItem,
              database: 'prometheus',
              group_by,
              select,
              tags,
            },
          },
        ],
        scope: this.$store.getters.scope,
        from: this.form.time.from,
        to: this.form.time.to ? this.form.time.to : 'now',
        interval: interval,
        // from: this.time,
        // interval: this.timeGroup,
        unit: true,
      }
      data.signature = getSignature(data)
      return data
    },
  },
}
</script>
