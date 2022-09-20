<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('bill.text_1054')}}</div>
    <div slot="body">
      <a-form
        v-bind="formItemLayout"
        :form="form.fc">
        <a-form-item :label="$t('bill.text_146')">
<!--          <div class="rate-create d-flex flex-wrap">-->
<!--            <template v-for="item of manufactures">-->
<!--              <div class="item d-flex p-2 mr-3 align-items-center" v-decorator="decorators.manufacture" :key="item.name" :class="{ active: manufacture === item.name }" @click="selectManufacture(item.name)">-->
<!--                <img :src="item.logo" :style="{ height: item.height }" />-->
<!--&lt;!&ndash;                <div class="qr-code-bg-wrap" :style="{ backgroundImage: `url(${oneloginprotectAppQrIOS})` }" />&ndash;&gt;-->
<!--                <h5 class="flex-fill" v-if="showName(item)">{{ item.name }}</h5>-->
<!--              </div>-->
<!--            </template>-->
<!--          </div>-->
<!--          <a-radio-group class="rate-create d-flex flex-wrap" v-decorator="decorators.manufacture" @change="handleManufactureChange">-->
          <a-radio-group class="rate-create d-flex flex-wrap" v-decorator="decorators.manufacture">
            <a-radio-button class="item d-flex p-2 mr-2 align-items-center" v-for="item of manufactures" :key="item.name" :value="item.label" @click="selectManufacture(item.label)"><img :src="item.logo" :style="{ height: item.height }" /></a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="$t('bill.text_148')">
          <a-input :placeholder="$t('bill.prompt_model')" v-decorator="decorators.model" />
          <span slot="extra">{{$t('bill.model_tooltip')}}</span>
        </a-form-item>
<!--        <a-form-item :label="$t('bill.text_148')">-->
<!--&lt;!&ndash;          if has 'defaultValue' no has initValue in decorators&ndash;&gt;-->
<!--&lt;!&ndash;          <a-radio-group v-decorator="decorators.model" buttonStyle="solid" defaultValue="a2">&ndash;&gt;-->
<!--          <a-radio-group v-decorator="decorators.model" buttonStyle="solid">-->
<!--            <a-radio-button v-for="(v, k) in models" :key="k" :value="v">{{v}}</a-radio-button>-->
<!--          </a-radio-group>-->
<!--        </a-form-item>-->
        <a-form-item :label="$t('bill.text_1051')" :extra="$t('bill.text_1055')">
          <a-input-number :min="1" :max="1024" v-decorator="decorators.cpu_core_count" /> {{$t('compute.text_167')}}</a-form-item>
        <a-form-item :label="$t('bill.text_1052')" :extra="$t('bill.text_1056')">
          <a-input-number :min="1" :max="4096" v-decorator="decorators.memory_size_mb" /> GB
        </a-form-item>
        <a-form-item :label="$t('bill.text_37')">
          <a-input-number :min="0" :step="0.1" :precision="2" v-decorator="decorators.rate_text" />
        </a-form-item>
      </a-form>
    </div>
    <div slot="footer">
      <a-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('dialog.ok') }}</a-button>
      <a-button @click="cancelDialog">{{ $t('dialog.cancel') }}</a-button>
    </div>
  </base-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'
import { BRAND_TYPES } from '@Bill/views/rate/constants'

export default {
  name: 'CreateRateDialog',
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
      form: {
        fc: this.$form.createForm(this),
      },
      decorators: {
        cpu_core_count: [
          'cpu_core_count',
          {
            initialValue: 48,
          },
        ],
        memory_size_mb: [
          'memory_size_mb',
          {
            initialValue: 512,
          },
        ],
        manufacture: [
          'manufacture',
          {
            initialValue: 'New H3C Technologies Co., Ltd.',
          },
        ],
        model: [
          'model',
          {
            initialValue: '',
            rules: [
              { required: true, message: this.$t('bill.prompt_model') },
            ],
          },
        ],
        rate_text: [
          'rate_text',
          {
            initialValue: '50.0',
            rules: [
              { required: true, message: this.$t('bill.placeholder_rate') },
            ],
          },
        ],
      },
      formItemLayout: {
        wrapperCol: {
          span: 18,
        },
        labelCol: {
          span: 4,
        },
      },
      manufacture: 'New H3C Technologies Co., Ltd.',
      // BRAND_TYPES,
    }
  },
  computed: {
    manufactures () {
      return BRAND_TYPES
    },
    models () {
      // console.log('in models', this.manufacture)
      return BRAND_TYPES[this.manufacture].model.split(',')
    },
  },
  methods: {
    showName (item) {
      if (item.hiddenName === true) {
        return false
      } else {
        return true
      }
    },
    selectManufacture (item) {
      console.log('selectManufacture', item)
      this.manufacture = item
      // this.form.fc.setFieldsValue({ model: BRAND_TYPES[item].model.split(',')[0] })
    },
    handleManufactureChange (e) {
      console.log('handleManufactureChange', e.target.key)
      this.manufacture = e.target.key
    },
    validateForm () {
      return new Promise((resolve, reject) => {
        this.form.fc.validateFields((err, values) => {
          if (!err) {
            resolve(values)
          } else {
            reject(err)
          }
        })
      })
    },
    doCreate (data) {
      return this.params.onManager('create', {
        managerArgs: {
          data,
        },
      })
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.validateForm()
        this.loading = true
        values.memory_size_mb = values.memory_size_mb * 1024
        values.res_type = 'baremetal'
        values.request_type = 'create_baremetal'
        await this.doCreate(values)
        this.loading = false
        this.cancelDialog()
      } catch (error) {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="less">
.rate-create {
  .item {
    width: 100px;
    cursor: pointer;
    display: block;
    font-size: 14px;
    margin-bottom: 10px;
    //border: 1px solid #eee;
    text-align: center;
    border-radius: 3px;
    box-sizing: border-box;
    &.active {
      border-color:#4DA1FF;
      h5{
        color:#4DA1FF;
      }
    }
    &:hover {
      border-color:#4DA1FF;
      h5{
        color:#4DA1FF;
      }
    }
    h5 {
      margin: 0;
      font-size: 13px;
      font-weight: 400;
    }
    img {
      height: 24px;
    }
  }
}
</style>
