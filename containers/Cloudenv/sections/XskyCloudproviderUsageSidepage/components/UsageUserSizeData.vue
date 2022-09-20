<template>
  <div class="usage-user-data">
    <h3>{{ title }}</h3>
    <a-row class="d-flex mt-4">
      <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" :key="allLabel">
        <p>{{ allLabel }}</p>
        <p>{{ all }}</p>
      </a-col>
      <div class="usage-line mt-1" />
      <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" :key="localLabel">
        <p>{{ localLabel }}</p>
        <p>{{ local }}</p>
      </a-col>
      <div class="usage-line mt-1" />
      <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" :key="externalLabel">
        <p>{{ externalLabel }}</p>
        <p>{{ external }}</p>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { sizestrWithUnit } from '@/utils/utils'
export default {
  name: 'UsageUserSizeData',
  props: {
    title: {
      type: String,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      allLabel: this.options?.label?.all,
      all: sizestrWithUnit(this.options?.value?.all, 'B', 1024),
      localLabel: this.options?.label?.local,
      local: sizestrWithUnit(this.options?.value?.local, 'B', 1024),
      externalLabel: this.options?.label?.external,
      external: sizestrWithUnit(this.options?.value?.external, 'B', 1024),
    }
  },
}
</script>

<style lang="scss" scoped>
.usage-line {
  width: 16px;
  height: 48px;
  border-left: 1px solid #d6d6d6;
}
.usage-user-data {
  width: 100%;
  height: 120px;
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
