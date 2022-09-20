<template>
  <a-popconfirm placement="bottomRight" overlayClassName="custom-date-time" @confirm="submit" @cancel="cancel" :disabled="!showDomain" v-model="visible">
    <template v-slot:icon><i /></template>
    <template v-slot:title class="pl-0">
      <div class="d-flex align-items-center mt-1" slot="content" v-if="activeTab === 'project'">
        <div class="ant-form-item-label">
          <label :title="$t('bill.text_76')">{{$t('bill.text_76')}}</label>
        </div>
        <base-select
          resource="bill_conditions"
          v-model="domainTemp"
          :params="domainParams"
          filterable
          id-key="item_id"
          name-key="item_name"
          version="v1"
          :select-props="{ placeholder: $t('common_606'), allowClear: true }" />
      </div>
      <div class="ant-form-extra ml-4 pl-1">{{ $t('common_612') }}</div>
    </template>
    <a-radio-button value="project" @click.native="click">{{ $t('dictionary.project') }}</a-radio-button>
  </a-popconfirm>
</template>
<script>
export default {
  name: 'ProjectRadio',
  props: {
    activeTab: {
      type: String,
      required: true,
    },
    domain: {
      required: true,
    },
  },
  data () {
    return {
      visible: false,
      domainTemp: this.domain,
    }
  },
  computed: {
    showDomain () {
      return this.$store.getters.isAdminMode && this.$store.getters.l3PermissionEnable
    },
    domainParams () {
      return { query_type: 'domain', admin: this.$store.getters.isAdminMode }
    },
  },
  methods: {
    submit () {
      this.$emit('update:domain', this.domainTemp)
      this.visible = false
    },
    cancel () {
      this.domainTemp = this.domain
      this.visible = false
    },
    click () {
      this.$emit('update:activeTab', 'project')
    },
  },
}
</script>
