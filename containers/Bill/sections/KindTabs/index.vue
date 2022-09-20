<template>
  <bill-card class="mt-4">
    <div slot="header" class="clearfix kind-tab-header">
      <div class="float-left">
        <a-radio-group v-model="activeTab" @change="radioChange">
          <a-radio-button :value="item.key" v-for="item in tabsC" :key="item.key">{{ item.label }}</a-radio-button>
          <project-radio :domain.sync="domain" :activeTab.sync="activeTab" />
          <tag-radio :label.sync="label" :activeTab.sync="activeTab" :tabs="tabs" />
        </a-radio-group>
      </div>
<!--      <div class="float-right d-flex">-->
<!--        <date-time :getParams.sync="dateParams" />-->
<!--      </div>-->
    </div>
    <component
      ref="kindTabItem"
      v-show="!loading"
      :loading.sync="loading"
      :is="activeTab"
      :date="dateParams"
      :platform="platform"
      :account="account"
      :label="label"
      :domain="domain"
      :currencySign="currencySign"
      :currencyParams="currencyParams"
      :envParams="envParams" />
  </bill-card>
</template>
<script>
import Platform from './Platform'
import Account from './Account'
import ResourceType from './ResourceType'
import Domain from './Domain'
import Resource from './Resource'
import Project from './Project'
import Region from './Region'
import ChargeType from './ChargeType'
import Tag from './Tag'
import Cloudprovider from './Cloudprovider'
import ProjectRadio from './components/ProjectRadio'
import TagRadio from './components/TagRadio'
import DateTime from '@Bill/sections/DateTime'
import BillCard from '@Bill/components/BillCard'
import i18n from '@/locales'

const allTabs = {
  platform: {
    label: i18n.t('bill.text_81'),
    key: 'platform',
    index: 1,
  },
  'resource-type': {
    label: i18n.t('bill.text_73'),
    key: 'resource-type',
    index: 2,
  },
  // resource: {
  //   label: i18n.t('bill.text_82'),
  //   key: 'resource',
  //   height: 470,
  //   index: 3,
  // },
  // account: {
  //   label: i18n.t('dictionary.cloudaccount'),
  //   key: 'account',
  //   height: 470,
  //   index: 4,
  // },
  // cloudprovider: {
  //   label: i18n.t('dictionary.cloudprovider'),
  //   key: 'cloudprovider',
  //   height: 470,
  //   index: 5,
  // },
  // region: {
  //   label: i18n.t('bill.text_83'),
  //   key: 'region',
  //   index: 6,
  // },
  'charge-type': {
    label: i18n.t('bill.text_84'),
    key: 'charge-type',
    index: 7,
  },
  // domain: {
  //   label: i18n.t('dictionary.domain'),
  //   key: 'domain',
  //   index: 8,
  // },
  project: {
    label: i18n.t('dictionary.project'),
    key: 'project',
    height: 470,
    index: 9,
  },
  // tag: {
  //   label: i18n.t('bill.text_79'),
  //   key: 'tag',
  //   index: 10,
  // },
}

export default {
  name: 'KindTabs',
  components: {
    BillCard,
    Platform,
    Account,
    ResourceType,
    Domain,
    Resource,
    Project,
    Region,
    ChargeType,
    Tag,
    Cloudprovider,
    DateTime,
    ProjectRadio,
    TagRadio,
  },
  props: {
    tabs: {
      type: Array,
      default: () => Object.values(allTabs),
    },
    platform: String,
    account: String,
    envParams: Object,
    currencySign: {
      type: String,
      default: '￥',
    },
    currencyParams: {
      type: Object,
      default: () => ({}),
    },
    dateParams: {},
  },
  data () {
    return {
      month: this.$moment(),
      activeTab: this.tabs[0].key,
      label: undefined,
      domain: undefined,
      labelLoading: false,
      loading: false,
      // dateParams: {},
    }
  },
  computed: {
    tabsC () {
      return this.tabs.filter(val => {
        if (val.key === 'project') return false
        if (val.key === 'tag') return false
        if (!this.$store.getters.isAdminMode && val.key === 'domain') return false
        return true
      }).sort((a, b) => {
        return allTabs[a.key].index - allTabs[b.key].index
      })
    },
  },
  methods: {
    radioChange () {
      this.label = ''
    },
    loadChange (status) {
      this.labelLoading = status
    },
  },
}
</script>

<style lang="less" scoped>
.kind-tab-header {
  &::v-deep .ant-calendar-range-picker-input {
    width: 86px !important;
  }
}
</style>
