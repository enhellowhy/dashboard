import i18n from '@/locales'

export const USAGE_BUCKETS_RING = [
  {
    name: i18n.t('cloudenv.xsky.eos.os_users.buckets'),
    sum: 'bucket.max',
    use: 'bucket.num',
    sum_label: i18n.t('cloudenv.xsky.quota'),
    use_label: i18n.t('cloudenv.xsky.use'),
    unuse_label: i18n.t('cloudenv.xsky.unuse'),
  },
]

export const USER_OBJECTS_DATA = [
  {
    name: i18n.t('cloudenv.xsky.eos.os_users.objects'),
    all: 'allocated.objects',
    all_label: i18n.t('cloudenv.xsky.eos.os_users.allocated.objects'),
    local: 'local.allocated.objects',
    local_label: i18n.t('cloudenv.xsky.eos.os_users.local.allocated.objects'),
    external: 'external.allocated.objects',
    external_label: i18n.t('cloudenv.xsky.eos.os_users.external.allocated.objects'),
    unit: 'a',
  },
]

export const USER_SIZE_DATA = [
  {
    name: i18n.t('cloudenv.xsky.eos.os_users.size'),
    all: 'allocated.size',
    all_label: i18n.t('cloudenv.xsky.eos.os_users.allocated.size'),
    local: 'local.allocated.size',
    local_label: i18n.t('cloudenv.xsky.eos.os_users.local.allocated.size'),
    external: 'external.allocated.size',
    external_label: i18n.t('cloudenv.xsky.eos.os_users.external.allocated.size'),
    unit: 'b',
  },
]

export const BUCKET_LIST = [
  {
    name: 'buckets',
    label: i18n.t('cloudenv.xsky.eos.os_users.buckets.detail'),
  },
]
