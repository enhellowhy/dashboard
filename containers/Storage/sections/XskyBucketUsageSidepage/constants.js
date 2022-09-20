import i18n from '@/locales'

export const OBJECTS_DATA = [
  {
    name: i18n.t('storage.bucket.objects'),
    all: 'allocated.objects',
    all_quota: 'quota.max.objects',
    all_label: i18n.t('cloudenv.xsky.eos.os_users.allocated.objects'),
    local: 'local.allocated.objects',
    local_quota: 'local.quota.max.objects',
    local_label: i18n.t('cloudenv.xsky.eos.os_users.local.allocated.objects'),
    external: 'external.allocated.objects',
    external_quota: 'external.quota.max.objects',
    external_label: i18n.t('cloudenv.xsky.eos.os_users.external.allocated.objects'),
    unit: 'a',
  },
]

export const SIZE_DATA = [
  {
    name: i18n.t('storage.bucket.capacity'),
    all: 'allocated.size',
    all_quota: 'quota.max.size',
    all_label: i18n.t('cloudenv.xsky.eos.os_users.allocated.size'),
    local: 'local.allocated.size',
    local_quota: 'local.quota.max.size',
    local_label: i18n.t('cloudenv.xsky.eos.os_users.local.allocated.size'),
    external: 'external.allocated.size',
    external_quota: 'external.quota.max.size',
    external_label: i18n.t('cloudenv.xsky.eos.os_users.external.allocated.size'),
    unit: 'b',
  },
]

export const LOCAL_STORAGE_CLASSES = [
  {
    name: 'local.storage.classes',
    label: i18n.t('cloudenv.xsky.eos.local.allocated'),
  },
]

export const EXTERNAL_STORAGE_CLASSES = [
  {
    name: 'external.storage.classes',
    label: i18n.t('cloudenv.xsky.eos.external.allocated'),
  },
]
