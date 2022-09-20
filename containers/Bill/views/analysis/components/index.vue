<template>
  <div>
    <div class="options d-flex">
      <base-select
        class="mr-2"
        v-model="formData.platform_brand"
        filterable
        id-key="item_id"
        name-key="item_name"
        minWidth="160px"
        :options="uniqueArr(options.platform_brands)"
        @change="v => change('platform_brand', v)"
        :select-props="{ placeholder: $t('bill.text_49') }" />
      <base-select
        class="mr-2"
        v-model="formData.account_id"
        filterable
        id-key="item_id"
        name-key="item_name"
        minWidth="160px"
        @change="v => change('account_id', v)"
        :options="options.accounts"
        :select-props="{ placeholder: $t('bill.text_49') }" />
      <base-select
        class="mr-2"
        v-model="formData.cloudprovider_id"
        filterable
        id-key="item_id"
        name-key="item_name"
        minWidth="160px"
        :options="options.cloudproviders"
        :select-props="{ placeholder: $t('bill.text_49') }" />
      <base-select
        class="mr-2"
        v-model="formData.region_ext_id"
        filterable
        id-key="item_id"
        name-key="item_name"
        minWidth="160px"
        :options="options.regions"
        :select-props="{ placeholder: $t('bill.text_49') }" />
      <base-select
        class="mr-2"
        v-model="formData.charge_type"
        filterable
        id-key="item_id"
        name-key="item_name"
        minWidth="160px"
        :options="options.chargeTypes"
        :select-props="{ placeholder: $t('bill.text_49') }" />
      <tag-select v-model="formData.tag" :params="{ res_type: 'server' }" :managerInstance="resourceTagInstance" :filterWithoutUserMeta="true" />
    </div>
    <div v-if="!R.isEmpty(formData.tag)" class="tag-list d-flex align-items-center">
      <span style="font-size: 12px; color: #999;">{{$t('bill.text_103')}}</span>
      <template v-for="(item, key) of formData.tag">
        <span
          class="tag text-truncate"
          :title="$t('bill.text_102', [ key.replace('user:', '') , item[0] ])"
          :key="key"
          :style="{ backgroundColor: item.backgroundColor, color: item.color, borderColor: item.color }">
            {{ $t('bill.text_104', [key.replace('user:', ''), item[0]]) }}
            <a-icon style="font-size: 12px;" class="ml-1" type="close" @click="removeTag(key)" />
        </span>
      </template>
      <a-button type="link" style="color: rgb(153, 153, 153);" size="small" @click="removeAllTag()">{{$t('bill.text_105')}}</a-button>
    </div>
    <div class="d-flex mt-3">
      <base-select
        class="mr-2"
        v-if="isAdminMode"
        v-model="formData.domain_id"
        filterable
        id-key="item_id"
        name-key="item_name"
        minWidth="160px"
        @change="domainChange"
        :options="options.domains"
        :select-props="{ placeholder: $t('bill.text_49') }" />
      <base-select
        class="mr-2"
        v-if="isAdminMode || isDomainMode"
        v-model="formData.project_id"
        filterable
        id-key="item_id"
        name-key="item_name"
        minWidth="160px"
        :options="options.projects"
        :select-props="{ placeholder: $t('bill.text_49') }" />
      <base-select
        class="mr-2"
        v-model="formData.resource_type"
        filterable
        id-key="item_id"
        name-key="item_name"
        minWidth="160px"
        :options="options.resource_types"
        :labelFormat="resourceTypeFormat"
        @change="v => change('resource_type', v)"
        :select-props="{ placeholder: $t('bill.text_49') }" />
      <base-select
        class="mr-2"
        v-model="formData.usage_type"
        filterable
        id-key="item_id"
        name-key="item_name"
        minWidth="160px"
        :options="options.usage_types"
        :select-props="{ placeholder: $t('bill.text_49') }" />
      <a-input-search v-model="resource_name" :placeholder="$t('bill.text_106')" style="width: 200px" @search="searchByResourceName" />
      <a-button class="ml-2" @click="reset">{{$t('bill.text_107')}}</a-button>
    </div>
    <div class="d-flex mt-3">
      <date-time :getParams.sync="formData.date" :dateMode.sync="dateMode" :dateType.sync="dateType" supportDatatype ref="dataTime" />
    </div>
    <bill-card :header="header.top10" class="mt-4">
      <div class="top10-content">
        <controls-top10 :currencySign="currencySign" :data="seriesArr.top10" :columns="columns" :bar-name="$t('bill.text_1')" :pie-title="$t('bill.text_108')" :pie-subtext="feeSubtotal" :chartSettings="topChartSettings" />
      </div>
    </bill-card>
    <consume-card :currencySign="currencySign" :header="header.trend" :splitLineShow="true" :seriesArr="seriesArr.trend" height="350px" :loading="loading" :dateMode="dateMode" class="mt-4" :dateType="dateType" />
    <consume-card
      v-if="formData.usage_type !== 'all'"
      :chartSettings="chartSettings"
      :header="header.usage"
      :splitLineShow="true"
      :seriesArr="seriesArr.usage"
      height="350px"
      :loading="loading"
      :dateMode="dateMode"
      :dateType="dateType"
      currency-sign=":"
      :isFormatNumber="false"
      class="mt-4" />
  </div>
