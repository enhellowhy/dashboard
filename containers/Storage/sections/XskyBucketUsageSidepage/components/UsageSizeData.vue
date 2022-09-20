<template>
  <div class="usage-user-data">
    <h3>{{ title }}</h3>
    <a-row class="d-flex mt-4">
      <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" :key="allLabel">
        <div>{{ allLabel }}</div>
        <a-row class="d-flex mt-2">
          <a-col class="flex-fill">
            <div class="d-flex center">
              <a-badge status="success" />
              <div>{{ useLabel }}</div>
              <span>&nbsp;&nbsp;</span>
              <div>{{ all }}</div>
            </div>
          </a-col>
          <a-col class="flex-fill m-10">
            <div class="d-flex">
              <a-badge status="success" />
              <div>{{ quotaLabel }}</div>
              <span>&nbsp;&nbsp;</span>
              <div>{{ allQuota }}</div>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <div class="usage-line mt-1" />
      <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" :key="localLabel">
        <div>{{ localLabel }}</div>
        <a-row class="d-flex mt-2">
          <a-col class="flex-fill p-10 center">
            <div class="d-flex">
              <a-badge status="success" />
              <div>{{ useLabel }}</div>
              <span>&nbsp;&nbsp;</span>
              <div>{{ local }}</div>
            </div>
          </a-col>
          <a-col class="flex-fill m-10">
            <div class="d-flex">
              <a-badge status="success" />
              <div>{{ quotaLabel }}</div>
              <span>&nbsp;&nbsp;</span>
              <div>{{ localQuota }}</div>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <div class="usage-line mt-1" />
      <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" :key="externalLabel">
        <div>{{ externalLabel }}</div>
        <a-row class="d-flex mt-2">
          <a-col class="flex-fill p-10 center">
            <div class="d-flex">
              <a-badge status="success" />
              <div>{{ useLabel }}</div>
              <span>&nbsp;&nbsp;</span>
              <div>{{ external }}</div>
            </div>
          </a-col>
          <a-col class="flex-fill m-10">
            <div class="d-flex">
              <a-badge status="success" />
              <div>{{ quotaLabel }}</div>
              <span>&nbsp;&nbsp;</span>
              <div>{{ externalQuota }}</div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { sizestrWithUnit } from '@/utils/utils'
import i18n from '@/locales'

export default {
  name: 'UsageSizeData',
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
      quotaLabel: i18n.t('cloudenv.xsky.quota') + ':',
      useLabel: i18n.t('cloudenv.xsky.use') + ':',
      allLabel: this.options?.label?.all,
      allQuota: this.options?.value?.allQuota === 0 ? i18n.t('storage.text_145') : sizestrWithUnit(this.options?.value?.allQuota, 'B', 1024),
      all: sizestrWithUnit(this.options?.value?.all, 'B', 1024),
      localLabel: this.options?.label?.local,
      localQuota: this.options?.value?.localQuota === 0 ? i18n.t('storage.text_145') : sizestrWithUnit(this.options?.value?.localQuota, 'B', 1024),
      local: sizestrWithUnit(this.options?.value?.local, 'B', 1024),
      externalLabel: this.options?.label?.external,
      externalQuota: this.options?.value?.externalQuota === 0 ? i18n.t('storage.text_145') : sizestrWithUnit(this.options?.value?.externalQuota, 'B', 1024),
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
  .label {
    font-size: 14px;
    font-weight: bolder;
  }
}
</style>
