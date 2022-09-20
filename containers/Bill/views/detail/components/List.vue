<template>
<!--  <page-list-->
<!--    :list="list"-->
<!--    :columns="columns"-->
<!--    show-tag-filter-->
<!--    :noDataText="noDataText"-->
<!--    :tagManagerInstance="tagManagerInstance"-->
<!--    :export-data-options="exportDataOptions">-->
<!--    <template v-slot:group-actions-append>-->
<!--      <date-time-->
<!--        class="ml-3"-->
<!--        :getParams.sync="list.getParams"-->
<!--        @refresh="fetchData" />-->
<!--    </template>-->
<!--  </page-list>-->
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
        @refresh="fetchData" />
    </template>
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

export default {
  name: 'BillDetailList',
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
        resource: 'bill_details',
        apiVersion: 'v1',
        getParams: {
          details: true,
          admin: this.$store.getters.isAdminMode,
        },
        filterOptions: {
          resource_id: getNameFilter({ field: 'id', label: this.$t('bill.text_134') }),
          name: getNameFilter({ field: 'resource_name', label: this.$t('bill.text_72') }),
          // account: getNameFilter({ field: 'account', label: this.$t('bill.text_60') }),
          // cloudprovider_name: getNameFilter({ field: 'cloudprovider_name', label: this.$t('dictionary.cloudprovider') }),
          // region: getNameFilter({ field: 'region', label: this.$t('bill.text_83') }),
          brand: getBrandFilter(),
          // domain: getDomainFilter(),
          project: getProjectFilter(),
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
          res_type: {
            label: this.$t('bill.text_73'),
            dropdown: true,
            distinctField: {
              type: 'field',
              key: 'resource_type',
            },
            mapper: data => {
              return data.map(item => {
                return {
                  key: item.key,
                  label: this.$te(`dictionary.${item.label}`) ? this.$t(`dictionary.${item.label}`) : item.label,
                }
              })
            },
            filter: true,
            multiple: true,
            formatter: val => `resource_type.equals(${val})`,
          },
        },
        hiddenColumns: ['usage_type', 'item_rate'],
      }),
      exportDataOptions: {
        items: [
          { key: 'id', label: this.$t('bill.text_134') },
          { key: 'account', label: this.$t('bill.text_60') },
          { key: 'brand', label: this.$t('bill.text_81') },
          { key: 'region', label: this.$t('bill.text_83') },
          { key: 'domain', label: this.$t('dictionary.domain') },
          { key: 'project', label: this.$t('dictionary.project') },
          { key: 'resource_type', label: this.$t('bill.text_73') },
          { key: 'resource_name', label: this.$t('bill.text_72') },
          { key: 'resource_id', label: this.$t('bill.text_120') },
          { key: 'usage_start_time', label: this.$t('bill.text_40') },
          { key: 'usage_end_time', label: this.$t('bill.text_41') },
          { key: 'charge_type', label: this.$t('bill.text_84') },
          { key: 'rate', label: this.$t('bill.text_37') },
          { key: 'amount', label: this.$t('bill.text_125') },
        ],
      },
      envParams: {},
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
  },
  created () {
    this.tagManagerInstance = new this.$Manager('res_tag_details', 'v1')
  },
  methods: {
    fetchData () {
      this.list.getParams = { ...this.list.getParams, ...this.currencyParams }
      this.list.fetchData()
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
