<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('bill.text_215')}}</div>
    <div slot="body">
      <dialog-selected-tips :name="$t('bill.text_210')" class="mt-3" :count="params.data.length" :action="$t('bill.text_215')" />
      <dialog-table v-if="params.columns && params.columns.length" :data="params.data" :columns="params.columns.slice(0, 3)" />
      <eip-form ref="formRef" :init-values="params.data[0]" />
    </div>
    <div slot="footer">
      <a-button type="primary" @click="handleConfirm" :loading="loading">{{ $t("dialog.ok") }}</a-button>
      <a-button @click="cancelDialog">{{ $t('dialog.cancel') }}</a-button>
    </div>
  </base-dialog>
</template>

<script>
import EipForm from '../components/EipForm'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'SuggestRuleUpdateDialog',
  components: {
    EipForm,
  },
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
    }
  },
  methods: {
    doCreate (data) {
      this.params.onManager('update', {
        id: this.params.data[0].id,
        managerArgs: {
          data,
        },
      })
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.$refs.formRef.validateForm()
        this.loading = true
        await this.doCreate(values)
        this.loading = false
        this.cancelDialog()
        this.$message.success(this.$t('bill.text_59'))
      } catch (error) {
        this.loading = false
        throw error
      }
    },
  },
}
</script>
