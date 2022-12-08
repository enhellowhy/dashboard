import {
  getNameDescriptionTableColumn,
  getTagTableColumn,
  getStatusTableColumn,
  getBrandTableColumn,
  getAccountTableColumn,
  getProjectTableColumn,
  getRegionTableColumn,
  getTimeTableColumn,
  getBillingTableColumn,
  getPublicScopeTableColumn,
  // getProjectDomainTableColumn,
} from '@/utils/common/tableColumn'
import i18n from '@/locales'

export const getFileSystemTypeColumn = ({
  field = 'file_system_type',
  title = i18n.t('storage.filesystem.type'),
} = {}) => {
  return {
    field,
    title,
    formatter: ({ row }) => {
      switch (row.file_system_type) {
        case 'standard':
          return i18n.t('storage.filesystem.type.standard')
        case 'extreme':
          return i18n.t('storage.filesystem.type.extreme')
        case 'cpfs':
          return 'CPFS'
        default:
          return row.file_system_type
      }
    },
  }
}

export const getFileSystemStorageTypeColumn = ({
  field = 'storage_type',
  title = i18n.t('storage.filesystem.storage.type'),
} = {}) => {
  return {
    field,
    title,
    formatter: ({ row }) => {
      switch (row.storage_type) {
        case 'advance_200':
          return i18n.t('storage.filesystem.storage.type.advance.200')
        case 'advance_100':
          return i18n.t('storage.filesystem.storage.type.advance.100')
        case 'standard':
          return i18n.t('storage.filesystem.storage.type.standard')
        case 'advance':
          return i18n.t('storage.filesystem.storage.type.advance')
        case 'performance':
          return i18n.t('storage.filesystem.storage.type.performance')
        case 'capacity':
          return i18n.t('storage.filesystem.storage.type.capacity')
        case 'standard.enhanced':
          return i18n.t('storage.filesystem.storage.type.standard.enhanced')
        case 'performance.enhanced':
          return i18n.t('storage.filesystem.storage.type.performance.enhanced')
        default:
          return row.storage_type
      }
    },
  }
}

export const getFileSystemProtocolColumn = ({
  field = 'protocol',
  title = i18n.t('storage.filesystem.protocol'),
} = {}) => {
  return {
    field,
    title,
    formatter: ({ row }) => {
      if (row.protocol) {
        return row.protocol.toUpperCase()
      }
      return '-'
    },
  }
}

export const getRwAccessTypeColumn = ({
  field = 'rw_access_type',
  title = i18n.t('storage.access.group.rule.rw.access_type'),
} = {}) => {
  return {
    field,
    title,
    formatter: ({ row }) => {
      switch (row.rw_access_type) {
        case 'RW':
          return i18n.t('storage.access.group.rule.rw.access_type.rw')
        case 'R':
          return i18n.t('storage.access.group.rule.rw.access_type.r')
        default:
          return row.rw_access_type
      }
    },
  }
}

export const getUserAccessTypeColumn = ({
  field = 'user_access_type',
  title = i18n.t('storage.xgfs.nfs.share.acl.user.squash'),
} = {}) => {
  return {
    field,
    title,
    formatter: ({ row }) => {
      switch (row.user_access_type) {
        case 'no_all_squash':
          return i18n.t('storage.access.group.rule.user.access_type.no_all_squash')
        case 'all_squash':
          return i18n.t('storage.access.group.rule.user.access_type.all_squash')
        default:
          return row.user_access_type
      }
    },
  }
}

export const getRootUserAccessTypeColumn = ({
  field = 'root_user_access_type',
  title = i18n.t('storage.xgfs.nfs.share.acl.root.user.squash'),
} = {}) => {
  return {
    field,
    title,
    formatter: ({ row }) => {
      switch (row.root_user_access_type) {
        case 'no_root_squash':
          return i18n.t('storage.access.group.rule.user.access_type.no_root_squash')
        case 'root_squash':
          return i18n.t('storage.access.group.rule.user.access_type.root_squash')
        default:
          return row.root_user_access_type
      }
    },
  }
}
export default {
  created () {
    this.columns = [
      getNameDescriptionTableColumn({
        onManager: this.onManager,
        hideField: true,
        addLock: true,
        slotCallback: row => {
          return (
            <side-page-trigger onTrigger={ () => this.handleOpenSidepage(row) }>{ row.name }</side-page-trigger>
          )
        },
      }),
      getTagTableColumn({ onManager: this.onManager, needExt: true, resource: 'file_systems', columns: () => this.columns }),
      getStatusTableColumn({ statusModule: 'nas', vm: this }),
      getFileSystemTypeColumn(),
      getFileSystemStorageTypeColumn(),
      getFileSystemProtocolColumn(),
      getBillingTableColumn({ vm: this }),
      getBrandTableColumn(),
      getAccountTableColumn(),
      getPublicScopeTableColumn({ vm: this, resource: 'file_systems' }),
      getProjectTableColumn(),
      getRegionTableColumn(),
      // getProjectDomainTableColumn(),
      getTimeTableColumn(),
      // {
      //   field: 'region',
      //   title: i18n.t('storage.text_47'),
      //   width: 150,
      // },
    ]
  },
}
