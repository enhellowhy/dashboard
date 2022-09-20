<template>
  <div class="usage-dns">
    <h3>{{ title }}</h3>
    <a-row class="dns-item d-flex align-items-center position-relative">
      <a-col class="label flex-fill" :md="12" :xl="8" :xxl="6" :key="1">
        <p>{{ label }}</p>
      </a-col>
      <a-col class="content flex-fill" :md="12" :xl="8" :xxl="6" :key="2">
        <div v-for="(item, i) in dnsList" :key="i">
          <a-badge status="success" />
          <span>{{ item }}</span>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import * as R from 'ramda'

export default {
  name: 'UsageDns',
  props: {
    title: {
      type: String,
    },
    label: {
      type: String,
    },
    value: {
      type: [Array],
    },
  },
  computed: {
    dnsList () {
      const list = []
      if (R.is(Array, this.value)) {
        return this.value
      } else {
        list.push(this.value)
      }
      return list
    },
  },
}
</script>

<style lang="scss" scoped>
.usage-dns {
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
  .dns-item {
    .label {
      font-size: 12px;
      bottom: -10px;
    }
    .content {
      height: 100%;
      color: #666;
      /*自动隐藏文字*/
      text-overflow: ellipsis;
      /*文字隐藏后添加省略号*/
      white-space: nowrap;
      /*强制不换行*/
    }
  }
}
</style>
