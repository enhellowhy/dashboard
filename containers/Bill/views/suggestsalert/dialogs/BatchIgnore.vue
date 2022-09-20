<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('bill.text_268')}}</div>
    <div slot="body">
      <dialog-selected-tips :name="$t('bill.text_175')" :count="params.data.length" :action="$t('bill.text_269')" :unit="$t('bill.text_270')" />
      <dialog-table class="mb-2" :data="params.data" :columns="params.columns.slice(0, 3)" />
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
  name: 'BatchIgnoreDialog',
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
    }
  },
  methods: {
    doAction () {
      return this.params.onManager('performAction', {
        id: this.params.data[0].id,
        managerArgs: {
          action: 'ignore',
          data: {
            scope: this.$store.getters.scope,
            batch_ignore: true,
          },
        },
      }).then(ret => {
        this.$message.success(this.$t('bill.text_59'))
      })
    },
    async handleConfirm () {
      this.loading = true
      try {
        await this.doAction()
        this.loading = false
        this.cancelDialog()
        this.params.success && this.params.success()
        this.params.refresh()
      } catch (error) {
        this.loading = false
      }
    },
  },
}
</script>
