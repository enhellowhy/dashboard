<template>
  <div>
    <page-header :title="$t('bill.text_231')" />
    <page-body>
      <a-row :gutter="30">
        <a-col :span="8">
          <a-form :form="form.fc" v-bind="formItemLayout">
            <a-form-item :label="$t('bill.text_232')">
              <base-select
                v-model="formData.platform_brand"
                filterable
                id-key="item_id"
                name-key="item_name"
                minWidth="160px"
                :options="uniqueArr(options.platform_brands)"
                @change="v => change('platform_brand', v)"
                :select-props="{ placeholder: $t('bill.text_49') }" />
            </a-form-item>
            <a-form-item :label="$t('bill.text_60')">
              <base-select
                :selectProps="{labelInValue: true}"
                v-model="formData.account_id"
                filterable
                id-key="item_id"
                name-key="item_name"
                minWidth="160px"
                @change="v => change('account_id', v)"
                :options="options.accounts"
                :select-props="{ placeholder: $t('bill.text_49') }" />
            </a-form-item>
            <a-form-item :label="$t('bill.text_233')">
              <base-select
                :selectProps="{labelInValue: true}"
                v-model="formData.cloudprovider_id"
                filterable
                id-key="item_id"
                name-key="item_name"
                minWidth="160px"
                :options="options.cloudproviders"
                :select-props="{ placeholder: $t('bill.text_49') }" />
            </a-form-item>
            <a-form-item :label="$t('bill.text_83')">
              <base-select
                v-model="formData.region_ext_id"
                :selectProps="{labelInValue: true}"
                filterable
                id-key="item_id"
                name-key="item_name"
                minWidth="160px"
                :options="options.regions"
                :select-props="{ placeholder: $t('bill.text_49') }" />
            </a-form-item>
            <a-form-item  v-if="isAdminMode" :label="this.$t('dictionary.domain')">
              <base-select
                v-model="formData.domain_id"
                :selectProps="{labelInValue: true}"
                filterable
                id-key="item_id"
                name-key="item_name"
                minWidth="160px"
                @change="domainChange"
                :options="options.domains"
                :select-props="{ placeholder: $t('bill.text_49') }" />
            </a-form-item>
            <a-form-item  v-if="isAdminMode || isDomainMode" :label="this.$t('dictionary.project')">
              <base-select
                v-model="formData.project_id"
                :selectProps="{labelInValue: true}"
                filterable
                id-key="item_id"
                name-key="item_name"
                minWidth="160px"
                :options="options.projects"
                :select-props="{ placeholder: $t('bill.text_49') }" />
            </a-form-item>
            <a-form-item :label="$t('bill.text_73')">
              <base-select
                v-model="formData.resource_type"
                filterable
                id-key="item_id"
                name-key="item_name"
                minWidth="160px"
                :options="options.resource_types"
                @change="v => change('resource_type', v)"
                :select-props="{ placeholder: $t('bill.text_49') }" />
            </a-form-item>
             <a-form-item :label="$t('bill.text_229')">
              <a-select v-model="activeBtn">
                <a-select-option v-for="item in costBtns" :key="item.value" :value="item.value">
                   {{item.text}}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$t('bill.text_234')">
              <a-select v-model="formData.currency">
                <a-select-option value="CNY">{{$t('bill.text_235')}}</a-select-option>
                <a-select-option value="USD">{{$t('bill.text_236')}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$t('bill.text_56')">
               <a-input type="number" :min="1" v-decorator="decorators.amount" />
            </a-form-item>
            <a-form-item :label="$t('bill.text_57')">
              <base-select
                v-decorator="decorators.user_ids"
                class="w-100"
                :filterable="true"
                needParams
                resource="receivers"
                version="v1"
                :applyOptionLabel="false"
                :params="recipientParams"
                :select-props="{ placeholder: $t('bill.text_49'), allowClear: true, mode: 'multiple' }" />
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :span="16">
          <consume-card :currencySign="currencySign" :header="header.trend" :splitLineShow="true" :seriesArr="seriesArr.trend" height="350px" :loading="loading" :time-type="formData.date.data_type" class="mt-2" />
        </a-col>
      </a-row>
    </page-body>
    <page-footer style="left:0">
      <div slot="right">
        <a-button class="mr-3" :loading="loading" @click="handleConfirm" type="primary">{{$t('common.create')}}</a-button>
        <a-button @click="cancel">{{ $t('dialog.cancel') }}</a-button>
      </div>
    </page-footer>
  </div>
</template>

<script>
import * as R from 'ramda'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { TIME_SIZE, PLATFORMS, ACCOUNTS, REGIONS, DOMAINS, PROJECTS, CHARGE_TYPES, CLOUDPROVIDERS, RESOURCES, currencyUnitMap } from '@Bill/constants'
import ConsumeCard from '@Bill/sections/ConsumeCard'
import currencyRequest from '@Bill/mixins/currencyRequest'
import { BRAND_MAP } from '@/constants'
import { uuid } from '@/utils/utils'

export default {
  name: 'BillAnalysisIndex',
  components: {
    ConsumeCard,
  },
  mixins: [currencyRequest],
  data () {
    return {
      R,
      loading: false,
      activeBtn: 'month',
      scope: this.$store.getters.scope,
      form: {
        fc: this.$form.createForm(this),
      },
      formItemLayout: {
        wrapperCol: {
          md: {
            span: 24,
          },
          lg: {
            span: 12,
          },
          xxl: {
            span: 16,
          },
        },
        labelCol: {
          md: {
            span: 24,
          },
          lg: {
            span: 12,
          },
          xxl: {
            span: 8,
          },
        },
      },
      header: {
        trend: {
          title: this.$t('bill.text_98'),
        },
      },
      costBtns: [
        {
          value: 'month',
          text: this.$t('bill.text_238'),
        },
        {
          value: 'year',
          text: this.$t('bill.text_239'),
        },
      ],
      formData: {
        platform_brand: 'all',
        account_id: { key: 'all' },
        cloudprovider_id: { key: 'all' },
        region_ext_id: { key: 'all' },
        project_id: { key: 'all' },
        domain_id: { key: 'all' },
        charge_type: 'all',
        resource_type: 'all',
        currency: 'CNY',
        date: this.getDate(),
      },
      options: {
        resource_types: RESOURCES,
        platform_brands: PLATFORMS,
        accounts: ACCOUNTS,
        regions: REGIONS,
        projects: PROJECTS,
        chargeTypes: CHARGE_TYPES,
        domains: DOMAINS,
        cloudproviders: CLOUDPROVIDERS,
      },
      seriesArr: {
        trend: [],
      },
    }
  },
  computed: {
    ...mapGetters(['isAdminMode', 'isDomainMode']),
    recipientParams () {
      return {
        limit: 0,
        scope: this.$store.getters.scope,
        with_meta: true,
        enabled: true,
      }
    },
    computedDate () {
      const end = this.$moment()
      const start = this.$moment().startOf(this.activeBtn)
      return {
        start_date: start.format('YYYY-MM-DD') + 'TZ',
        end_date: end.format('YYYY-MM-DD') + 'TZ',
        data_type: TIME_SIZE[this.activeBtn],
      }
    },
    decorators () {
      return {
        cost_type: ['cost_type', {
          initialValue: 'day',
        }],
        user_ids: ['user_ids', {
          rules: [{ required: true, message: this.$t('bill.text_240') }],
        }],
        amount: ['amount', {
          initialValue: 1,
          normalize: v => Number(v),
          rules: [
            { type: 'integer', min: 1, message: this.$t('bill.text_241'), trigger: 'blur' },
          ],
        }],
      }
    },
    currencySign () {
      if (currencyUnitMap[this.formData.currency]) {
        return currencyUnitMap[this.formData.currency].sign || ''
      }
      return ''
    },
  },
  watch: {
    activeBtn () {
      this._getData('expense_trend', 'trend')
    },
    formData: {
      deep: true,
      handler (value, a) {
        this.fetchData()
      },
    },
  },
  created () {
    this.conditionM = new this.$Manager('bill_conditions', 'v1')
    this.analysisM = new this.$Manager('bill_analysises', 'v1')
    this.resourceTagInstance = new this.$Manager('res_tag_details', 'v1')
    this.fetchData()
    this._conditionList('platform_brand', PLATFORMS)
    this._conditionList('resource_type', RESOURCES)
    if (this.$store.getters.isAdminMode) this._conditionList('domain', DOMAINS)
    if (this.$store.getters.isAdminMode || this.$store.getters.isDomainMode) this._conditionList('project', PROJECTS)
  },
  methods: {
    getDate () {
      const T = time => this.$moment(time)
      const nowMonth = T(new Date()).month() + 1
      const selectMonth = T(this.month).month() + 1
      const selectDate = T(this.month).startOf('month').format('YYYY-MM-DD') + 'TZ'
      let endDate = T(this.month).endOf('month').format('YYYY-MM-DD') + 'TZ'
      if (nowMonth === selectMonth) { // 说明是在当前月份
        endDate = T(new Date()).format('YYYY-MM-DD') + 'TZ'
      }
      return {
        start_date: selectDate,
        end_date: endDate,
      }
    },
    domainChange (val) {
      this.formData.project_id = { key: 'all' }
      this._conditionList('project', PROJECTS, { domain_id: val })
    },
    fetchData () {
      this.loading = true
      Promise.all([
        this._getData('expense_trend', 'trend'),
      ]).then(() => {
        this.loading = false
      })
    },
    _conditionList (queryType, cons = [], reqQuery = {}) {
      const adminParams = { admin: this.$store.getters.isAdminMode, scope: this.$store.getters.scope, $t: uuid() }
      const query = Object.assign({ query_type: queryType }, reqQuery, adminParams)
      this.conditionM.list({ params: query }).then(({ data: { data } }) => {
        if (queryType === 'platform_brand') {
          data = data.map(v => {
            return { ...v, item_name: (_.get(BRAND_MAP, `[${v.item_name}].label`) || v.item_name) }
          })
        }
        this.options[`${queryType}s`] = cons.concat(data)
      })
    },
    _getData (queryType, K) {
      const { start_date, end_date, data_type } = this.computedDate
      const optional = this._optional()
      const tagParams = {}
      const $t = uuid()
      const params = {
        $t,
        query_type: queryType,
        start_date,
        end_date,
        data_type,
        scope: this.$store.getters.scope,
        ...optional,
        ...this.adminParams,
        ...tagParams,
        filter: [`currency.equals("${this.formData.currency}")`],
      }
      if (params.resource_type) {
        params.filter.push(`resource_type.equals("${params.resource_type}")`)
        delete params.resource_type
      } else {
        params.filter = params.filter.filter(item => item.split('.')[0] !== 'resource_type')
      }
      Object.keys(params).forEach(k => {
        const item = params[k]
        if (R.type(item) === 'Object') {
          params[k] = item.key
        }
        if (!params[k] || params[k] === 'all') {
          delete params[k]
        }
      })
      return this.analysisM.list({
        params,
      }).then(({ data: { data } }) => {
        if (K === 'top10') {
          this.seriesArr[K] = data
        } else {
          this.seriesArr[K] = data.map(v => ({ time: v.stat_date, value: v.stat_value }))
        }
      }).catch(error => {
        throw error
      })
    },
    _optional () {
      const params = {}
      R.forEachObjIndexed((value, key) => {
        if (value !== 'all' && key !== 'date') {
          params[key] = value
        }
      }, this.formData)
      delete params.tag
      return params
    },
    change (type, value) {
      const id = R.type(value) === 'Object' ? value.key : value
      if (type === 'platform_brand') {
        this.formData.account_id = { key: 'all' }
        this.formData.cloudprovider_id = { key: 'all' }
        this.formData.region_ext_id = { key: 'all' }
        const query = { parent_id: id }
        this._conditionList('account', ACCOUNTS, query)
        this._conditionList('cloudprovider', CLOUDPROVIDERS, query)
        this._conditionList('region', REGIONS, query)
      }
      if (type === 'account_id') {
        this.formData.cloudprovider_id = { key: 'all' }
        this.formData.region_ext_id = { key: 'all' }
        const query = { filter: `account_id.equals("${id}")` }
        this._conditionList('cloudprovider', CLOUDPROVIDERS, query)
        this._conditionList('region', REGIONS, query)
      }
    },
    uniqueArr (arr, byId = 'item_id') {
      const obj = {}
      arr.forEach(val => {
        obj[val[byId]] = val
      })
      return Object.values(obj)
    },
    cancel () {
      this.$router.push({
        name: 'BillWarning',
      })
    },
    async handleConfirm () {
      const manager = new this.$Manager('costalerts', 'v1')
      try {
        const values = await this.form.fc.validateFields()

        this.loading = true
        const params = {}
        params.user_ids = {
          content: values.user_ids,
        }
        params.amount = values.amount
        params.cost_type = values.cost_type
        params.currency = this.formData.currency
        params.brand = this.formData.platform_brand
        params.account_id = this.formData.account_id.key
        params.account = this.formData.account_id.label
        params.cloudprovider_id = this.formData.cloudprovider_id.key
        params.cloudprovider_name = this.formData.cloudprovider_id.label
        params.region_id = this.formData.region_ext_id.key
        params.region = this.formData.region_ext_id.label
        delete params.region_ext_id
        params.domain_id_filter = this.formData.domain_id.key
        params.domain_filter = this.formData.domain_id.label
        params.project_id_filter = this.formData.domain_id.key
        params.project_filter = this.formData.project_id.label
        params.resource_type = this.formData.resource_type
        params.cost_type = this.computedDate.data_type
        params.scope = this.$store.getters.scope
        Object.keys(params).forEach(k => {
          const item = params[k]
          if (!item || item === 'all') {
            delete params[k]
          }
        })
        await manager.create({
          data: params,
        })
        this.cancel()
      } catch (err) {
        throw err
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.tag-list {
  margin-top: 10px;;
  .tag {
    max-width: 100%;
    line-height: 20px;
    margin-right: 10px;
    padding: 0 6px 0 4px;
    font-size: 12px;
    border-style: solid;
    border-width: 1px;
  }
}
</style>
