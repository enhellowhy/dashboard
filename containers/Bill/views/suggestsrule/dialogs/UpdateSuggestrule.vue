<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('bill.text_273')}}</div>
    <div slot="body">
      <dialog-selected-tips :name="$t('bill.text_210')" :count="params.data.length" :action="$t('table.action.modify')" />
      <dialog-table class="mb-2" :data="params.data" :columns="params.columns" />
      <a-form
        class="mt-2"
        v-bind="formItemLayout"
        :form="form.fc">
        <a-form-item :label="$t('bill.text_198')">
          <a-input style="width: 100px" :min="1" type="number" v-decorator="decorators.time_from" /> {{ unit }}
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
import { mapGetters } from 'vuex'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'
import { durationMaps } from '@Bill/views/suggestsrule/constants'

export default {
  name: 'UpdateSuggestruleDialog',
  mixins: [DialogMixin, WindowsMixin],
  data () {
    let initialValue = '1'
    if (this.params.data[0].time_from) initialValue = this.params.data[0].time_from.replace(/\D+/, '')
    return {
      loading: false,
      form: {
        fc: this.$form.createForm(this),
      },
      decorators: {
        time_from: [
          'time_from',
          {
            initialValue,
            normalize: v => Number(v),
            rules: [
              { required: true, message: this.$t('bill.text_274') },
              { type: 'integer', min: 1, message: this.$t('bill.text_241'), trigger: 'blur' },
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
    }
  },
  computed: {
    ...mapGetters(['isAdminMode', 'scope', 'userInfo']),
    unitSource () {
      let u = 'd'
      if (this.params.data[0].time_from) u = this.params.data[0].time_from.replace(/\d+/, '')
      return u
    },
    unit () {
      return durationMaps[this.unitSource]
    },
  },
  methods: {
    doUpdate (data) {
      return this.params.onManager('performAction', {
        id: this.params.data[0].id,
        managerArgs: {
          action: 'config',
          data,
        },
      })
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.form.fc.validateFields()
        values.time_from = `${values.time_from}${this.unitSource}`
        await this.doUpdate(values)
        this.loading = false
        this.cancelDialog()
        this.params.refresh()
      } catch (error) {
        this.loading = false
      }
    },
  },
}
</script>
