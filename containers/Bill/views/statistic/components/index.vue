<template>
  <div>
    <a-tabs v-model="activeTab">
      <a-tab-pane
        v-for="item of tabs"
        :tab="item.item_name"
        :key="item.item_id" />
    </a-tabs>
    <div>
      <consume-card :header="costHeader" :splitLineShow="true" :seriesArr="seriesArr" :dateMode="dateMode" :dateType="dateType" height="198px" :currencySign="currencySign">
        <date-time slot="header-right" :timeOpts="costBtns" :getParams.sync="dateTime" :dateMode.sync="dateMode" :dateType.sync="dateType" :monthToEnd="false" />
      </consume-card>
      <kind-tabs :tabs="kindTabs" :platform="activeTab" :currencyParams="currencyParams" :currencySign="currencySign" />
    </div>
  </div>
</template>

<script>
import { TIME_SIZE } from '@Bill/constants'
import ConsumeCard from '@Bill/sections/ConsumeCard'
import KindTabs from '@Bill/sections/KindTabs'
import currencyRequest from '@Bill/mixins/currencyRequest'
import { BRAND_MAP } from '@/constants'
import DateTime from '@Bill/sections/DateTime'

export default {
  name: 'BillStatisticIndex',
  components: {
    ConsumeCard,
    KindTabs,
    DateTime,
  },
  mixins: [currencyRequest],
  data () {
    return {
      tabs: [],
      activeTab: BRAND_MAP.OneCloud.key,
      activeBtn: 'month',
      dateTime: this.getDate(),
      seriesArr: [],
      dateMode: '',
      dateType: '',
      costHeader: {
        title: this.$t('bill.text_98'),
      },
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
      kindTabs: [
        {
          label: this.$t('bill.text_73'),
          key: 'resource-type',
        },
        {
          label: this.$t('bill.text_82'),
          key: 'resource',
          height: 470,
        },
        {
          label: this.$t('dictionary.cloudaccount'),
          key: 'account',
          height: 470,
        },
        {
          label: this.$t('dictionary.cloudprovider'),
          key: 'cloudprovider',
          height: 470,
        },
        {
          label: this.$t('bill.text_83'),
          key: 'region',
        },
        {
          label: this.$t('bill.text_84'),
          key: 'charge-type',
        },
        {
          label: this.$t('dictionary.domain'),
          key: 'domain',
        },
        {
          label: this.$t('dictionary.project'),
          key: 'project',
          height: 470,
        },
      ],
    }
  },
  watch: {
    dateTime () {
      this.getDatas()
    },
    activeTab () {
      this.getDatas()
    },
  },
  created () {
    this.conditionM = new this.$Manager('bill_conditions', 'v1')
    this.analysisM = new this.$Manager('bill_analysises', 'v1')
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.getDatas()
      this.getTabs()
    },
    async getTabs () {
      try {
        const { data: { data = [] } } = await this.conditionM.list({
          params: {
            query_type: 'platform_brand',
            admin: this.$store.getters.isAdminMode,
            scope: this.$store.getters.scope,
            ...this.currencyParams,
          },
        })
        this.tabs = data.map(val => ({ ...val, item_name: (BRAND_MAP[val.item_name] ? BRAND_MAP[val.item_name].label : val.item_name) }))
        if (data.length) this.activeTab = data[0].item_id
      } catch (error) {
        throw error
      }
    },
    async getDatas () {
      try {
        const { data: { data } } = await this.analysisM.list({
          params: {
            query_type: 'expense_trend',
            platform_brand: this.activeTab,
            ...this.dateTime,
            admin: this.$store.getters.isAdminMode,
            scope: this.$store.getters.scope,
            ...this.currencyParams,
          },
        })
        this.seriesArr = data.map(v => ({ time: v.stat_date, value: v.stat_value }))
      } catch (error) {
        throw error
      }
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
