<template>
  <div class="overview-index">
    <template>
      <date-time
        class="mb-2"
        :getParams.sync="dateTime"
        :dateMode.sync="dateMode"
        :monthToEnd="false"
        @refresh="fetchData"
        :dateReplace="false" />
    </template>
    <a-row :gutter="12">
      <a-col :span="8">
        <money-card
          class="mb-2"
          :money="balance.month_fee"
          :radio="balance.ring_radio"
          height="122px"
          :btnTitle="$t('bill.text_94')"
          @btnClick="setDayWarning"
          :show="showComparison"
          :currencyCn="currencySign">
          <div slot="title">
            <span>
<!--              {{$t('bill.text_139')}}-->
              {{$t(`bill_date_mode.${dateMode}`)}}
<!--              <a-tooltip :title="$t('bill.text_140')">-->
<!--                <a-icon type="question-circle" />-->
<!--              </a-tooltip>-->
            </span>
          </div>
        </money-card>
<!--        <money-card-->
<!--          :title="$t('bill.text_141')"-->
        <money-card
          :money="balance.year_fee"
          height="122px"
          :btnTitle="$t('bill.text_96')"
          @btnClick="setMonthWarning"
          :currencyCn="currencySign">
          <div slot="title">
            <span>
              {{$t('bill.text_141')}}
              <a-tooltip :title="$t('bill.text_142')">
                <a-icon type="question-circle" />
              </a-tooltip>
            </span>
          </div>
        </money-card>
      </a-col>
      <a-col :span="16">
        <consume-card :header="costHeader" :splitLineShow="true" :dateMode="dateMode" :dateType="dateType" :seriesArr="dataList" height="198px" :loading="loading" :currencySign="currencySign">
<!--          <date-time slot="header-right" :timeOpts="costBtns" :dateMode.sync="dateMode" :dateType.sync="dateType" :getParams.sync="dateTime" :monthToEnd="false" />-->
        </consume-card>
      </a-col>
    </a-row>
    <kind-tabs style="margin-top: -7px;" :envParams="envParams" :currencyParams="currencyParams" :currencySign="currencySign" :dateParams="dateTime" />
  </div>
</template>

<script>
import { TIME_SIZE } from '@Bill/constants'
import MoneyCard from '@Bill/sections/MoneyCard'
import ConsumeCard from '@Bill/sections/ConsumeCard'
import KindTabs from '@Bill/sections/KindTabs'
import currencyRequest from '@Bill/mixins/currencyRequest'
import WindowsMixin from '@/mixins/windows'
import DateTime from '@Bill/sections/DateTime'

export default {
  name: 'OverviewIndex',
  components: {
    MoneyCard,
    ConsumeCard,
    KindTabs,
    DateTime,
  },
  mixins: [WindowsMixin, currencyRequest],
  props: {
    cloudEnv: String,
  },
  data () {
    return {
      activeBtn: 'month',
      dateTime: this.getDate(),
      dateMode: '',
      // dateType: '',
      balance: {},
      envParams: {},
      dataList: [],
      showAlert: true,
      costHeader: {
        title: this.$t('bill.text_98'),
      },
      loading: false,
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
      currencySign: '￥', // 我后加的
    }
  },
  computed: {
    dateType () {
      const { data_type } = this.dateTime
      return data_type
    },
    showComparison () {
      return this.dateMode === 'month'
    },
  },
  watch: {
    dateTime () {
      this.getData()
    },
    cloudEnv (val) {
      switch (val) {
        case 'onpremise':
          this.envParams = { is_on_premise: true }
          this.showAlert = false
          break
        case 'private':
          this.envParams = { private_cloud: true }
          this.showAlert = false
          break
        case 'public':
          this.envParams = { public_cloud: true }
          this.showAlert = false
          break
        default:
          this.showAlert = true
          this.envParams = {}
      }
      this.fetchData()
    },
  },
  created () {
    this.balanceM = new this.$Manager('bill_balances', 'v1')
    this.analysisM = new this.$Manager('bill_analysises', 'v1')
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.getBalance()
      this.getData()
    },
    async getBalance () {
      try {
        const { start_date, end_date } = this.dateTime
        const { data } = await this.balanceM.get({
          id: 'billOverview',
          params: {
            ...this.envParams,
            admin: this.$store.getters.isAdminMode,
            scope: this.$store.getters.scope,
            start_date,
            end_date,
            // date_mode: this.dateMode, 数据不准确，有延迟
            account: 'billOverview',
            ...this.currencyParams,
          },
        })
        this.balance = data
      } catch (error) {
        throw error
      }
    },
    async getData () {
      try {
        // eslint-disable-next-line camelcase
        const { start_date, end_date, data_type } = this.dateTime
        this.dataList = []
        this.loading = true
        const { data: { data = [] } } = await this.analysisM.list({
          params: {
            query_type: 'expense_trend',
            start_date,
            end_date,
            data_type,
            admin: this.$store.getters.isAdminMode,
            scope: this.$store.getters.scope,
            ...this.envParams,
            ...this.currencyParams,
          },
        })
        this.dataList = data.map(v => ({ time: v.stat_date, value: v.stat_value }))
        this.loading = false
      } catch (error) {
        this.loading = false
        throw error
      }
    },
    setDayWarning () {
      this.createDialog('SetMoneyWarningDialog', {
        title: this.$t('bill.text_94'),
        enable: false,
        currencyCn: this.currencyCn,
        fetchDataParams: {
          type: 'resFee',
          detail: true,
          overview: true,
          project_id: this.$store.getters.userInfo.projectId,
          scope: this.$store.getters.scope,
          ...this.envParams,
        },
      })
    },
    setMonthWarning () {
      this.createDialog('SetMoneyWarningDialog', {
        title: this.$t('bill.text_96'),
        enable: false,
        currencyCn: this.currencyCn,
        fetchDataParams: {
          type: 'monthFee',
          detail: true,
          overview: true,
          project_id: this.$store.getters.userInfo.projectId,
          scope: this.$store.getters.scope,
          ...this.envParams,
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
