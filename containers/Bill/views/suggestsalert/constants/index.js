import i18n from '@/locales'
export const actionMap = {
  DELETE: i18n.t('bill.text_167'),
}

export const resSidepageMap = {
  DISK_UNUSED: {
    initSidePageTab: 'disk-detail',
    sidePageTriggerHandle: 'DiskSidePage',
    resource: 'disks',
  },
  EIP_UNUSED: {
    initSidePageTab: 'eip-detail',
    sidePageTriggerHandle: 'EipSidePage',
    resource: 'eips',
  },
  LB_UNUSED: {
    initSidePageTab: 'lb-detail',
    sidePageTriggerHandle: 'LbSidePage',
    resource: 'loadbalancers',
  },
  SCALE_DOWN: {
    initSidePageTab: 'vm-instance-detail',
    sidePageTriggerHandle: 'VmInstanceSidePage',
    resource: 'servers',
  },
  SNAPSHOT_UNUSED: {
    initSidePageTab: 'snapshot-detail',
    sidePageTriggerHandle: 'SnapshotSidePage',
    resource: 'snapshots',
  },
}
