<template>
  <div class="bill-card" :style="{ width, height }">
    <slot name="header" class="header" />
    <header v-if="header" class="header clearfix">
      <div class="title-wrapper float-left" v-if="header.title">
        <div class="title">{{ header.title }}</div>
        <div class="subtitle" v-if="header.subtitle">{{ header.subtitle }}</div>
      </div>
      <div class="float-right">
        <slot name="header-right" />
      </div>
    </header>
    <slot />
    <slot name="customizeContent" />
  </div>
</template>

<script>
export default {
  name: 'BillCard',
  props: {
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: 'auto',
    },
    header: Object,
    rightBtns: Array,
  },
  data () {
    return {
      activeItem: 0,
    }
  },
  methods: {
    change (item, n) {
      this.activeItem = n
    },
  },
}
</script>

<style lang="less" scoped>
.bill-card {
  border: 1px solid #F1F1F1;
  padding: 12px 24px;
  .header {
    font-weight: 500;
    .title-wrapper {
      .subtitle {
        font-size: 12px;
        color: #ccc;
      }
    }
  }
}
</style>
