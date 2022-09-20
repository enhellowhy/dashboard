<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{ params.title || $t('bill.text_54') }}</div>
    <div slot="body">
      <a-form
        v-bind="formItemLayout"
        :form="form.fc">
        <a-form-item :label="$t('bill.text_55')">
          <a-switch v-decorator="decorators.status" />
        </a-form-item>
        <template v-if="showForm">
          <a-form-item :label="$t('bill.text_56')">
            <a-input-number v-decorator="decorators.threshold" :min="1" />
            <span class="ml-1"> {{ params.currencyCn || $t('bill.text_29') }}</span>
          </a-form-item>
          <a-form-item :label="$t('bill.text_57')">
            <base-select
              v-decorator="decorators.recipients"
              class="w-100"
              :filterable="true"
              needParams
              resource="users"
              version="v1"
              :params="recipientParams"
              :select-props="{ placeholder: $t('bill.text_58'), allowClear: true, mode: 'multiple' }" />
          </a-form-item>
        </template>
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

export default {
  name: 'SetMoneyWarningDialog',
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
      form: {
        fc: this.$form.createForm(this, {
          onValuesChange: (props, values) => {
            if (values.hasOwnProperty('status')) {
              this.statusChange(values.status)
            }
          },
        }),
        fd: {},
      },
      showForm: false,
      decorators: {
        status: [
          'status',
          {
            valuePropName: 'checked',
            initialValue: false,
          },
        ],
        threshold: [
          'threshold',
          {
            initialValue: 1,
          },
        ],
        recipients: [
          'recipients',
          {
            initialValue: this.params.recipients || [],
            rules: [
              { required: true, message: this.$t('bill.text_58'), type: 'array' },
            ],
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
      formInitData: {},
    }
  },
  computed: {
    recipientParams () {
      return {
        limit: 0,
        scope: this.$store.getters.scope,
      }
    },
    isUpdate () {
      return this.formInitData && this.formInitData.id
    },
  },
  created () {
    this.meteralertsM = new this.$Manager('meteralerts', 'v1')
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    statusChange (val) {
      this.showForm = val
    },
    async fetchData () {
      const { data: { data = [] } } = await this.meteralertsM.list({
        params: this.params.fetchDataParams,
      })
      this.formInitData = data[0]
      if (this.formInitData) {
        const formData = {
          status: this.formInitData.status === 'Enabled',
          threshold: this.formInitData.threshold,
          recipients: this.formInitData.recipients.split(','),
        }
        this.statusChange(formData.status)
        this.$nextTick(() => {
          this.form.fc.setFieldsValue(formData)
        })
      }
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
    async doCreate (data) {
      try {
        if (this.isUpdate) {
          await this.meteralertsM.patch({
            id: this.formInitData.id,
            data: {
              ...data,
              project_id: this.$store.getters.userInfo.projectId,
              scope: this.$store.getters.scope,
            },
          })
        } else {
          await this.meteralertsM.create({
            data: {
              ...data,
              ...(this.params.createParams || {}),
              comparator: '>',
              channel: 'email',
              type: this.params.fetchDataParams.type,
              level: 'normal',
              project_id: this.$store.getters.userInfo.projectId,
              scope: this.$store.getters.scope,
            },
          })
        }
        this.$message.success(this.$t('bill.text_59'))
      } catch (error) {
        throw error
      }
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.validateForm()
        const params = {
          scope: this.$store.getters.scope,
          status: values.status ? 'Enabled' : 'Disabled',
        }
        if (this.showForm) {
          params.threshold = values.threshold
          params.recipients = values.recipients.join(',')
        }
        this.loading = true
        await this.doCreate(params)
        this.loading = false
        this.cancelDialog()
      } catch (error) {
        this.loading = false
      }
    },
  },
}
</script>
