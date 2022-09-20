<template>
  <page-list
    :list="list"
    :columns="columns"
    :group-actions="groupActions"
    :single-actions="singleActions" />
</template>

<script>
import ColumnsMixin from '../mixins/columns'
import singleActions from '../mixins/singleActions'
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'
import { getProjectDomainFilter } from '@/utils/common/tableFilter'

export default {
  name: 'SuggestsRuleConfigList',
  mixins: [WindowsMixin, ListMixin, ColumnsMixin, singleActions],
  props: {
    cloudEnv: {
      type: String,
    },
  },
  data () {
    const filterOptions = {
      name: {
        label: this.$t('bill.text_88'),
        filter: true,
        formatter: val => {
          return `name.contains("${val}")`
        },
      },
      type: {
        label: this.$t('bill.text_73'),
        dropdown: true,
        items: Object.keys(this.$t('suggestsyRuleTypes')).map(k => {
          return { label: this.$t(`suggestsyRuleTypes.${k}`), key: k }
        }),
      },
      tenant: {
        label: this.$t('dictionary.project'),
        dropdown: true,
        distinctField: {
          type: 'extra_field',
          key: 'tenant',
        },
      },
      project_domains: getProjectDomainFilter(),
    }
    const belongscopeItems = () => {
      const _shareScope = { ...this.$t('shareScope') }
      if (this.$store.getters.scope === 'domain') {
        delete _shareScope.system
      }
      if (this.$store.getters.scope === 'project') {
        delete _shareScope.domain
        delete _shareScope.system
      }
      return Object.keys(_shareScope).map(k => {
        return { label: this.$t(`shareScope.${k}`), key: k }
      })
    }
    const _belongscopeItems = belongscopeItems()
    if (_belongscopeItems.length > 1) {
      filterOptions.belong_scope = {
        label: this.$t('bill.text_219'),
        dropdown: true,
        items: _belongscopeItems,
      }
    }
    return {
      list: this.$list.createList(this, {
        apiVersion: 'v1',
        resource: 'suggestsysruleconfigs',
        filterOptions,
      }),
      groupActions: [
        // {
        //   label: this.$t('bill.text_193'),
        //   action: () => {
        //     this.createDialog('SuggestsRuleConfigCreate', {
        //       onManager: this.onManager,
        //     })
        //   },
        //   meta: () => {
        //     return {
        //       buttonType: 'primary',
        //     }
        //   },
        // },
        {
          label: this.$t('bill.text_271'),
          action: (obj) => {
            this.createDialog('DeleteResDialog', {
              vm: this,
              data: this.list.selectedItems,
              columns: this.columns.filter(item => {
                return ['ignore_alert'].indexOf(item.field) === -1
              }),
              title: this.$t('bill.text_271'),
              name: this.$t('bill.text_175'),
              onManager: this.onManager,
            })
          },
          meta: (obj) => this.$getDeleteResult(this.list.selectedItems),
        },
      ],
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.list.fetchData()
    },
  },
}
</script>
