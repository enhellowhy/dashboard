<template>
  <div>
    <a-radio-group v-model="time.dateMode" @change="handleDateModeChange">
      <a-radio-button v-for="item in timeOpts" :key="item.key" :value="item.key">{{ item.label }}</a-radio-button>
      <custom-date :customDate.sync="customDate" :time.sync="time.dateMode" :suffix="suffix" />
    </a-radio-group>
  </div>
</template>

<script>
import CustomDate from './CustomDate'
import { TIME_SIZE } from '@Bill/constants'
import i18n from '@/locales'

export default {
  name: 'BillDateTime',
  components: {
    CustomDate,
  },
  props: {
    getParams: {
      type: Object,
      default: () => ({}),
    },
    dateReplace: {
      type: Boolean,
      default: false,
    },
    start: {
      type: String,
      default: 'start_date',
    },
    end: {
      type: String,
      default: 'end_date',
    },
    supportDatatype: {
      type: Boolean,
      default: false,
    },
    timeOpts: {
      type: Array,
      default: () => [
        { key: 'month', label: i18n.t('bill.text_50') },
        { key: 'last_month', label: i18n.t('bill.text_51') },
        { key: 'quarter', label: i18n.t('bill.text_52') },
        { key: 'last_quarter', label: i18n.t('bill.text_53') },
        { key: 'year', label: i18n.t('bill.text_54') },
      ],
    },
    monthToEnd: { // 选择本月指定到月末
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      time: {
        dateMode: 'month',
        date: [],
      },
      customDate: {
        start: null,
        end: null,
      },
      suffix: '',
    }
  },
  watch: {
    customDate () {
      this.handleDateModeChange()
    },
    'time.dateMode' (v) {
      this.$emit('update:dateMode', v)
    },
  },
  created () {
    this.handleDateModeChange()
    this.$emit('update:dateMode', this.time.dateMode)
  },
  methods: {
    handleDateModeChange () {
      let start = this.$moment()
      let end = this.$moment()
      let suffix = ''
      if (this.time.dateMode === 'month') {
        start = this.$moment().startOf('month')
        if (this.monthToEnd) {
          end = this.$moment().endOf('month')
        }
      } else if (this.time.dateMode === 'last_month') {
        start = this.$moment().subtract(1, 'month').startOf('month')
        end = this.$moment().subtract(1, 'month').endOf('month')
      } else if (this.time.dateMode === 'quarter') {
        start = this.$moment().startOf('quarter')
        end = this.$moment().endOf('quarter')
      } else if (this.time.dateMode === 'last_quarter') {
        start = this.$moment().subtract(1, 'Q').startOf('quarter')
        end = this.$moment().subtract(1, 'Q').endOf('quarter')
      } else if (this.time.dateMode === 'year') {
        start = this.$moment().startOf('year')
      } else { // 自定义
        start = this.customDate.start
        end = this.customDate.end
        suffix = ' (' + start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD') + ')'
      }
      this.time.date = [start, end]
      this.suffix = suffix
      const params = {
        ...this.getParams,
        [this.start]: this.dateReplace ? this.time.date[0].format('YYYYMMDD') : this.time.date[0].format('YYYY-MM-DD') + 'TZ',
        [this.end]: this.dateReplace ? this.time.date[1].format('YYYYMMDD') : this.time.date[1].format('YYYY-MM-DD') + 'TZ',
      }
      if (this.supportDatatype && this.time.dateMode !== 'custom') {
        params.data_type = TIME_SIZE[this.time.dateMode]
      } else {
        let data_type = 'month'
        const diffMonth = end.diff(start, 'months') // 相差几个月
        if (diffMonth <= 1) data_type = 'day'
        else data_type = 'month'
        params.data_type = data_type
      }
      this.$emit('update:getParams', params)
      this.$emit('update:dateType', params.data_type)
      this.$emit('refresh')
    },
    handleDateChange () {
      this.time.dateMode = ''
      const params = {
        ...this.getParams,
        [this.start]: this.dateReplace ? this.$moment(this.time.date[0]).format('YYYYMMDD') : this.$moment(this.time.date[0]).format('YYYY-MM-DD') + 'TZ',
        [this.end]: this.dateReplace ? this.$moment(this.time.date[1]).format('YYYYMMDD') : this.$moment(this.time.date[1]).format('YYYY-MM-DD') + 'TZ',
      }
      if (this.supportDatatype) {
        params.data_type = TIME_SIZE.month
      }
      this.$emit('update:getParams', params)
      this.$emit('refresh')
    },
    reset () {
      this.time.dateMode = 'month'
    },
  },
}
</script>
