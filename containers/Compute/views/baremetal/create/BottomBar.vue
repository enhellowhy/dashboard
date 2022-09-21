<template>
  <div class="create-server-result-wrap">
    <page-footer>
      <template class="content" v-slot:left>
        <div
          v-for="(tip, idx) of tips"
          :key="idx"
          class="d-flex flex-column justify-content-center flex-grow-1">
          <div
            v-for="obj of tip"
            :key="obj.label"
            class="d-flex align-items-center">
            <span class="label" :class="obj.labelClass">{{ obj.label }}：</span>
            <template v-if="obj.value">
              <span class="value text-truncate" :class="obj.valueClass">{{ obj.value }}</span>
            </template>
            <template v-else>
              <span class="value placeholder text-truncate" :class="obj.valueClass">------</span>
            </template>
          </div>
        </div>
      </template>
      <template v-slot:right>
        <div class="d-flex align-items-center">
           <div v-if="hasMeterService" class="mr-4 d-flex align-items-center">
            <div class="text-truncate">{{$t('compute.text_286')}}</div>
            <div class="ml-2 prices">
              <div class="hour text-truncate">
                <template v-if="price">
                  <m-animated-number :value="price" :formatValue="formatToPrice" />
                  <discount-price class="ml-2 mini-text" :discount="priceData.discount" :origin="originPrice" />
<!--                  <a-tooltip class="tooltip d-flex ml-2 mb-2 align-items-end">-->
<!--                    <div slot="title" class="d-flex flex-column justify-content-center">-->
<!--                      <div class="d-flex align-items-center flex-grow-1 content">-->
<!--                        <div class="m-1 flex-fill flex-grow-1" style="width: 50px">{{$t('compute.instance.price')}}</div>-->
<!--                        <div class="ml-2 flex-fill flex-grow-1" style="color: #f6a100">{{ formatToPriceWithoutHour(price) }}</div>-->
<!--                        <div class="ml-1 flex-fill flex-grow-1">{{$t('compute.hour.price.unit')}}</div>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                    <icon type="question" />-->
<!--                  </a-tooltip>-->
                </template>
                <template v-else>---</template>
              </div>
              <div class="tips text-truncate">
                <span v-html="priceTips" />
              </div>
<!--              <div class="tips text-truncate" v-if="!isPackage">-->
<!--                <template v-if="priceTips">{{$t('compute.text_287', [ priceTips.day , priceTips.month ])}}</template>-->
<!--                <template v-else>-&#45;&#45;</template>-->
<!--              </div>-->
            </div>
          </div>
          <a-button
            size="large"
            type="primary"
            native-type="submit"
            html-type="submit"
            style="width: 120px;"
            :loading="loading"
            :disabled="!!errors.length">{{ isOpenWorkflow && !isInstallOperationSystem ? $t('compute.text_288') : $t('compute.text_289') }}</a-button>
        </div>
        <side-errors :error-title="$t('compute.text_290')" :errors="errors" @update:errors="changeErrors" />
      </template>
    </page-footer>
  </div>
</template>

<script>
import _ from 'lodash'
import * as R from 'ramda'
import { BILL_TYPES_MAP, RESOURCE_TYPES_MAP, SERVER_TYPE } from '@Compute/constants'
import { sizestrWithUnit } from '@/utils/utils'
// import { HYPERVISORS_MAP, PROVIDER_MAP } from '@/constants'
import SideErrors from '@/sections/SideErrors'

