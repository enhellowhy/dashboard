<template>
  <detail
    :on-manager="onManager"
    :data="data"
    resource="nas"
    :base-info="baseInfo"
    :extra-info="extraInfo"
    statusModule="nas" />
</template>

<script>

import {
  getUserTagColumn,
  getExtTagColumn,
} from '@/utils/common/detailColumn'
import ColumnsMixin, { getFileSystemTypeColumn, getFileSystemStorageTypeColumn } from '../mixins/columns'
import {
  getPublicScopeTableColumn,
  getBrandTableColumn,
  getBillingTypeTableColumn,
  getSwitchTableColumn,
} from '@/utils/common/tableColumn'
import WindowsMixin from '@/mixins/windows'
import { sizestrWithUnit, tenthousandstr } from '@/utils/utils'

const RenderSizeTitle = {
  props: ['data'],
  data () {
    return {
      loading: false,
    }
  },
  methods: {
    async fetchSync () {
      this.loading = true
      try {
        const { data } = await this.filesystemsM.performAction({
          id: this.data.id,
          action: 'sync',
          data: {
            stats_only: true,
          },
        })
        this.data.used_capacity = data.used_capacity
        this.data.files = data.files
      } catch (err) {
        throw err
      } finally {
        this.loading = false
      }
    },
  },
  created () {
    this.filesystemsM = new this.$Manager('file_systems')
    this.fetchSync()
  },
  render () {
    return (
      <div>{ this.$t('storage.text_172') } <a onClick={this.fetchSync}><a-icon type="sync" spin={this.loading} /></a></div>
    )
  },
}
export default {
  name: 'FileSystemDetail',
  mixins: [WindowsMixin, ColumnsMixin],
  props: {
    data: {
      type: Object,
      required: true,
    },
    onManager: {
      type: Function,
      required: true,
    },
  },
  data () {
    return {
      baseInfo: [
        getUserTagColumn({ onManager: this.onManager, resource: 'file_system', columns: () => this.columns, tipName: this.$t('dictionary.filesystem') }),
        getExtTagColumn({ onManager: this.onManager, resource: 'file_system', columns: () => this.columns, tipName: this.$t('dictionary.filesystem') }),
        getPublicScopeTableColumn({ vm: this, resource: 'file_systems' }),
        getBrandTableColumn(),
        getBillingTypeTableColumn(),
      ],
      extraInfo: [
        {
          title: this.$t('storage.text_80'),
          items: [
            getFileSystemTypeColumn(),
            getFileSystemStorageTypeColumn(),
            {
              field: 'protocol',
              title: this.$t('storage.filesystem.protocol'),
            },
          ],
        },
        {
          title: this.$t('storage.text_139'),
          field: 'url',
          slots: {
            default: ({ row }, h) => {
              const access_urls = [
                {
                  url: row.mount_target_domain_name + ':/dfs/DistributedFileSystem' + row.external_id,
                },
              ]
              const columns = [
                {
                  field: 'url',
                  title: this.$t('storage.xgfs.nfs.share.domain'),
                  slots: {
                    default: ({ row }) => {
                      return [
                        <div>
                          <a href={row.url}>{row.url}</a>
                          <copy class="ml-1" message={row.url} />
                        </div>]
                    },
                  },
                },
              ]
              return [
                <vxe-grid class="mb-2" data={ access_urls || [] } columns={ columns } />,
              ]
            },
          },
        },
        {
          title: <RenderSizeTitle data={this.data} />,
          items: [
            {
              field: 'used_capacity',
              title: this.$t('storage.text_141'),
              formatter: ({ row }) => {
                return sizestrWithUnit(row.used_capacity, 'B', 1024)
              },
            },
            {
              field: 'files',
              title: this.$t('storage.text_142'),
              formatter: ({ row }) => {
                // return this.$t('storage.text_143', [row.object_cnt || 0])
                return tenthousandstr(row.files, '个', 10000)
              },
            },
          ],
        },
        {
          title: this.$t('storage.xgfs.nfs.quota'),
          items: [
            {
              field: 'capacity',
              title: this.$t('storage.xgfs.nfs.size.quota'),
              formatter: ({ row }) => {
                if (row.capacity > 0) {
                  return sizestrWithUnit(row.capacity, 'B', 1024)
                } else {
                  return this.$t('storage.text_145')
                }
              },
            },
            {
              field: 'files_quota',
              title: this.$t('storage.xgfs.nfs.files.quota'),
              formatter: ({ row }) => {
                if (row.files_quota > 0) {
                  return tenthousandstr(row.files_quota, '个', 10000)
                } else {
                  return this.$t('storage.text_145')
                }
              },
            },
          ],
        },
        {
          title: this.$t('storage.other.infomation'),
          items: [
            getSwitchTableColumn({
              field: 'disable_delete',
              title: this.$t('common.text00076'),
              change: val => {
                this.onManager('update', {
                  id: this.data.id,
                  managerArgs: {
                    data: { disable_delete: val },
                  },
                })
              },
            }),
          ],
        },
      ],
    }
  },
}
</script>
