<template>
  <page-list
    :list="list"
    :columns="columns"
    :group-actions="groupActions"
    :single-actions="singleActions"
    :showSearchbox="showSearchbox"
    :showGroupActions="showGroupActions"
    :export-data-options="exportDataOptions" />
</template>

<script>
// import * as R from 'ramda'
import ColumnsMixin from '../mixins/columns'
import SingleActionsMixin from '../mixins/singleActions'
import { getStatusFilter, getEnabledFilter, getTenantFilter, getDomainFilter, getDescriptionFilter } from '@/utils/common/tableFilter'
import WindowsMixin from '@/mixins/windows'
import GlobalSearchMixin from '@/mixins/globalSearch'
import ListMixin from '@/mixins/list'
import expectStatus from '@/constants/expectStatus'

export default {
  name: 'ScalingGroupList',
  mixins: [WindowsMixin, ListMixin, GlobalSearchMixin, ColumnsMixin, SingleActionsMixin],
  props: {
    id: String,
    getParams: {
      type: [Function, Object],
    },
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'scalinggroups',
        apiVersion: 'v1',
        getParams: this.getParam,
        steadyStatus: Object.values(expectStatus.scalinggroup).flat(),
        filterOptions: {
          id: {
            label: this.$t('table.title.id'),
          },
          name: {
            label: this.$t('table.title.name'),
            filter: true,
            formatter: val => {
              return `name.contains("${val}")`
            },
          },
          description: getDescriptionFilter(),
          status: getStatusFilter('scalinggroup'),
          enabled: getEnabledFilter(),
          projects: getTenantFilter(),
          project_domains: getDomainFilter(),
          brand: {
            label: this.$t('table.title.brand'),
            dropdown: true,
            multiple: true,
            items: [
              { label: this.$t('brand'), key: 'OneCloud' },
            ],
          },
          // region: {
          //   label: '区域',
          // },
          guest_template: {
            label: this.$t('res.servertemplate'),
          },
        },
        hiddenColumns: ['status', 'created_at'],
      }),
      exportDataOptions: {
        items: [
          { label: 'ID', key: 'id' },
          { label: this.$t('compute.text_228'), key: 'name' },
          { label: this.$t('compute.text_241'), key: 'enabled' },
          { label: this.$t('compute.text_268'), key: 'status' },
          { label: this.$t('compute.text_873'), key: 'guest_template' },
          { label: this.$t('compute.text_874'), key: 'instance_number' },
          { label: this.$t('compute.text_875'), key: 'desire_instance_number' },
          { label: this.$t('compute.text_876'), key: 'min_instance_number' },
          { label: this.$t('compute.text_877'), key: 'max_instance_number' },
          { label: this.$t('dictionary.project'), key: 'tenant' },
          { label: this.$t('compute.text_176'), key: 'brand' },
        ],
      },
      groupActions: [
        {
          label: this.$t('compute.perform_create'),
          permission: 'scalinggroups_create',
          action: () => {
            this.$router.push({
              name: 'ScalingGroupCreate',
            })
          },
          meta: () => ({
            buttonType: 'primary',
          }),
        },
        {
          label: this.$t('common.batchAction'),
          actions: () => {
            return [
              {
                label: this.$t('compute.text_656'),
                permission: 'scalinggroups_perform_enable',
                action: () => {
                  this.createDialog('ScalingGroupEnable', {
                    data: this.list.selectedItems,
                    columns: this.columns,
                    onManager: this.onManager,
                  })
                },
                meta: () => ({
                  validate: this.list.selectedItems.length,
                }),
              },
              {
                label: this.$t('compute.text_569'),
                permission: 'scalinggroups_perform_disable',
                action: () => {
                  this.createDialog('ScalingGroupDisable', {
                    data: this.list.selectedItems,
                    columns: this.columns,
                    onManager: this.onManager,
                  })
                },
                meta: () => ({
                  validate: this.list.selectedItems.length,
                }),
              },
              {
                label: this.$t('compute.perform_delete'),
                permission: 'scalinggroups_delete',
                action: () => {
                  this.createDialog('DeleteResDialog', {
                    title: this.$t('compute.perform_delete'),
                    name: this.$t('compute.text_95'),
                    data: this.list.selectedItems,
                    columns: this.columns,
                    onManager: this.onManager,
                    steadyStatus: Object.values(expectStatus.scalinggroup).flat(),
                  })
                },
                meta: () => this.$getDeleteResult(this.list.selectedItems),
              },
            ]
          },
          meta: () => ({
            validate: this.list.selectedItems.length > 0,
          }),
        },
      ],
    }
  },
  created () {
    this.list.fetchData()
  },
}
</script>
