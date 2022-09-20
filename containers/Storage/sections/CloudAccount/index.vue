<template>
  <div class="d-flex">
    <a-form-item :wrapperCol="{ span: 24 }">
      <a-select
        :allowClear="allowClear"
        dropdownClassName="oc-select-dropdown"
        :value="valueC"
        class="w-100"
        :labelInValue="labelInValue"
        v-decorator="decorators.cloudaccount"
        :loading="accountLoading"
        :placeholder="$t('common.text00045')"
        @change="accountChange"
        :filterOption="filterOption"
        showSearch>
        <a-select-option v-for="item of accounts" :value="item.key" :key="item.key">
          <span class="text-color-secondary option-prefix">{{ $t('storage.text_94') }}: </span>{{ item.label }}
        </a-select-option>
      </a-select>
    </a-form-item>
  </div>
</template>

<script>
import * as R from 'ramda'
import _ from 'lodash'
// import { mapGetters } from 'vuex'
import { Manager } from '@/utils/manager'

export default {
  name: 'CloudAccount',
  props: {
    value: {
    },
    labelInValue: {
      type: Boolean,
      default: false,
    },
    decorators: {
      type: Object,
      validator: val => R.is(Array, val.cloudaccount),
    },
    fc: {
      type: Object,
      required: true,
    },
    allowClear: Boolean,
  },
  data () {
    return {
      // accountData: {},
      accounts: [],
      accountLoading: false,
    }
  },
  // computed: mapGetters(['scope', 'capability']),
  computed: {
    valueC () {
      if (R.is(Object, this.value)) {
        return this.value.label
      }
      return this.value
    },
  },
  mounted () {
    this.am = new Manager('cloudaccounts')
    this.fetchAccounts()
  },
  methods: {
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    /*
     * @params {Object} account { key: <accountId> }
     */
    _setInitAccount (account) {
      if (!R.isNil(account) && !R.isEmpty(account)) {
        if (this.labelInValue) {
          this.fc.setFieldsValue({
            cloudaccount: { key: account.key, label: account.label },
          })
        } else {
          this.fc.setFieldsValue({
            cloudaccount: account.key,
          })
        }
      }
    },
    async fetchAccounts () {
      this.accountLoading = true
      try {
        const params = {
          scope: this.scope,
          brand: 'xsky',
        }
        const response = await this.am.list({ params })
        const data = response.data.data
        this.accounts = data.map(val => ({ ...val, key: val.id, label: val.name })) || []
        let defaultData = this.accounts[0]
        const initialValue = _.get(this.decorators, 'cloudaccount[1].initialValue')
        if (initialValue) {
          const findInitValue = this.accounts.find(val => val.key === (initialValue.key || initialValue))
          if (findInitValue) {
            defaultData = { key: findInitValue.key, label: findInitValue.label }
          }
        }
        this.accountChange(defaultData || {})
        this._setInitAccount(defaultData || {})
      } catch (error) {
        throw error
      } finally {
        this.accountLoading = false
      }
    },
    accountChange (account) {
      // this.accountData = account
      this.$emit('update:cloudaccount', account)
      this.fc.getFieldDecorator('cloudaccount', { preserve: true, initialValue: account })
    },
  },
}
</script>
