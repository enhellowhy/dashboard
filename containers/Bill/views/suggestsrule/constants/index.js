import i18n from '@/locales'
export const renderComponentMap = {
  EIP_UNUSED: 'EipForm',
  DISK_UNUSED: 'DiskForm',
  LB_UNUSED: 'LbForm',
  SCALE_DOWN: 'ScaleDownForm',
  SNAPSHOT_UNUSED: 'SnapshotForm',
  SECGROUPRULEINSERVER_ALLIN: 'GroupRuleForm',
  OSS_SEC_ACL: 'OssSecAclForm',
  REDIS_UNREASONABLE: 'RedisUnreasonableForm',
  RDS_UNREASONABLE: 'RdsUnreasonableForm',
  OSS_UNREASONABLE: 'OssUnreasonableForm',
}

export const timeOptions = [
  { label: i18n.t('bill.text_46'), key: 'M' },
  { label: i18n.t('bill.text_207'), key: 'w' },
  { label: i18n.t('bill.text_3'), key: 'd' },
  { label: i18n.t('bill.text_4'), key: 'h' },
]

export const durationOptions = [
  { label: i18n.t('bill.text_46'), key: 'M' },
  { label: i18n.t('bill.text_207'), key: 'w' },
  { label: i18n.t('bill.text_3'), key: 'd' },
  { label: i18n.t('bill.text_4'), key: 'h' },
  { label: i18n.t('bill.text_208'), key: 'm' },
]

export const durationMaps = {}

durationOptions.forEach(({ key, label }) => {
  durationMaps[key] = label
})

export const disableUpdateTypes = ['SECGROUPRULEINSERVER_ALLIN', 'OSS_SEC_ACL', 'CLOUDACCOUNT_AMOUNT_MONTH', 'CLOUDACCOUNT_AMOUNT_DAILY']
