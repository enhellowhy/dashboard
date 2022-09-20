<template>
  <a-popconfirm placement="bottomRight" overlayClassName="custom-date-time" @confirm="submit" @cancel="cancel" v-model="visible">
    <template v-slot:icon><i /></template>
    <template v-slot:title class="pl-0" v-if="activeTab === 'tag'">
      <div class="d-flex align-items-center mt-1" slot="content">
        <div class="ant-form-item-label">
          <label :title="$t('bill.text_79')">{{$t('bill.text_79')}}</label>
        </div>
        <base-select
          resource="res_tag_details"
          v-model="labelTemp"
          :params="tagParams"
          filterable
          version="v1"
          minWidth="140px"
          :mapper="tagMapper"
          :isDefaultSelect="true"
          :select-props="{ placeholder: $t('common_605') }" />
      </div>
    </template>
    <a-radio-button v-if="tabs.find(v => v.key === 'tag')" value="tag" @click.native="click">{{ $t('bill.text_79') }}</a-radio-button>
  </a-popconfirm>
</template>
<script>
export default {
  name: 'TagRadio',
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    activeTab: {
      type: String,
      required: true,
    },
    label: {
      required: true,
    },
  },
  data () {
    return {
      visible: false,
      labelTemp: this.label,
      tagParams: {
        limit: 0,
        user_meta: true,
        res_type: 'server',
        scope: this.$store.getters.scope,
      },
    }
  },
  watch: {
    labelTemp (val, oldV) {
      if (val && !oldV) { // 说明是初始化
        this.$emit('update:label', this.labelTemp)
      }
    },
    activeTab (val, oldV) {
      if (oldV === 'tag' && val !== 'tag') {
        this.labelTemp = undefined
        this.$emit('update:label', this.labelTemp)
      }
    },
  },
  methods: {
    tagMapper (list) {
      const maps = {}
      list.forEach(item => {
        const key = item.key.startsWith('user:') ? item.key.replace('user:', '') : item.key
        maps[item.key] = {
          name: key,
          id: item.key,
        }
      })
      return Object.values(maps)
    },
    submit () {
      this.$emit('update:label', this.labelTemp)
      this.visible = false
    },
    cancel () {
      this.visible = false
      this.labelTemp = this.label
    },
    click () {
      this.$emit('update:activeTab', 'tag')
    },
  },
}
</script>
