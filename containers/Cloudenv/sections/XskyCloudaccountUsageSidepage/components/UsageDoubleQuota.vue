<template>
  <div class="usage-double-quota">
    <h3>{{ title }}</h3>
    <a-row class="d-flex mt-4">
      <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" :key="objectsLabel">
        <p>{{ objectsLabel }}</p>
        <p>{{ objects }}</p>
      </a-col>
      <div class="usage-double-quota-line mt-1" />
      <a-col class="flex-fill" :md="12" :xl="8" :xxl="6" :key="sizeLabel">
        <p>{{ sizeLabel }}</p>
        <p>{{ size }}</p>
      </a-col>
    </a-row>
<!--    <div class="dashboard-card-body align-items-center">-->
<!--      <div class="flex-fill ml-4">-->
<!--        <div class="d-flex">-->
<!--          <a-icon type="global" />-->
<!--          <div class="flex-shrink-0 flex-grow-0">-->
<!--            {{ objectsLabel }}-->
<!--          </div>-->
<!--          <div class="ml-2 flex-fill">{{ objects }}</div>-->
<!--        </div>-->
<!--        <div class="d-flex">-->
<!--          <div class="flex-shrink-0 flex-grow-0">-->
<!--            {{ sizeLabel }}-->
<!--          </div>-->
<!--          <div class="ml-2 flex-fill text-right">{{ size }}</div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
import { sizestrWithUnit, sizestr } from '@/utils/utils'
export default {
  name: 'UsageDoubleQuota',
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
      objectsLabel: this.options?.label?.objects,
      // objects: this.options?.value?.objects,
      objects: sizestr(this.options?.value?.objects, 'B', 1024),
      sizeLabel: this.options?.label?.size,
      // size: this.options?.value?.size,
      size: sizestrWithUnit(this.options?.value?.size, 'B', 1024),
    }
  },
}
</script>

<style lang="scss" scoped>
.usage-double-quota-line {
  width: 16px;
  height: 48px;
  border-left: 1px solid #d6d6d6;
}
.usage-double-quota {
  width: 100%;
  height: 130px;
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
