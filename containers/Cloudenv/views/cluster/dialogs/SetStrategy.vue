<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('cloudenv.clusters.drs.strategy.text_0')}}</div>
    <div slot="body">
      <dialog-selected-tips :name="$t('dictionary.hostcluster')" :count="params.data.length" :action="$t('cloudenv.clusters.drs.strategy.text_0')" />
      <dialog-table :data="params.data" :columns="params.columns.slice(0, 4)" />
      <a-form
        :form="form.fc">
        <a-form-item required :label="$t('cloudenv.clusters.drs.strategy.text_1')" v-bind="formItemLayout">
          <cluster-strategy-radio :decorator="decorators.strategy" />
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
import ClusterStrategyRadio from '@Cloudenv/sections/ClusterStrategyRadio'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'SetClusterStrategyDialog',
  components: {
    ClusterStrategyRadio,
  },
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
      form: {
        fc: this.$form.createForm(this),
      },
      decorators: {
        strategy: [
          'strategy',
          {
            initialValue: this.params.data[0].strategy || '',
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
    doSubmit (values) {
      this.params.onManager('update', {
        id: this.params.data[0].id,
        managerArgs: {
          data: values,
        },
      })
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.validateForm()
        this.loading = true
        await this.doSubmit(values)
        this.loading = false
        this.cancelDialog()
      } catch (error) {
        this.loading = false
      }
    },
  },
}
</script>
