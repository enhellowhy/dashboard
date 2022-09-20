<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('cloudenv.clusters.hosts.create')}}</div>
    <div slot="body">
      <a-form
        :form="form.fc">
        <a-form-item :label="$t('cloudenv.text_95')" v-bind="formItemLayout">
          <a-input v-decorator="decorators.generate_name" :placeholder="$t('validator.resourceName')" @change="e => { form.fi.name = e.target.value }" />
            <name-repeated
              ref="nameRepeated"
              #extra
              res="clusters"
              :name="form.fi.name" />
        </a-form-item>
        <a-form-item required :label="$t('cloudenv.clusters.drs.strategy.text_1')" v-bind="formItemLayout">
          <cluster-strategy-radio :decorator="decorators.strategy" />
        </a-form-item>
        <a-form-item :label="$t('cloudenv.text_384')" v-bind="formItemLayout">
          <a-radio-group v-decorator="decorators.resource_type">
            <a-radio-button
              v-for="item in resourceTypeOpts"
              :value="item.key"
              :key="item.key">{{ item.label }}</a-radio-button>
          </a-radio-group>
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
import NameRepeated from '@/sections/NameRepeated'
import ClusterStrategyRadio from '@Cloudenv/sections/ClusterStrategyRadio'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'CreateClusterDialog',
  components: {
    ClusterStrategyRadio,
    NameRepeated,
  },
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
      form: {
        fc: this.$form.createForm(this),
        fi: {
          name: '',
        },
      },
      decorators: {
        generate_name: [
          'generate_name',
          {
            validateFirst: true,
            rules: [
              { required: true, message: this.$t('cloudenv.text_190') },
              // { validator: this.$validate('resourceName') },
            ],
          },
        ],
        strategy: [
          'strategy',
          {
            initialValue: 'usage',
          },
        ],
        resource_type: [
          'resource_type',
          {
            initialValue: 'hosts',
          },
        ],
      },
      resourceTypeOpts: [
        { key: 'hosts', label: this.$t('cloudenv.clusters.hosts') },
        // { key: 'storages', label: this.$t('cloudenv.text_6') },
        // { key: 'networks', label: this.$t('cloudenv.text_7') },
      ],
      formItemLayout: {
        wrapperCol: {
          span: 20,
        },
        labelCol: {
          span: 4,
        },
      },
    }
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
