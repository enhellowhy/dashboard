<template>
  <page-footer>
    <template v-slot:right>
<!--      <price-fetcher :values="values" :cloudAccountId="cloudAccountId" />-->
      <div class="btns-wrapper d-flex align-items-center">
        <div v-if="true" class="mr-4 d-flex align-items-center">
          <div class="text-truncate">{{$t('compute.text_286')}}</div>
          <div class="ml-2 prices">
            <div class="hour d-flex">
              <template v-if="price">
                <m-animated-number :value="price" :formatValue="formatToPrice" />
<!--                <discount-price class="ml-2 mini-text" :discount="discount" :origin="originPrice" />-->
                <a-tooltip class="tooltip d-flex ml-2 mb-2 align-items-end">
                  <div slot="title" class="d-flex flex-column justify-content-center">
                    <div class="d-flex align-items-center flex-grow-1 content">
                      <div class="ml-1 flex-grow-1">{{$t('storage.filesystem.hour.price.tooltip')}}</div>
                    </div>
                  </div>
                  <icon type="question" />
                </a-tooltip>
                <!--                  <help-tooltip class="ml-1" name="networkPolicy" />-->
              </template>
              <template v-else>---</template>
            </div>
            <div class="tips text-truncate">
              <span v-html="priceTips" />
            </div>
          </div>
        </div>
        <a-button
          class="ml-3"
          type="primary"
          native-type="submit"
          html-type="submit"
          @click="handleConfirm"
          :loading="loading">{{ confirmText }}</a-button>
      </div>
    </template>
  </page-footer>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { getCloudEnvOptions } from '@/utils/common/hypervisor'
// import PriceFetcher from '@/components/PriceFetcher'
import { WORKFLOW_TYPES } from '@/constants/workflow'
import workflowMixin from '@/mixins/workflow'
import { Manager } from '@/utils/manager'
import i18n from '@/locales'

