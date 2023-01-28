<template>
  <div>
    <a-form-item class="nas-sku-valid" :label="$t('compute.text_109')" v-bind="formItemLayout">
      <vxe-grid
        ref="tableRef"
        row-id="id"
        max-height="500"
        :radio-config="radioConfig"
        :loading="loading"
        :columns="tableColumn"
        :data="skuList"
        @radio-change="handleSkuChange"
        @cell-click="handleSkuChange">
        <template v-slot:empty>
          <page-list-empty :loading="loading" />
        </template>
      </vxe-grid>
    </a-form-item>
    <a-form-item class="nas-sku-valid" v-bind="tailFormItemLayout">
      <template v-show="false">
        <a-radio-group v-decorator="skuDecorator" :placeholder="$t('validator.serverName')" />
      </template>
    </a-form-item>
  </div>
</template>

<script>
import * as R from 'ramda'
import PageListEmpty from '@/components/PageList/Loader'
import {
  getFileSystemTypeColumn,
  getFileSystemStorageTypeColumn,
  getFileSystemProtocolColumn,
} from '@Storage/views/file-system/mixins/columns'
import { hasMeterService } from '@/utils/auth'

export default {
  name: 'SKUList',
  inject: ['form', 'formItemLayout', 'tailFormItemLayout'],
  components: {
    PageListEmpty,
  },
  props: {
    filterSkuCallback: {
      type: Function,
    },
  },
  data () {
    return {
      loading: false,
      rateLoading: false,
      skuList: [],
      skuDecorator: [
        'sku',
        {
          rules: [{ required: true, message: this.$t('network.nat.sku.choose') }],
        },
      ],
    }
  },
  computed: {
    radioConfig () {
      return {
        reserve: true,
      }
    },
    FC () {
      if (this.form && this.form.fc) {
        return this.form.fc
      }
      return {}
    },
    tableColumn () {
      const column = [
        { type: 'radio', width: 40 },
        getFileSystemTypeColumn(),
        getFileSystemStorageTypeColumn(),
        getFileSystemProtocolColumn(),
      ]
      if (hasMeterService()) {
        column.push({
          field: 'rate',
          title: this.$t('network.nat.sku.price'),
          sortable: true,
          slots: {
            default: ({ row: { provider, rate } }) => {
              if (this.rateLoading) {
                return [<a-icon type="loading" />]
              }
              const isPackage = this.form.getFieldValue('billing_type') === 'prepaid'
              if (rate) {
                const unit = this.$t('network.unit.month')
                let price = rate.hour_price * 24 * 30
                if (isPackage) {
                  price = rate.month_price
                }
                return [
                  <span style="color: rgb(230, 139, 80);">{ price.toFixed(3) }</span>,
                  <span> { this.$t('currencys.CNY') } / GB / {unit}</span>,
                ]
              }
              return '-'
            },
          },
        })
      }
      return column
    },
  },
  watch: {
    skuList (skuList) {
      const row = (skuList && skuList.length > 0) ? skuList[0] : undefined
      this.handleSkuChange({ row })
    },
  },
  methods: {
    async handleSkuChange ({ row }) {
      this.FC.setFieldsValue({
        sku: row,
      })
      const options = {
        min: row ? (row.min_disk_size_gb > 0 ? row.min_disk_size_gb : 100) : 100,
        max: row ? (row.max_disk_size_gb > 0 ? row.max_disk_size_gb : 100000) : 100000,
        step: row ? (row.disk_size_step > 0 ? row.disk_size_step : 1) : 1,
        network_types: row ? (row.network_types ? row.network_types.split(',') : []) : [],
        zone_ids: row ? (row.zone_ids ? row.zone_ids.split(',') : []) : [],
      }
      this.$emit('update:options', options)
      await this.$nextTick()
      this.$refs.tableRef.setRadioRow(row)
      this.FC.validateFields(['sku'])
    },
    async fetchRates (skuList = this.skuList) {
      if (!hasMeterService()) return
      // if (hasMeterService()) return
      // const managerRates = new this.$Manager('cloud_sku_rates', 'v1')
      const managerRates = new this.$Manager('price_infos', 'v1')
      // const { data: { data = [] } } = await new this.$Manager('price_infos', 'v1').get({ id: '', params })
      // this.pricesList = data
      const params = {
        scope: this.$store.getters.scope,
        res_type: 'filesystem',
      }
      // const params = []
      // skuList.forEach(sku => {
      //   // eslint-disable-next-line camelcase
      //   let { provider, region_ext_id, file_system_type, nas = 'nas', storage_type } = sku
      //   if (sku.cloud_env) provider = sku.cloud_env.toLowerCase()
      //   // eslint-disable-next-line camelcase
      //   const _arr = [provider.toLowerCase(), region_ext_id, '', nas, [file_system_type, storage_type].join('-')]
      //   const key = _arr.join('::')
      //   sku.data_key = key
      //   params.push(key)
      // })
      // eslint-disable-next-line camelcase
      // const param_keys = params.join('$')
      try {
        // const rateData = {}
        this.rateLoading = true
        for (const sku of skuList) {
          console.log(sku.storage_type, 'adfa')
          params.spec = sku.storage_type
          const { data = {} } = await managerRates.list({
            params,
          })
          const retList = data.data
          if (retList && retList.length > 0) {
            // retList.forEach(item => {
            //   rateData[item.data_key] = item
            // })
            // sku.rate = rateData[sku.data_key]
            sku.rate = retList[0]
            console.log(sku.rate, 'adfa')
          }
        }
        // const { data = {} } = await managerRates.list({
        //   params,
        // })
        // const retList = data.data
        // if (retList && retList.length > 0) {
        //   retList.forEach(item => {
        //     rateData[item.data_key] = item
        //   })
        // }
        // this.skuList = skuList.map(sku => {
        //   sku.rate = rateData[sku.data_key]
        //   return sku
        // })
      } catch (err) {
        throw err
      } finally {
        this.rateLoading = false
      }
    },
    async fetchSkus (params) {
      const manager = new this.$Manager('nas_skus', 'v2')
      if (!params.cloudregion_id || params.cloudregion_id.length === 0) {
        this.skuList = []
        return
      }
      try {
        this.loading = true
        const { data = [] } = await manager.list({ params })
        this.skuList = data.data
        if (this.filterSkuCallback && R.type(this.filterSkuCallback) === 'Function') {
          this.skuList = this.skuList.filter(this.filterSkuCallback)
        }
        this.skuList.sort((p1, p2) => {
          if (p1.storage_type === 'standard') {
            return -1
          }
          return 1
        })
        this.fetchRates()
      } catch (err) {
        throw err
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<style lang="less" scoped>
::v-deep .nas-sku-valid .ant-form-item-control{
  line-height: 0;
}
</style>
