<template>
  <div class="usage-ring">
    <h3>{{ title }}</h3>
    <div class="d-flex">
      <a-progress class="flex-fill m-3 justify-content-center" type="circle" :percent="percent" :strokeWidth="8" :status="status" :strokeColor="percentColor">
        <template v-slot:format><span class="percent-tips" :style="{ color: percentColor }">{{ percentTips }}</span></template>
      </a-progress>
      <div class="flex-fill m-5 justify-content-center">
        <div class="d-flex">
          <a-badge status="success" />
          <div class="flex-fill">{{ eosNameLabel }}</div>
          <div class="ml-2 flex-fill text-left">{{ eosName }}</div>
        </div>
        <div class="d-flex">
          <a-badge status="success" />
          <div class="flex-fill">{{ eosIndexpoolLabel }}</div>
          <div class="ml-2 flex-fill text-left">{{ eosIndexpool }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import COLORS from '@/constants/color'
import i18n from '@/locales'

export default {
  name: 'UsageRing',
  props: {
    title: {
      type: String,
    },
    field: {
      type: String,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      eosIndexpoolLabel: this.options?.label?.eosIndexpool,
      eosIndexpool: this.options?.value?.eosIndexpool,
      eosNameLabel: this.options?.label?.eosName,
      eosName: this.options?.value?.eosName,
      eosStatusLabel: this.options?.label?.eosStatus,
      eosStatus: this.options?.value?.eosStatus,
    }
  },
  computed: {
    percent () {
      if (this.eosStatus === 'finished') {
        return 100
      }
      return 0
    },
    status () {
      let ret = 'normal'
      if (this.percent !== 100) {
        ret = 'exception'
      }
      return ret
    },
    percentColor () {
      if (this.percent !== 100) {
        return COLORS.COLORS_SCHEME.REVERSE.PERCENT_60
      }
      return COLORS.COLORS_SCHEME.REVERSE.PERCENT_100
    },
    percentTips () {
      let ret = i18n.t('cloudenv.xsky.eos.status.normal')
      if (this.percent !== 100) {
        ret = i18n.t('cloudenv.xsky.eos.status.exception')
      }
      return ret
    },
  },
}
</script>
<style lang="scss" scoped>
.usage-ring {
  width: 100%;
  height: 197px;
  padding: 20px 10px;
  margin-bottom: 16px;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
  h3 {
    font-size: 14px;
    font-weight: bolder;
  }
}
</style>
