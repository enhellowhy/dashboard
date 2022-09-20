<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('bill.text_177')}}</div>
    <div slot="body">
      <div>
        <div class="title">{{$t('bill.text_178')}}</div>
        <p>{{ ruleDesc || $t('bill.text_163') }}</p>
        <div class="title">{{$t('bill.text_179')}}</div>
        <p>{{ JSON.stringify(selectItem.problem || '{}') }}</p>
        <div class="title">{{$t('bill.text_180')}}</div>
        <p class="suggest">{{ selectItem.suggest || $t('bill.text_163') }}</p>
      </div>
      <dialog-selected-tips :name="$t('bill.text_82')" class="mt-3" :count="params.data.length" :action="action" />
      <dialog-table v-if="params.columns && params.columns.length" :data="params.data" :columns="columns" />
    </div>
    <div slot="footer">
      <a-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('dialog.ok') }}</a-button>
      <a-button @click="cancelDialog">{{ $t('dialog.cancel') }}</a-button>
    </div>
  </base-dialog>
</template>

<script>
import { actionMap } from '../constants'
import { getRuleTypeName, getRuleDesc } from '@Bill/utils'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'SuggestsAlertDeleteDialog',
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
    }
  },
  computed: {
    columns () {
      const showFields = ['name', 'type', 'rule_name']
      return this.params.columns.filter((item) => { return showFields.includes(item.field) })
    },
    selectItem () {
      return this.params.data[0]
    },
    action () {
      const action = this.selectItem.action
      return actionMap[action] || this.$t('bill.text_167')
    },
    ruleDesc () {
      const ruleName = getRuleTypeName(this.selectItem.type)
      const ruleDesc = getRuleDesc(this.selectItem.type, this.selectItem.monitor_config) || this.$t('bill.text_163')
      return `${ruleName}(${ruleDesc})`
    },
  },
  methods: {
    doDelete (data) {
      this.params.onManager('delete', {
        id: this.params.data[0].id,
        managerArgs: {
          data,
        },
      })
    },
    async handleConfirm () {
      this.loading = true
      try {
        this.loading = true
        await this.doDelete()
        this.loading = false
        this.cancelDialog()
        if (this.params.vm && this.params.vm.destroySidePages) {
          this.params.vm.destroySidePage(this.params.vm.windowId)
        }
        this.params.success && this.params.success()
        this.$message.success(this.$t('bill.text_59'))
      } catch (error) {
        this.loading = false
        throw error
      }
    },
  },
}
</script>
<style lang="less" scoped>
.title {
  font-size: 12px;
  color: rgb(170, 170, 170);
}
.suggest {
  color: rgb(215, 173, 70);
}
</style>
