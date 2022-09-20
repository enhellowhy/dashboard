<template>
  <div>
    <a-row :gutter="12">
      <a-col :span="8">
        <money-card
          class="mb-2"
          :title="$t('bill.text_91')"
          :money="balance.balance"
          height="122px"
          :btnTitle="$t('bill.text_92')"
          :currencyCn="currencyCn"
          @btnClick="setBalanceWarning" />
      </a-col>
      <a-col :span="8">
        <money-card
          class="mb-2"
          :title="$t('bill.text_93')"
          :money="balance.today_fee"
          height="122px"
          :btnTitle="$t('bill.text_94')"
          :currencyCn="currencyCn"
          @btnClick="setDayWarning" />
      </a-col>
      <a-col :span="8">
        <money-card
          class="mb-2"
          :title="$t('bill.text_95')"
          :money="balance.month_fee"
          height="122px"
          :btnTitle="$t('bill.text_96')"
          :currencyCn="currencyCn"
          @btnClick="setMonthWarning" />
      </a-col>
    </a-row>
    <div class="line-group-wrapper">
      <div class="line-item" v-if="balanceLine && balanceLine.length">
        <header class="mt-5">{{$t('bill.text_97')}}</header>
        <bill-bar :isHistogram="true" :splitLineShow="true" :chartSettings="chartSettings" :seriesArr="balanceLine" :currencySign="currencySign" />
      </div>
      <div class="line-item my-3">
        <div class="d-flex justify-content-between">
          <header class="mt-5">{{$t('bill.text_98')}}</header>
          <date-time :timeOpts="costBtns" :getParams.sync="dateTime" :dateMode.sync="dateMode" :dateType.sync="dateType" :monthToEnd="false" />
        </div>
        <bill-bar :isHistogram="true" :seriesArr="costLine" :chartSettings="chartSettings" :splitLineShow="true" :currencySign="currencySign" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { completionDate } from '@/utils/utils'
import { TIME_SIZE } from '@Bill/constants'
import MoneyCard from '@Bill/sections/MoneyCard'
import BillBar from '@Bill/components/BillBar'
import currencyRequest from '@Bill/mixins/currencyRequest'
import WindowsMixin from '@/mixins/windows'
import DateTime from '@Bill/sections/DateTime'
import { numerify } from '@/filters'

const normalize = (arr, K, V, timeFormat, dateMode) => {
  const dataList = arr.map(val => {
    const time = moment(val[K].replace('TZ', '')).format(timeFormat)
    const value = numerify(val[V], '0.00')
    return { time, value }
  })
  if (dateMode === 'custom') return dataList
  const args = [dataList, new Date(), ['value'], dateMode === 'year']
  return completionDate(...args)
}

export default {
  name: 'AccountOverview',
  components: {
    MoneyCard,
    BillBar,
    DateTime,
  },
  mixins: [WindowsMixin, currencyRequest],
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      loading: false,
      balance: {},
      balanceLine: [],
      costLine: [],
      dateTime: this.getDate(),
      dateMode: '',
      dateType: '',
      costBtns: [
        {
          key: 'month',
          label: this.$t('bill.text_50'),
        },
        {
          key: 'year',
          label: this.$t('bill.text_99'),
        },
      ],
      chartSettings: {
        labelMap: {
          value: this.$t('bill.text_1'),
        },
      },
    }
  },
  computed: {
    timeFormat () {
      if (this.dateType) {
        if (this.dateType.includes('month')) {
          return 'YYYY-MM'
        }
        if (this.dateType.includes('day')) {
          return 'MM-DD'
        }
      }
      return 'YYYY-MM-DD'
    },
  },
  watch: {
    'data.id' () {
      this.fetchData()
    },
    dateTime () {
      this._getCostLineData()
    },
  },
  created () {
    this.balanceM = new this.$Manager('bill_balances', 'v1')
    this.analysisM = new this.$Manager('bill_analysises', 'v1')
    this.meteralertsM = new this.$Manager('meteralerts', 'v1')
    this.fetchData()
  },
  methods: {
    _getCardData () {
      const params = {
        account: this.data.id,
        scope: this.$store.getters.scope,
        ...this.currencyParams,
      }
      if (this.$store.getters.isAdminMode) params.admin = true
      return this.balanceM.get({ id: 'query', params }).then(({ data }) => {
        this.balance = data
        if (data.balance_available === false) { // 无余额
          this.balance.balance = '-'
        }
      })
    },
    _getBalanceLineData () {
      return this.balanceM.list({
        params: {
          account_id: this.data.id,
          scope: this.$store.getters.scope,
          ...this.currencyParams,
        },
      }).then(({ data: { data = [] } }) => {
        this.balanceLine = normalize(data, 'query_date', 'balance', this.timeFormat, 'custom') // 写死 custom 不用补全日期
      })
    },
    _getCostLineData () {
      const params = {
        account_id: this.data.id,
        query_type: 'expense_trend',
        ...this.dateTime,
        admin: this.$store.getters.isAdminMode,
        scope: this.$store.getters.scope,
        ...this.currencyParams,
      }
      return this.analysisM.list({ params }).then(({ data: { data = [] } }) => {
        this.costLine = normalize(data, 'stat_date', 'stat_value', this.timeFormat, this.dateMode)
      })
    },
    async fetchData () {
      this.loading = true
      try {
        await Promise.all([this._getCardData(), this._getCostLineData(), this._getBalanceLineData()])
        this.loading = false
      } catch (error) {
        this.loading = false
        throw error
      }
    },
    setBalanceWarning () {
      this.createDialog('SetMoneyWarningDialog', {
        title: this.$t('bill.text_92'),
        enable: false,
        createParams: { account_id: this.data.id },
        currencyCn: this.currencyCn,
        fetchDataParams: {
          provider: this.data.provider,
          account_id: this.data.id,
          type: 'balance',
          project_id: this.$store.getters.userInfo.projectId,
          scope: this.$store.getters.scope,
        },
      })
    },
    setDayWarning () {
      this.createDialog('SetMoneyWarningDialog', {
        title: this.$t('bill.text_94'),
        enable: false,
        createParams: { account_id: this.data.id, provider: this.data.provider },
        currencyCn: this.currencyCn,
        fetchDataParams: {
          provider: this.data.provider,
          account_id: this.data.id,
          type: 'resFee',
          project_id: this.$store.getters.userInfo.projectId,
          scope: this.$store.getters.scope,
        },
      })
    },
    setMonthWarning () {
      this.createDialog('SetMoneyWarningDialog', {
        title: this.$t('bill.text_96'),
        enable: false,
        createParams: { account_id: this.data.id, provider: this.data.provider },
        currencyCn: this.currencyCn,
        fetchDataParams: {
          provider: this.data.provider,
          account_id: this.data.id,
          type: 'monthFee',
          project_id: this.$store.getters.userInfo.projectId,
          scope: this.$store.getters.scope,
        },
      })
    },
    getDate () {
      const end = this.$moment()
      const start = this.$moment().startOf('month')
      return {
        start_date: start.format('YYYY-MM-DD') + 'TZ',
        end_date: end.format('YYYY-MM-DD') + 'TZ',
        data_type: TIME_SIZE.month,
      }
    },
  },
}
</script>

<style lang="less" scoped>
.line-group-wrapper {
  .line-item {
    header {
      color: #4C6072;
      font-size: 18px;
      border-left: 2px solid #409EFF;
      padding-left: 6px;
      margin-bottom: 16px;
      line-height: 30px;
      height: 30px;
    }
  }
}
</style>
