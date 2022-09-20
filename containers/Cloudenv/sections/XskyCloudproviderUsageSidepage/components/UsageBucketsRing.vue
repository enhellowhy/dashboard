<template>
  <div class="usage-ring">
    <h3>{{ title }}</h3>
    <a-row class="d-flex">
      <a-col class="flex-fill">
        <a-progress class="flex-fill m-3" type="circle" :percent="percent" :strokeWidth="8" :status="status" :strokeColor="percentColor">
          <template v-slot:format><span class="percent-tips" :style="{ color: percentColor }">{{ percentTips }}</span></template>
        </a-progress>
      </a-col>
      <a-col class="flex-fill p-10 center">
        <div class="d-flex">
          <a-badge status="success" />
          <div class="label">{{ sumLabel }}</div>
          <div>{{ sum }}</div>
        </div>
      </a-col>
      <a-col class="flex-fill m-10">
        <div class="d-flex">
          <a-badge status="success" />
          <div class="label">{{ useLabel }}</div>
          <div>{{ use }}</div>
        </div>
      </a-col>
      <a-col class="flex-fill">
        <div class="d-flex">
          <a-badge status="success" />
          <div class="label">{{ unuseLabel }}</div>
          <div>{{ unuse }}</div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import COLORS from '@/constants/color'

export default {
  name: 'UsageBucketsRing',
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
      sumLabel: this.options?.label?.sum + ':     ',
      sum: this.options?.value?.sum,
      useLabel: this.options?.label?.use + ':  ',
      use: this.options?.value?.use,
      unuseLabel: this.options?.label?.unuse + ':  ',
      unuse: this.options?.value?.unuse,
    }
  },
  computed: {
    percent () {
      if (this.use && this.sum) {
        return parseFloat((this.use / this.sum).toFixed(3) * 100)
      }
      return 0
    },
    percentTips () {
      return `${this.percent} %`
    },
    percentColor () {
      const isReverse = COLORS.COLORS_SCHEME_REVERSE_FIELDS.find(v => this.field.endsWith(v))

      if (isReverse) {
        if (this.percent < 60) {
          return COLORS.COLORS_SCHEME.REVERSE.PERCENT_60
        } else if (this.percent < 80) {
          return COLORS.COLORS_SCHEME.REVERSE.PERCENT_80
        } else {
          return COLORS.COLORS_SCHEME.REVERSE.PERCENT_100
        }
      } else {
        if (this.percent < 60) {
          return COLORS.COLORS_SCHEME.DEFAULT.PERCENT_60
        } else if (this.percent < 80) {
          return COLORS.COLORS_SCHEME.DEFAULT.PERCENT_80
        } else {
          return COLORS.COLORS_SCHEME.DEFAULT.PERCENT_100
        }
      }
    },
    status () {
      let ret = 'normal'
      if (this.percent > 100) {
        ret = 'exception'
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
  .label {
    font-size: 14px;
    font-weight: bolder;
  }
}
</style>
