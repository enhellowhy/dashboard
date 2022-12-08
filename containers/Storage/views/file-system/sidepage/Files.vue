<template>
  <div>
    <page-list
      :list="list"
      :columns="columns"
      :group-actions="groupActions"
      :single-actions="singleActions">
      <div slot="table-prepend" class="d-flex align-items-center pt-2 pb-2">
        <span><a-icon type="folder-open" theme="filled" style="color: rgb(245,200, 61);font-size:15px" />{{$t('storage.text_150')}}</span>
        <a-breadcrumb>
          <a-breadcrumb-item>
            <a-button style="padding:0" type="link" @click="nextPage('')">{{data.name}}</a-button>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-for="(value, key) in breadcrumbs" :key="key">
            <a-button style="padding:0" type="link" @click="nextPage(key)">{{value}}</a-button>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </page-list>
  </div>
</template>

<script>
import { FINANCE_INTERNAL } from '@Storage/constants/index.js'
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'
import { sizestrWithUnit, tenthousandstr } from '@/utils/utils'

export default {
  name: 'NasFileList',
  mixins: [WindowsMixin, ListMixin],
  props: {
    id: String,
    data: {
      type: Object,
    },
  },
  data () {
    return {
      paths: [],
      // prefix: '',
      path: '',
      nextFetchListLoading: false,
      list: this.$list.createList(this, {
        id: 'FileListForNasSidePage',
        resource: 'files',
        getParams: this.getParams,
        ctx: [['file_systems', this.data.id]],
        idKey: 'name',
        filterOptions: {
          prefix: {
            label: this.$t('storage.text_154'),
            formatter: val => {
              return `${val}`
            },
          },
        },
      }),
      columns: [
        {
          field: 'name',
          title: this.$t('storage.text_154'),
          minWidth: 120,
          showOverflow: 'ellipsis',
          slots: {
            default: ({ row }) => {
              const { path } = row
              // 去掉根目录 /why/test
              const key = path.split('/').slice(2).join('/') + '/'
              console.log(key)
              if (this.nextFetchListLoading && this.path === key) {
                return [<a-icon type="loading" />]
              }
              const rkey = key.replace(this.path, '')
              if (this.isDir(key)) {
                return [
                  <div class="d-flex align-items-center">
                    <a-icon type="folder" theme="filled" style="color: rgb(245,200, 61)" />
                    <a class="text-truncate" style="margin-right: 3px" onClick={() => this.nextPage(key)} title={rkey}>{ rkey }</a>
                    <copy message={rkey} />
                  </div>,
                ]
              }
              return [
                <div class="d-flex align-items-center">
                  <a-icon theme="filled" type="file" />
                  <span class="text-truncate" title={rkey}>
                    {rkey}
                  </span>
                  <copy message={rkey} />
                </div>,
              ]
            },
          },
        },
        {
          field: 'size_bytes',
          title: this.$t('storage.text_155'),
          minWidth: 100,
          formatter: ({ row }) => {
            // return row.size_bytes ? sizestrWithUnit(row.size_bytes, 'B', 1024) : '-'
            return sizestrWithUnit(row.size_bytes, 'B', 1024)
          },
        },
        {
          field: 'files',
          title: this.$t('storage.xgfs.nfs.files.num'),
          width: 120,
          formatter: ({ row }) => {
            // return row.files || '-'
            return tenthousandstr(row.files, '个', 10000)
          },
        },
        {
          field: 'shared',
          title: this.$t('storage.xgfs.nfs.files.share'),
          width: 80,
          // formatter: ({ row }) => {
          //   return row.shared || '-'
          // },
          slots: {
            default: ({ row }) => {
              if (row.shared) {
                return [<a-icon type="check-circle" theme="filled" class="success-color"/>]
              }
              return [
                <div class="d-flex align-items-center">
                  <a-icon theme="filled" type="check-circle" />
                </div>,
              ]
            },
          },
        },
        {
          field: 'last_modified',
          title: this.$t('storage.text_156'),
          width: 100,
          formatter: ({ row }) => {
            return row.last_modified ? this.$moment(row.last_modified).fromNow() : '-'
          },
        },
      ],
      groupActions: [],
      singleActions: [],
    }
  },
  computed: {
    resName () {
      return this.data.name
    },
    breadcrumbs () {
      const _ = {}
      if (this.path) {
        const paths = this.path.split('/')
        if (paths && paths.length > 0) {
          paths.forEach((path, index) => {
            if (path === '') return false
            const k = paths.slice(0, index + 1).join('/')
            console.log(k)
            _[k + '/'] = path
          })
        }
      }
      return _
    },
    isInternal () {
      return FINANCE_INTERNAL.includes(this.data.location)
    },
  },
  created () {
    !this.isInternal && this.list.fetchData()
    this.initSidePageTab('detail')
  },
  methods: {
    isDir (name) {
      return true
      // return key.endsWith('/')
    },
    async nextPage (path, index) {
      // 表示根目录，根目录不需要path
      this.path = path
      this.nextFetchListLoading = true
      await this.list.reset()
      await this.list.fetchData()
      this.nextFetchListLoading = false
    },
    getParams () {
      const _ = {}
      if (this.path) {
        _.path = this.path
      }
      return _
    },
  },
}
</script>