export default {
  name: 'BottomBar',
  components: {
    SideErrors,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      required: true,
    },
    selectedSpecItem: {
      type: Object,
      required: true,
    },
    errors: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    bcount: {
      type: Number,
      required: true,
    },
    bname: {
      type: String,
      required: true,
    },
    bzone: {
      type: Object,
      required: true,
    },
    bimage: {
      type: Object,
      required: true,
    },
    resourceType: { // 资源池类型
      type: String,
    },
    dataDiskSizes: { // 数据盘磁盘大小之和
      type: Array,
      default: () => [],
    },
    isOpenWorkflow: {
      type: Boolean,
      default: false,
    },
    isServertemplate: {
      type: Boolean,
      default: false,
    },
    hasMeterService: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    this.getPriceList = _.debounce(this._getPriceList, 500)
    return {
      pricesList: [],
      // fd: this.form.fc.getFieldsValue(),
    }
  },
  computed: {
    fd () {
      return this.form.fc.getFieldsValue()
    },
    fi () {
      return this.form.fi
    },
    isPublic () {
      return this.type === SERVER_TYPE.public
    },
    // 是否为预付费资源池
    isPrepaid () {
      return this.resourceType === RESOURCE_TYPES_MAP.prepaid.key
    },
    // 是否为包年包月
    isPackage () {
      return this.fd.billType === BILL_TYPES_MAP.package.key
    },
    name () {
      return this.fd.name
    },
    ccount () {
      return this.bcount ? this.bcount : 1
    },
    cname () {
      return this.bname
    },
    czone () {
      const ret = this.bzone ? this.bzone.label : ''
      return ret
    },
    cimage () {
      const ret = this.bimage ? this.bimage.label : ''
      return ret
    },
    durationNum () {
      if (this.isPackage) {
        const { duration } = this.fd
        let num = parseInt(duration)
        if (num && duration.endsWith('Y')) {
          num *= 12 // 1年=12月
        } else if (num && duration.endsWith('W')) {
          num *= 0.25 // 1周=0.25月
        }
        return num
      }
      return 0
    },
    currency () {
      const currencys = {
        USD: '$',
        CNY: '¥',
      }
      if (this.pricesList && this.pricesList.length > 0) {
        return _.get(currencys, `[${this.pricesList[0].currency}]`) || currencys.CNY
      }
      return '¥'
    },
    price () {
      const count = this.ccount
      if (count && this.pricesList && this.pricesList.length > 0) {
        const { month_price: month, sum_price: sum } = this.pricesList[0]
        let _price = parseFloat(sum)
        if (this.isPackage && this.durationNum) {
          _price = parseFloat(month) * this.durationNum
        }
        return _price * parseFloat(count)
      }
      return null
    },
    priceTips () {
      if (this.price) {
        if (this.isPackage && this.durationNum) {
          const _day = (this.price / 30 / this.durationNum).toFixed(2)
          const _hour = (parseFloat(_day) / 24).toFixed(2)
          return this.$t('compute.text_1137', [this.currency, _day, this.currency, _hour])
        } else {
          const _day = (this.price * 24).toFixed(2)
          const _month = (parseFloat(_day) * 30).toFixed(2)
          return this.$t('compute.text_1138', [this.currency, _day, this.currency, _month])
        }
      }
      return '--'
    },
    zone () {
      let ret = this.fd.zone ? this.fd.zone.label : ''
      if (this.isPublic && !this.isPrepaid) {
        ret = this.fd.sku ? this.fd.sku.zone : ''
      }
      return ret
    },
    baremetalType () {
      return this.$t('compute.text_291', [this.$t('dictionary.baremetal')])
    },
    vmType () {
      let ret = this.$t('compute.text_291', [this.$t('dictionary.server')])
      if (this.fd.gpuEnable) {
        ret = `GPU${this.$t('dictionary.server')}`
      }
      return ret
    },
    disk () {
      const diskValueArr = [this.fd.systemDiskSize]
      R.forEachObjIndexed(value => {
        diskValueArr.push(value)
      }, this.fd.dataDiskSizes)
      return diskValueArr.reduce((prevDisk, diskValue) => prevDisk + diskValue, 0)
    },
    config () {
      const ret = []
      const { cpu = 0, mem = '0M' } = this.selectedSpecItem
      ret.push(this.$t('compute.text_292', [cpu]))
      ret.push(this.$t('compute.text_293', [sizestrWithUnit(mem.substr(0, mem.length - 1), 'M', 1024)]))
      return ret.join('、')
    },
    image () {
      return this.fd.image.label
    },
    tips () {
      const ret = [
        // [
        //   { label: this.$t('compute.text_228'), labelClass: 'label-w-50', value: this.name, valueClass: 'name-value' },
        //   { label: this.$t('compute.text_294'), labelClass: 'label-w-50', value: this.fd.count },
        // ],
        // [
        //   { label: this.$t('compute.text_177'), labelClass: 'label-w-50', value: this.zone },
        //   { label: this.$t('compute.text_175'), labelClass: 'label-w-50', value: this.baremetalType },
        // ],
        // [
        //   { label: this.$t('compute.text_295'), labelClass: 'label-w-80', value: this.config },
        //   { label: this.$t('compute.text_267'), labelClass: 'label-w-80', value: this.image },
        // ],
        [
          { label: this.$t('compute.text_228'), labelClass: 'label-w-50', value: this.cname, valueClass: 'name-value' },
          { label: this.$t('compute.text_294'), labelClass: 'label-w-50', value: this.ccount },
        ],
        [
          { label: this.$t('compute.text_177'), labelClass: 'label-w-50', value: this.czone },
          { label: this.$t('compute.text_175'), labelClass: 'label-w-50', value: this.baremetalType },
        ],
        [
          { label: this.$t('compute.text_295'), labelClass: 'label-w-80', value: this.config },
          { label: this.$t('compute.text_267'), labelClass: 'label-w-80', value: this.image },
        ],
      ]
      return ret
    },
    priceData () {
      const data = _.get(this.pricesList, '[0]', { discount: 1 })
      return data
    },
    originPrice () {
      const count = this.ccount
      if (count && this.pricesList && this.pricesList.length > 0) {
        const { month_gross_price: month, hour_gross_price: sum } = this.pricesList[0]
        let _price = parseFloat(sum)
        if (this.isPackage && this.durationNum) {
          _price = parseFloat(month) * this.durationNum
        }
        return _price * parseFloat(count)
      }
      return null
    },
    isInstallOperationSystem () { // 是否是安装操作系统
      if (this.$route.query.host_id) {
        return true
      }
      return false
    },
  },
  created () {
    this.baywatch([
      'ccount',
      'selectedSpecItem',
    ], (val) => {
      if (val) {
        console.log('baywatch............', val)
        this.getPriceList()
      }
    })
    this.$bus.$on('updateForm', (values) => {
      // console.log('fd can not update computed, give up')
      this.fd = {
        ...this.fd,
        ...values,
      }
    }, this)
  },
  methods: {
    baywatch (props, watcher) {
      const iterator = function (prop) {
        this.$watch(prop, watcher)
      }
      props.forEach(iterator, this)
    },
    changeErrors (errors) {
      this.$emit('update:errors', [])
    },
    formatToPrice (val) {
      let ret = `¥ ${val.toFixed(2)}`
      ret += !this.isPackage ? this.$t('compute.hour.price.unit') : ''
      // ret += this.$t('compute.text_296')
      return ret
    },
    formatToPriceWithoutHour (val) {
      return `${this.currency} ${val.toFixed(2)}`
    },
    async _getPriceList () {
      // if (!this.$appConfig.isPrivate) return // 如果是开源版本则取消调用meter服务
      if (!R.is(Number, this.ccount)) return
      const params = {
        scope: this.$store.getters.scope,
        quantity: this.ccount,
        brand: 'Default',
        res_type: 'baremetal',
      }
      // {
      //   "cpu": "64",
      //   "disk": "Linux_adapter0_SSD_223Gx1",
      //   "manufacture": "Powerleader",
      //   "mem": "128473M",
      //   "model": "PR1710P",
      //   "nic": "4",
      //   "value": "cpu:64/disk:Linux_adapter0_HDD_1863Gx1/disk:Linux_adapter0_SSD_223Gx1/manufacture:Powerleader/mem:128473M/model:PR1710P/nic:4"
      // }
      if (this.fi.createType === 'baremetal') {
        // params.spec = this.selectedSpecItem.value
        params.spec = `cpu:${this.selectedSpecItem.cpu}/mem:${this.selectedSpecItem.mem}/manufacture:${this.selectedSpecItem.manufacture}/model:${this.selectedSpecItem.model}`
      }
      if (R.isNil(params.brand) || R.isEmpty(params.brand)) return
      try {
        const { data: { data = [] } } = await new this.$Manager('price_infos', 'v1').get({ id: '', params })
        this.pricesList = data
      } catch (error) {
        throw error
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../../../../src/styles/less/theme';

.create-server-result-wrap {
  position: relative;
  font-size: 12px;
  .content {
    width: 80%;
    .label {
      color: #999;
      &.label-w-50 {
        width: 50px;
      }
      &.label-w-80 {
        width: 80px;
      }
    }
    .value {
      max-width: 300px;
      &.name-value {
        width: 100px;
      }
      &.placeholder {
        color: #888;
        font-style: italic;
      }
    }
  }
  .prices {
    .hour {
      //color: @error-color;
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
  .btns-wrapper {
    position: absolute;
    right: 20px;
  }
}
</style>