</template>

<script>
import * as R from 'ramda'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import ControlsTop10 from './Top10'
import { PLATFORMS, ACCOUNTS, REGIONS, DOMAINS, PROJECTS, CHARGE_TYPES, CLOUDPROVIDERS, RESOURCES, USAGES } from '@Bill/constants'
import ConsumeCard from '@Bill/sections/ConsumeCard'
import BillCard from '@Bill/components/BillCard'
import currencyRequest from '@Bill/mixins/currencyRequest'
import DateTime from '@Bill/sections/DateTime'
import { BRAND_MAP } from '@/constants'
import { uuid, completionDate } from '@/utils/utils'
import TagSelect from '@/sections/TagSelect'
import { numerify } from '@/filters'

export default {
  name: 'BillAnalysisIndex',
  components: {
    TagSelect,
    ConsumeCard,
    BillCard,
    ControlsTop10,
    DateTime,
  },
  mixins: [currencyRequest],
  data () {
    return {
      R,
      loading: false,
      header: {
        trend: {
          title: this.$t('bill.text_98'),
        },
        usage: {
          title: this.$t('bill.text_109'),
        },
        top10: {
          title: '',
        },
      },
      chartSettings: {
        labelMap: {
          value: this.$t('bill.text_110'),
          unit: this.$t('bill.text_111'),
        },
      },
      dateMode: '',
      dateType: '',
      topChartSettings: {
        radius: 180,
        offsetY: 260,
        dimension: ['res_name'],
        metrics: ['res_fee'],
        itemStyle: {
          color: (params) => {
            return this.color[params.dataIndex]
          },
        },
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
      },
      formData: {
        platform_brand: 'all',
        account_id: 'all',
        cloudprovider_id: 'all',
        region_ext_id: 'all',
        project_id: 'all',
        domain_id: 'all',
        charge_type: 'all',
        resource_type: 'all',
        usage_type: 'all',
        date: this.getDate(),
        tag: {},
      },
      resource_name: '',
      options: {
        platform_brands: PLATFORMS,
        accounts: ACCOUNTS,
        regions: REGIONS,
        projects: PROJECTS,
        chargeTypes: CHARGE_TYPES,
        domains: DOMAINS,
        cloudproviders: CLOUDPROVIDERS,
        resource_types: RESOURCES,
        usage_types: USAGES,
        datas: [{
          item_id: 'month',
          item_name: this.$t('bill.text_50'),
        }, {
          item_id: 'last_month',
          item_name: this.$t('bill.text_51'),
        }, {
          item_id: 'quarter',
          item_name: this.$t('bill.text_52'),
        }, {
          item_id: 'last_quarter',
          item_name: this.$t('bill.text_53'),
        }, {
          item_id: 'half_year',
          item_name: this.$t('bill.text_112'),
        }, {
          item_id: 'year',
          item_name: this.$t('bill.text_113'),
        }],
      },
      seriesArr: {
        trend: [],
        usage: [],
        top10: [],
      },
      color: ['#4DA1FF', '#FFC760', '#F76F89', '#5ED28A', '#ff5f2e', '#A593E0', '#7f9eb2', '#f6ea8c', '#a5dff9', '#77AAAD', '#c4ccd3'],
    }
  },
  computed: {
    ...mapGetters(['isAdminMode', 'isDomainMode', 'scope']),
    feeSubtotal () {
      let num = 0
      this.seriesArr.top10.map(item => {
        num += item.res_fee
      })
      num = numerify(num, '0,0.00')
      return this.$t('bill.text_114', [num])
    },
    columns () {
      const arr = [
        {
          field: 'color',
          title: this.$t('bill.text_115'),
          headerAlign: 'center',
          align: 'center',
          width: 60,
          slots: {
            default: ({ row }) => {
              return [<span style={{ display: 'inline-block', backgroundColor: row.color, width: '10px', height: '10px', borderRadius: '50%' }} />]
            },
          },
        },
        {
          field: 'res_name',
          title: this.$t('bill.text_72'),
          slots: {
            default: ({ row }, h) => {
              if (!row.res_name) {
                return [<list-body-cell-wrap copy row={ row } field='res_name' title={ row.res_name } />]
              }
              return [<list-body-cell-wrap copy row={ row } field='res_name' title={ row.res_name }>
                <a-button type="link" icon="filter" size="small" slot="appendActions" onClick={ () => this.filterKey(row, 'res_name') } />
              </list-body-cell-wrap>]
            },
          },
        },
        {
          field: 'res_type',
          title: this.$t('bill.text_73'),
          width: 75,
          slots: {
            default: ({ row }, h) => {
              let text = ''
              if (row.res_type === 'server') {
                text = this.$t('bill.text_116')
              } else {
                text = this.$te(`dictionary.${row.res_type}`) ? this.$t(`dictionary.${row.res_type}`) : row.res_type
              }
              if (!row.res_type) {
                return [<list-body-cell-wrap copy row={ row } field='res_type' title={ text } />]
              }
              return [<list-body-cell-wrap copy row={ row } field='res_type' hideField title={ text }>
                {text}
                <a-button type="link" icon="filter" size="small" slot="appendActions" onClick={ () => this.filterKey(row, 'res_type') } />
              </list-body-cell-wrap>]
            },
          },
        },
        {
          field: 'usage_type',
          title: this.$t('bill.text_117'),
          slots: {
            default: ({ row }, h) => {
              if (!row.usage_type) {
                return [<list-body-cell-wrap copy row={ row } field='usage_type' title={ row.usage_type } />]
              }
              return [<list-body-cell-wrap copy row={ row } field='usage_type' title={ row.usage_type }>
                <a-button type="link" icon="filter" size="small" slot="appendActions" onClick={ () => this.filterKey(row, 'usage_type') } />
              </list-body-cell-wrap>]
            },
          },
        },
        {
          field: 'domain_name',
          title: this.$t('dictionary.domain'),
          slots: {
            default: ({ row }, h) => {
              if (!row.domain_name) {
                return [<list-body-cell-wrap copy row={ row } field='domain_name' title={ row.domain_name } />]
              }
              return [<list-body-cell-wrap copy row={ row } field='domain_name' title={ row.domain_name }>
                <a-button type="link" icon="filter" size="small" slot="appendActions" onClick={ () => this.filterKey(row, 'domain_name') } />
              </list-body-cell-wrap>]
            },
          },
        },
        {
          field: 'project_name',
          title: this.$t('dictionary.project'),
          slots: {
            default: ({ row }, h) => {
              if (!row.project_name) {
                return [<list-body-cell-wrap copy row={ row } field='project_name' title={ row.project_name } />]
              }
              return [<list-body-cell-wrap copy row={ row } field='project_name' title={ row.project_name }>
                <a-button type="link" icon="filter" size="small" slot="appendActions" onClick={ () => this.filterKey(row, 'project_name') } />
              </list-body-cell-wrap>]
            },
          },
        },
        {
          field: 'usage',
          title: this.$t('bill.text_110'),
          width: 100,
          slots: {
            default: ({ row }, h) => {
              const money = numerify(row.usage, '0,0.00')
              return [<list-body-cell-wrap copy={ false } row={ row } field='usage' hideField title={ row.usage } message={ row.usage + '' }><div class="text-right">{money}</div></list-body-cell-wrap>]
            },
          },
        },
        {
          field: 'price_unit',
          title: this.$t('bill.text_111'),
          width: 75,
        },
        {
          field: 'res_fee',
          title: this.$t('bill.text_35'),
          align: 'right',
          headerAlign: 'right',
          width: 100,
          slots: {
            default: ({ row }, h) => {
              const money = numerify(row.res_fee, '0,0.00')
              return [<div class="text-right" title={ row.res_fee }>{this.currencySign}{money}</div>]
            },
          },
        },
      ]
      if (this.isAdminMode) {
        return arr
      }
      arr.splice(4, 1)
      return arr
    },
  },
  watch: {
    formData: {
      deep: true,
      handler () {
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
    if (this.$store.getters.isAdminMode) this._conditionList('domain', DOMAINS)
    if (this.$store.getters.isAdminMode || this.$store.getters.isDomainMode) this._conditionList('project', PROJECTS)
    this._conditionList('resource_type', RESOURCES)
    this._conditionList('usage_type', USAGES)
  },
  methods: {
    getDate () {
      const T = time => this.$moment(time)
      const nowMonth = T(new Date()).month() + 1
      const selectMonth = T(this.month).month() + 1
      const selectDate = T(this.month).startOf('month').format('YYYY-MM-DD') + 'TZ'
      let endDate = T(this.month).endOf('month').format('YYYY-MM-DD') + 'TZ'
      if (nowMonth === selectMonth) {
        // 说明是在当前月份
        endDate = T(this.month).format('YYYY-MM-DD') + 'TZ'
      }
      return {
        start_date: selectDate,
        end_date: endDate,
        data_type: 'day',
      }
    },
    domainChange (val) {
      this.formData.project_id = 'all'
      if (val === 'all') {
        this._conditionList('project', PROJECTS)
      } else {
        this._conditionList('project', PROJECTS, { domain_id: val })
      }
    },
    fetchData () {
      this.loading = true
      Promise.all([
        this._getData('expense_trend', 'trend'),
        this._getData('expense_trend', 'usage'),
        this._getData('usage_type_expense', 'top10'),
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
      // eslint-disable-next-line camelcase
      const { start_date, end_date, data_type } = this.formData.date
      const optional = this._optional()
      const tagParams = {}
      let metadataIndex = 0
      for (const key in this.formData.tag) {
        if (key === 'without_user_meta') {
          tagParams.without_user_meta = true
        } else {
          tagParams[`tags.${metadataIndex}.key`] = key
          if (this.formData.tag[key]) {
            tagParams[`tags.${metadataIndex}.value`] = this.formData.tag[key]
          }
          metadataIndex++
        }
      }
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
        ...R.clone(this.currencyParams),
      }
      if (!R.isEmpty(params.resource_name)) {
        params.filter.push(`resource_name.contains("${params.resource_name}")`)
      } else {
        if (params.filter) {
          params.filter = params.filter.filter(item => item.split('.')[0] !== 'resource_name')
        }
      }
      if (!R.isEmpty(params.usage_type) && !R.isNil(params.usage_type)) {
        params.filter.push(`usage_type.contains("${params.usage_type}")`)
      } else {
        if (params.filter) {
          params.filter = params.filter.filter(item => item.split('.')[0] !== 'usage_type')
        }
      }
      delete params.resource_name
      delete params.usage_type
      params.filter = Array.from(new Set(params.filter))
      if (K === 'top10') params.limit = 10
      return this.analysisM.list({
        params,
      }).then(({ data: { data } }) => {
        if (K === 'top10') {
          this.seriesArr[K] = data.map((v, i) => ({ ...v, color: this.color[i] }))
        } else if (K === 'usage') {
          this.seriesArr[K] = data.map(v => ({ time: v.stat_date, value: v.usage, unit: v.price_unit }))
        } else if (K === 'trend') {
          const mapData = data.map(v => ({ time: v.stat_date.substr(0, v.stat_date.length - 2), value: v.stat_value }))
          // 当月补全日期
          // eslint-disable-next-line camelcase
          const { start_date, end_date } = this.formData.date
          const startDate = this.$moment(start_date.substr(0, start_date.length - 2)).format('YYYYMM')
          const endDate = this.$moment(end_date.substr(0, end_date.length - 2)).format('YYYYMM')
          if (startDate === endDate) {
            this.seriesArr[K] = completionDate(mapData, endDate, ['value'])
          } else {
            this.seriesArr[K] = mapData
          }
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
      params.resource_name = this.resource_name
      return params
    },
    change (type, value) {
      if (type === 'platform_brand') {
        this.formData.account_id = 'all'
        this.formData.cloudprovider_id = 'all'
        this.formData.region_ext_id = 'all'
        const query = { parent_id: value }
        this._conditionList('account', ACCOUNTS, query)
        this._conditionList('cloudprovider', CLOUDPROVIDERS, query)
        this._conditionList('region', REGIONS, query)
        this._conditionList('usage_type', USAGES, query)
      }
      if (type === 'account_id') {
        this.formData.cloudprovider_id = 'all'
        this.formData.region_ext_id = 'all'
        const query = { filter: `account_id.equals("${value}")` }
        this._conditionList('cloudprovider', CLOUDPROVIDERS, query)
        this._conditionList('region', REGIONS, query)
        this._conditionList('usage_type', USAGES, query)
      }
      if (type === 'resource_type') {
        const query = { filter: `resource_type.equals("${value}")` }
        this._conditionList('usage_type', USAGES, query)
      }
    },
    removeTag (key) {
      this.$delete(this.formData.tag, key)
      this.fetchData()
    },
    removeAllTag () {
      this.formData.tag = {}
      this.fetchData()
    },
    tagChangeHandle () {
      this.fetchData()
    },
    searchByResourceName (value, event) {
      this.fetchData()
    },
    getResName (name) {
      if (this.$te(`dictionary.${name}`)) {
        return this.$t(`dictionary.${name}`)
      }
      return name
    },
    uniqueArr (arr, byId = 'item_id') {
      const obj = {}
      arr.forEach(val => {
        obj[val[byId]] = val
      })
      return Object.values(obj)
    },
    filterKey (row, key) {
      if (key === 'res_name') {
        this.resource_name = row[key]
        this.searchByResourceName()
      } else if (key === 'res_type') {
        this.formData.resource_type = row[key]
      } else if (key === 'domain_name') {
        this.formData.domain_id = row.domain_id
      } else if (key === 'project_name') {
        this.formData.project_id = row.project_id
      } else {
        this.formData[key] = row[key]
      }
    },
    reset () {
      this.formData = {
        platform_brand: 'all',
        account_id: 'all',
        cloudprovider_id: 'all',
        region_ext_id: 'all',
        project_id: 'all',
        domain_id: 'all',
        charge_type: 'all',
        resource_type: 'all',
        usage_type: 'all',
        date: this.getDate(),
        tag: {},
      }
      this.resource_name = ''
      this.$refs.dataTime.reset()
      this.searchByResourceName()
    },
    resourceTypeFormat (val) {
      let text = ''
      if (val.item_id !== 'all') {
        if (val.item_id === 'server') {
          text = this.$t('bill.text_116')
        } else {
          text = this.$te(`dictionary.${val.item_id}`) ? this.$t(`dictionary.${val.item_id}`) : val.item_name
        }
      } else {
        text = val.item_name
      }
      return text
    },
  },
}
</script>

<style lang="less" scoped>
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
