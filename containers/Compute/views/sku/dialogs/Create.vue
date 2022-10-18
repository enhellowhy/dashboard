<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('compute.text_1054')}}</div>
    <div slot="body">
      <a-form
        v-bind="formItemLayout"
        :form="form.fc">
        <a-form-item :label="$t('compute.sku.category')">
          <a-radio-group class="d-flex flex-wrap" v-decorator="decorators.categories">
            <a-radio-button class="d-flex align-items-center" v-for="item of categories" :key="item.key" :value="item.key">{{ item.label }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="$t('compute.text_1051')" :extra="$t('compute.text_1055')">
          <a-input-number :min="1" :max="255" v-decorator="decorators.cpu_core_count" /> {{$t('compute.text_167')}}</a-form-item>
        <a-form-item :label="$t('compute.text_1052')" :extra="$t('compute.text_1056')">
          <a-input-number :min="0.5" :max="1024" v-decorator="decorators.memory_size_mb" /> GB
        </a-form-item>
        <a-form-item :label="$t('common.description')">
          <a-textarea :auto-size="{ minRows: 1, maxRows: 3 }" v-decorator="decorators.description" :placeholder="$t('common_367')" />
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
import { SKU_CATEGORY_MAP } from '@Compute/constants'

export default {
  name: 'CreateSkuDialog',
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
      form: {
        fc: this.$form.createForm(this),
      },
      decorators: {
        categories: [
          'instance_type_category',
          {
            initialValue: 'general_purpose',
          },
        ],
        cpu_core_count: [
          'cpu_core_count',
          {
            initialValue: 4,
          },
        ],
        memory_size_mb: [
          'memory_size_mb',
          {
            initialValue: 16,
          },
        ],
        description: ['description'],
      },
      formItemLayout: {
        wrapperCol: {
          span: 18,
        },
        labelCol: {
          span: 4,
        },
      },
    }
  },
  computed: {
    categories () {
      const categoryOptions = {}
      SKU_CATEGORY_MAP.li.forEach(item => {
        categoryOptions[item] = {
          label: this.getI18NValue(`skuCategoryOptions.li.${item}`, item),
          key: item,
          // disabled: !this.skuTypes.includes(item),
        }
      })
      return categoryOptions || {}
    },
  },
  methods: {
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
    getI18NValue (key, originVal) {
      if (this.$te(key)) {
        return this.$t(key)
      }
      return originVal
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
