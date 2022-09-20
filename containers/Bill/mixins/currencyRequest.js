import { mapState } from 'vuex'
import { currencyUnitMap } from '@Bill/constants'

export default {
  computed: {
    ...mapState('common', {
      currency: state => state.bill.currency,
    }),
    currencySign () {
      if (currencyUnitMap[this.currency]) {
        return currencyUnitMap[this.currency].sign || ''
      }
      return ''
    },
    currencyCn () {
      if (currencyUnitMap[this.currency]) {
        return currencyUnitMap[this.currency].cn || ''
      }
      return ''
    },
    currencyParams () {
      if (this.currency) {
        return {
          filter: [`currency.equals("${this.currency}")`],
        }
      }
      return {}
    },
  },
  watch: {
    currency () {
      this.fetchData && this.fetchData()
    },
  },
}
