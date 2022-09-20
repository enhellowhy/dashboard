<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{ params.isCreate ? $t('bill.text_169') : $t('bill.text_143') }}</div>
    <div slot="body">
      <template v-if="!params.isCreate">
        <dialog-selected-tips :count="params.data.length" :name="$t('bill.text_37')" :action="$t('bill.text_144')" />
        <dialog-table :data="params.data" :columns="params.columns.slice(0, 3)" />
      </template>
      <a-form
        v-bind="formItemLayout"
        :form="form.fc">
        <a-form-item :label="$t('bill.text_88')" v-if="params.type === 'vm'">
          <a-input v-decorator="decorators.vmName" disabled  :placeholder="$t('bill.text_145')" />
        </a-form-item>
        <a-form-item :label="$t('bill.text_146')" v-if="params.type === 'baremetal' || params.type === 'gpu'">
          <a-input v-decorator="decorators.brand" disabled :placeholder="$t('bill.text_147')" />
        </a-form-item>
        <a-form-item :label="$t('bill.text_148')" v-if="params.type === 'baremetal' || params.type === 'gpu'">
          <a-input v-decorator="decorators.showModel" disabled :placeholder="$t('bill.text_149')" />
        </a-form-item>
        <a-form-item :label="$t('bill.text_148')" v-show="false" v-if="params.type === 'baremetal' || params.type === 'gpu'">
          <a-input v-decorator="decorators.model" disabled :placeholder="$t('bill.text_149')" />
        </a-form-item>
        <a-form-item :label="$t('bill.text_150')" v-if="params.type === 'baremetal'">
          <a-input v-decorator="decorators.spec" disabled :placeholder="$t('bill.text_151')" />
        </a-form-item>
        <a-form-item :label="$t('bill.text_81')" v-if="params.type === 'gpu'">
          <a-input v-decorator="decorators.platform" disabled :placeholder="$t('bill.text_152')" />
        </a-form-item>
        <a-form-item :label="$t('bill.text_37')" v-if="params.type === 'vm'">
          <a-input-number :min="0" :step="0.0001" :precision="5" v-decorator="decorators.rate_text" />
        </a-form-item>
        <a-form-item :label="$t('bill.text_37')" v-if="params.type === 'baremetal'">
          <a-input-number :min="0" :step="0.1" :precision="2" v-decorator="decorators.rate_text" />
        </a-form-item>
        <a-form-item :label="$t('bill.text_153')">
          <a-date-picker v-decorator="decorators.effective_date" :allowClear="false" :disabledDate="disabledDate" />
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
import { toVmName } from '@Bill/views/rate/utils'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'
import { sizestrWithUnit } from '@/utils/utils'

export default {
  name: 'BillRateSetDialog',
  mixins: [DialogMixin, WindowsMixin],
  data () {
    const initData = this.params.data[0]
    const ret = []
    let brand
    let model
    if (initData.res_type === 'baremetal') {
      const cpu_pair = initData.model.split('/')[0]
      const cpu = cpu_pair.split(':')[1]
      const mem_pair = initData.model.split('/')[1]
      const mem = mem_pair.split(':')[1]
      ret.push(this.$t('compute.text_292', [cpu]))
      ret.push(this.$t('compute.text_293', [sizestrWithUnit(mem.substr(0, mem.length - 1), 'M', 1024)]))
      brand = initData.model.split('/')[2].split(':')[1].replaceAll('_', ' ')
      model = initData.model.split('/')[3].split(':')[1].replaceAll('_', ' ')
    }
    const rateInit = (Math.round(initData.rate_text * 10000) / 10000).toFixed(5)
    const vmnameInit = toVmName(initData)
    return {
      loading: false,
      form: {
        fc: this.$form.createForm(this),
      },
      decorators: {
        // common
        rate_text: [
          'rate_text',
          {
            initialValue: rateInit,
            rules: [
              { required: true, message: this.$t('bill.placeholder_rate') },
            ],
          },
        ],
        effective_date: [
          'effective_date',
          {
            initialValue: this.params.isCreate ? this.$moment().add(1, 'day') : this.$moment(initData.effective_date.replace('TZ', '')),
          },
        ],
        // cpu
        vmName: [
          'vmName',
          {
            initialValue: vmnameInit,
          },
        ],
        // baremetal
        spec: [
          'spec',
          {
            // initialValue: initData.spec,
            initialValue: ret.join('、'),
          },
        ],
        // gpu
        platform: [
          'platform',
          {
            initialValue: initData.platform,
          },
        ],
        // baremetal、gpu
        brand: [
          'brand',
          {
            initialValue: brand,
          },
        ],
        showModel: [
          'showModel',
          {
            // initialValue: initData.model,
            initialValue: model,
          },
        ],
        model: [
          'model',
          {
            initialValue: initData.model,
            // initialValue: model,
          },
        ],
      },
      formItemLayout: {
        wrapperCol: {
          span: 21,
        },
        labelCol: {
          span: 3,
        },
      },
    }
  },
  created () {
  },
  methods: {
    disabledDate (current) {
      // Can not select days before today and today
      return current && current < this.$moment().endOf('day')
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
    async doCreate (params) {
      const data = {
        ...this.params.data[0],
        ...params,
      }
      if (data.id) delete data.id
      const res = await this.params.onManager('create', {
        managerArgs: {
          data,
        },
      })
      return res
    },
    async doUpdate (params) {
      const data = {
        ...this.params.data[0],
        ...params,
      }
      const id = data.id
      if (data.id) delete data.id
      const res = await this.params.onManager('update', {
        id,
        managerArgs: {
          data,
        },
      })
      return res
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.validateForm()
        const data = this.$moment(values.effective_date).format('YYYY-MM-DD')
        const params = {
          ...values,
          effective_date: `${data}TZ`,
        }
        if (this.params.type === 'baremetal') params.medium_type = params.spec
        this.loading = true
        if (this.params.isCreate) {
          await this.doCreate(params)
        } else {
          await this.doUpdate(params)
        }
        this.loading = false
        this.params.refresh()
        this.cancelDialog()
      } catch (error) {
        this.loading = false
      }
    },
  },
}
</script>
