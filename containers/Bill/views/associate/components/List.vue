<template>
  <page-list
    :list="list"
    :columns="columns"
    :noDataText="noDataText"
    :tagManagerInstance="tagManagerInstance"
    :export-data-options="exportDataOptions">
    <template v-slot:group-actions-append>
      <date-time
        class="ml-3"
        :getParams.sync="list.getParams"
        @refresh="fetchData"
        :dateReplace="true"
        start="start_day"
        end="end_day" />
    </template>
    <div class="mt-2 mb-1" slot="table-prepend">
      <span>{{$t('bill.text_119')}}</span>
<!--      <span style="font-weight: 600; color: #4FA1F8; font-size: 18px;">{{ amount }} {{ currencyCn }}</span>-->
      <span style="font-weight: 600; color: #4FA1F8; font-size: 18px;">{{ currencySign }} {{ amount }}</span>
    </div>
  </page-list>
</template>

<script>
import ColumnsMixin from '../mixins/columns'
import { CHARGE_TYPE } from '@Bill/constants'
import DateTime from '@Bill/sections/DateTime'
import currencyRequest from '@Bill/mixins/currencyRequest'
// import { getNameFilter, getBrandFilter, getProjectFilter, getDomainFilter } from '@/utils/common/tableFilter'
import { getNameFilter, getBrandFilter, getProjectFilter } from '@/utils/common/tableFilter'
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'
import { numerify } from '@/filters'

export default {
  name: 'BillAssociateList',
  components: {
    DateTime,
  },
  mixins: [WindowsMixin, currencyRequest, ListMixin, ColumnsMixin],
  props: {
    id: String,
    cloudEnv: {
      type: String,
    },
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'associated_bills',
        apiVersion: 'v1',
        idKey: 'resource_id',
        getParams: {
          detail: true,
          admin: this.$store.getters.isAdminMode,
        },
        filterOptions: {
          resource_id: getNameFilter({ field: 'resource_id', label: this.$t('bill.text_120') }),
          name: getNameFilter({ field: 'resource_name', label: this.$t('bill.text_72') }),
          // account: getNameFilter({ field: 'account', label: this.$t('bill.text_60') }),
          // cloudprovider_name: getNameFilter({ field: 'cloudprovider_name', label: this.$t('dictionary.cloudprovider') }),
          // region: getNameFilter({ field: 'region', label: this.$t('bill.text_83') }),
          brand: getBrandFilter(),
          project: getProjectFilter(),
          // domain: getDomainFilter(),
          charge_type: {
            label: this.$t('bill.text_84'),
            dropdown: true,
            items: [
              { label: CHARGE_TYPE.postpaid, key: 'postpaid' },
              { label: CHARGE_TYPE.prepaid, key: 'prepaid' },
            ],
            filter: true,
            formatter: val => `charge_type.equals(${val})`,
          },
          // resource_type: {
          //   label: this.$t('bill.resource_type'),
          //   dropdown: true,
          //   distinctField: {
          //     type: 'field',
          //     key: 'resource_type',
          //   },
          //   filter: true,
          //   formatter: val => `resource_type.equals("${val}")`,
          //   mapper: values => {
          //     return values.map(({ key, label }) => {
          //       if (this.$te(`bill_resource_type.${label}`)) {
          //         label = this.$t(`bill_resource_type.${label}`)
          //       }
          //       return {
          //         key,
          //         label,
          //       }
          //     })
          //   },
          // },
        },
        hiddenColumns: ['account'],
      }),
      exportDataOptions: {
        items: [
          { key: 'resource_name', label: this.$t('bill.text_72') },
          { key: 'resource_id', label: this.$t('bill.text_120') },
          { key: 'spec', label: this.$t('bill.text_121') },
          { key: 'account', label: this.$t('bill.text_60') },
          { key: 'brand', label: this.$t('bill.text_81') },
          { key: 'region', label: this.$t('bill.text_83') },
          { key: 'domain', label: this.$t('dictionary.domain') },
          { key: 'project', label: this.$t('dictionary.project') },
          { key: 'charge_type', label: this.$t('bill.text_84') },
          { key: 'reserved', label: this.$t('bill.text_122') },
          { key: 'gross_amount', label: this.$t('bill.text_123') },
          { key: 'discount_amount', label: this.$t('bill.text_124') },
          { key: 'amount', label: this.$t('bill.text_125') },
        ],
      },
      envParams: {},
      currencySign: '￥', // 我后加的
      amount: 0,
      noDataText: this.$t('bill.text_85'),
    }
  },
  watch: {
    cloudEnv (val) {
      switch (val) {
        case 'onpremise':
          this.envParams = { is_on_premise: true }
          break
        case 'private':
          this.envParams = { private_cloud: true }
          break
        case 'public':
          this.envParams = { public_cloud: true }
          break
        default:
          this.envParams = {}
      }
      const params = this.list.getParams
      delete params.is_on_premise
      delete params.private_cloud
      delete params.public_cloud
      this.list.getParams = { ...params, ...this.envParams }
      this.fetchData()
    },
    'list.params' () {
      this.getAmount()
    },
  },
  created () {
    this.tagManagerInstance = new this.$Manager('res_tag_details', 'v1')
  },
  methods: {
    fetchData () {
      this.list.getParams = { ...this.list.getParams, ...this.currencyParams }
      this.list.fetchData()
      this.getAmount()
    },
    async getAmount () {
      try {
        const { data: { amount = 0 } } = await this.list.onManager('get', {
          managerArgs: { id: 'total', params: this.list.params, ...this.currencyParams },
        })
        this.amount = numerify(amount, '0,0.00')
      } catch (error) {
        throw error
      }
    },
  },
}
</script>

<style lang="less" scoped>
::v-deep .list-body-cell-wrap {
  .slot-wrap {
    width: 100%!important;
  }
}
</style>
