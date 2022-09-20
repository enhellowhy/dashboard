<template>
  <a-radio-group :value="currency" @change="change">
    <a-radio-button v-for="item in options" :key="item.item_id" :value="item.item_id">{{ item.item_name }}</a-radio-button>
  </a-radio-group>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { currencyUnitMap } from '@Bill/constants'
import { hasPermission } from '@/utils/auth'

export default {
  name: 'BillCurrency',
  computed: {
    ...mapState('common', {
      currency: state => state.bill.currency,
      currencyOpts: state => state.bill.currencyOpts,
    }),
    options () {
      return this.currencyOpts.map(val => {
        const localItem = currencyUnitMap[val.item_id]
        const text = localItem ? localItem.label : val.item_name
        return {
          ...val,
          item_name: this.$t('bill.text_39', [text]),
        }
      })
    },
  },
  created () {
    const params = { admin: this.$store.getters.isAdminMode, scope: this.$store.getters.scope }
    if (hasPermission('bill_conditions_list')) {
      this.fetchCurrency(params)
    }
  },
  methods: {
    ...mapMutations('common', {
      setCurrency: 'SET_BILL_CURRENCY',
    }),
    ...mapActions('common', ['fetchCurrency']),
    change (e) {
      this.setCurrency(e.target.value)
    },
  },
}
</script>
