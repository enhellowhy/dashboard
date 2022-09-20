import * as R from 'ramda'
import { CHARGE_TYPE } from '@Bill/constants'
import { Manager } from '@/utils/manager'
import { PROVIDER_MAP } from '@/constants'
import { changeToArr } from '@/utils/utils'

export default {
  props: {
    platform: String,
    account: String,
    label: String,
    date: {
      type: Object,
      required: true,
    },
    envParams: {
      type: Object,
      default: () => ({}),
    },
    currencySign: {
      type: String,
      default: '￥',
    },
    currencyParams: {
      type: Object,
      default: () => ({}),
    },
  },
  created () {
    this.analysisM = new Manager('bill_analysises', 'v1')
    this.fetchData()
  },
  watch: {
    account (v) {
      if (v) this.fetchData()
    },
    platform (v) {
      if (v) this.fetchData()
    },
    label (v) {
      if (v) this.fetchData()
    },
    envParams () {
      this.fetchData()
    },
    domain () {
      this.fetchData()
    },
    date () {
      this.fetchData()
    },
    currencyParams () {
      this.fetchData()
    },
  },
  data () {
    return {
      dataList: [],
    }
  },
  methods: {
    getProvider (name) {
      const providerObj = PROVIDER_MAP[name.toLowerCase()]
      if (providerObj) {
        return providerObj.label
      }
      if (name === 'OneCloud') {
        return this.$t('bill.platform_brand')
      }
      return name
    },
    getResName (name) {
      if (this.$te(`dictionary.${name}`)) {
        return this.$t(`dictionary.${name}`)
      }
      return name
    },
    genParams () {
      // eslint-disable-next-line camelcase
      const { start_date, end_date, data_type } = this.date
      const params = {
        $t: +new Date(),
        query_type: this.queryType,
        start_date,
        end_date,
        data_type,
        scope: this.$store.getters.scope,
        ...this.envParams,
        ...R.clone(this.currencyParams),
      }
      if (this.$store.getters.isAdminMode) {
        params.admin = true
      }
      if (this.queryType === 'tag_stat') {
        if (!this.label) return
        params['tags.0.key'] = this.label
      }
      if (this.platform) params.platform_brand = this.platform
      if (this.account) params.account_id = this.account
      if (this.domain) {
        if (params.filter) {
          params.filter = changeToArr(params.filter)
          params.filter.push(`domain_id.equals(${this.domain})`)
        }
      }
      if (R.is(Number, this.topLimitProp)) params.limit = this.topLimitProp
      return params
    },
    async fetchData () {
      if (R.isEmpty(this.date)) return
      const params = this.genParams()
      if (!params) return
      try {
        let { data: { data = [] } } = await this.analysisM.list({ params })
        data = data.map(val => ({ item_name: val.item_name || '', ...val }))
        // 平台
        if (this.queryType === 'provider') data = data.map(val => ({ ...val, item_name: this.getProvider(val.item_name) }))
        // 资源类型
        if (this.queryType === 'resource_type') data = data.map(val => ({ ...val, item_name: this.getResName(val.item_name) }))
        // 计费模式
        if (this.queryType === 'charge_type') data = data.map(val => ({ ...val, item_name: (CHARGE_TYPE[val.item_name] || val.item_name) }))
        this.dataList = data
      } catch (error) {
        throw error
      }
    },
    topLimitChange (limit) {
      this.topLimitProp = limit
      this.fetchData()
    },
  },
}