export default {
  name: 'BottomBar',
  // components: {
  //   PriceFetcher,
  // },
  inject: ['form'],
  mixins: [workflowMixin],
  props: {
    values: {
      type: Object,
    },
    cloudAccountId: String,
    isRepeated: Boolean,
  },
  data () {
    const cloudEnvOptions = getCloudEnvOptions('nas_brands', true)
    return {
      cloudEnvOptions,
      rate: {},
      cap: 0,
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    capacity () {
      if (this.cap) {
        return this.cap
      }
      return 0
    },
    price () {
      const capacity = this.capacity
      if (capacity && this.rate) {
        const _price = parseFloat(this.rate.hour_price)

        return _price * capacity
      }
      return null
    },
    priceTips () {
      if (this.price) {
        const _day = (this.price * 24).toFixed(5)
        const _month = (parseFloat(_day) * 30).toFixed(3)
        return this.$t('compute.text_1138', [this.currency, _day, this.currency, _month])
      }
      return '--'
    },
    currency () {
      return '¥'
    },
    confirmText () {
      return this.isOpenWorkflow ? this.$t('compute.text_288') : this.$t('common_258')
    },
    isOpenWorkflow () {
      return this.checkWorkflowEnabled(WORKFLOW_TYPES.APPLY_FILESYSTEM)
    },
  },
  created () {
    this.managerRates = new Manager('price_infos', 'v1')
    this.getRate = _.debounce(this.fetchRates, 500)
    this.baywatch([
      'values.sku.storage_type',
      // 'values.sku.rate',
    ], (val) => {
      if (val) {
        // console.log('bywantch', val)
        // this.rate = this.values.sku.rate
        this.getRate(val)
      }
    }, { deep: true, immediate: true })
    this.baywatch([
      'values.capacity',
      'values.capacity_unit',
    ], (val) => {
      if (val) {
        // console.log('capacity', this.values)
        this.cap = this.values.capacity * this.values.capacity_unit
      }
    })
  },
  methods: {
    baywatch (props, watcher) {
      const iterator = function (prop) {
        this.$watch(prop, watcher)
      }
      props.forEach(iterator, this)
    },
    formatToPrice (val) {
      let ret = `¥ ${val.toFixed(6)}`
      // ret += !this.isPackage ? this.$t('compute.text_296') : ''
      ret += this.$t('compute.hour.price.unit')
      return ret
    },
    async fetchRates (spec) {
      const params = {
        scope: this.$store.getters.scope,
        res_type: 'filesystem',
      }
      try {
        params.spec = spec
        const { data = {} } = await this.managerRates.list({
          params,
        })
        const retList = data.data
        if (retList && retList.length > 0) {
          // retList.forEach(item => {
          //   rateData[item.data_key] = item
          // })
          // sku.rate = rateData[sku.data_key]
          this.rate = retList[0]
        }
      } catch (err) {
        throw err
      }
    },
    doCreate (data) {
      return new this.$Manager('file_systems').create({ data })
    },
    doForecast () {
      return new Promise((resolve, reject) => {
        if (this.isRepeated) {
          const err = new Error(this.$t('storage.xgfs.nfs.name.repeated'))
          reject(err)
        } else {
          resolve()
        }
      })
    },
    doCreateWorkflow (params) {
      // const { project, domain, tag, ...rest } = values
      // let meta = {}
      // if (tag) {
      //   meta = tag
      // }
      // const params = {
      //   ...rest,
      //   __meta__: meta,
      //   project_domain: (domain && domain.key) || this.userInfo.projectDomainId,
      //   project_id: (project && project.key) || this.userInfo.projectId,
      // }
      const variables = {
        project_domain: params.project_domain,
        project: params.project_id,
        process_definition_key: WORKFLOW_TYPES.APPLY_FILESYSTEM,
        initiator: this.$store.getters.userInfo.id,
        description: params.reason,
        paramter: JSON.stringify(params),
        // price: this.price,
      }
      // this._getProjectDomainInfo(variables)
      new this.$Manager('workflow_process_instances', 'v1')
        .create({ data: { variables } })
        .then(() => {
          this.$message.success(i18n.t('storage.xgfs.nfs.apply.submit', [params.name]))
          this.$router.push('/workflow')
        })
        .catch((error) => {
          throw error
        })
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.form.fc.validateFields()
        console.log(values)
        const params = {
          billing_type: values.billing_type,
          name: values.name,
          description: values.description,
          reason: values.reason,
          network_id: values.network,
          zone_id: values.zone_id,
          project_domain: values.project_domain || this.userInfo.projectDomainId,
          // project_domain: (domain && domain.key) || this.userInfo.projectDomainId,
          // project_id: (project && project.key) || this.userInfo.projectId,
          project_id: (values.project && values.project.key) || this.userInfo.projectId,
          user_id: this.userInfo.id,
        }
        if (values.tag) {
          params.__meta__ = values.tag
        }
        params.cloud_env = this.cloudEnvOptions[0].key
        if (values.sku) {
          params.file_system_type = values.sku.file_system_type
          params.protocol = values.sku.protocol
          params.storage_type = values.sku.storage_type
          params.manager_id = values.sku.external_id
        }
        if (values.capacity > 0) {
          params.capacity = values.capacity * values.capacity_unit
        }
        if (values.billing_type === 'postpaid') {
          if (values.durationStandard !== 'none') {
            params.duration = values.durationStandard
            if (values.durationStandard === 'custom') {
              params.duration = values.duration
            }
          }
          if (values.auto_renew) {
            params.auto_renew = values.auto_renew
          }
        } else {
          params.duration = values.duration
        }
        if (this.isOpenWorkflow) {
          await this.doForecast()
            .then(() => {
              this.doCreateWorkflow(params)
            })
          // await this.doCreateWorkflow(params)
        } else {
          await this.doCreate(params)
          this.loading = false
          this.$message.success(this.$t('network.nat.create.success'))
          this.$router.push('/nas')
        }
      } catch (error) {
        this.loading = false
        throw error
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../../../../../src/styles/less/theme';

//.prices {
//  .hour {
//    color: @error-color;
//    font-size: 24px;
//  }
//  .tips {
//    color: #999;
//    font-size: 12px;
//  }
//}
.prices {
  .hour {
    color: #f6a100;
    font-size: 24px;
  }
  .tips {
    //color: #999;
    color: #000;
    font-size: 14px;
  }
}
.tooltip {
  //color: #f6a100;
  color: #999;
  font-size: 12px;
  .tooltip-title {
    color: #f6a100;
    overflow: hidden;
    display: flex;
    flex-direction: row;
  }
}
</style>
