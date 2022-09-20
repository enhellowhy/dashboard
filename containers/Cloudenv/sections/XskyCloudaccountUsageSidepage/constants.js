import { sizestr } from '@/utils/utils'
import i18n from '@/locales'

// 不定单位使用formatter，固定单位使用unit
export const USAGE_CONFIG_MAP = {
  users: {
    formatter: val => sizestr(val, 'B', 1024),
    zh_cn: i18n.t('cloudenv.xsky.eos.users'),
  },
  buckets: {
    formatter: val => sizestr(val, 'B', 1024),
    zh_cn: i18n.t('cloudenv.xsky.eos.buckets'),
  },
}

export const USAGE_RING_DATAS = [
  {
    name: i18n.t('cloudenv.xsky.eos.info'),
    eos_name: 'name',
    eos_status: 'status',
    eos_index_pool: 'indexpool.name',
    eos_name_label: i18n.t('cloudenv.xsky.eos.name'),
    eos_status_label: i18n.t('cloudenv.xsky.eos.status'),
    eos_index_pool_label: i18n.t('cloudenv.xsky.eos.indexpool.name'),
  },
]

export const USAGE_ALLOCATED_DATAS = [
  {
    name: i18n.t('cloudenv.xsky.eos.local.allocated'),
    objects: 'local.allocated.objects',
    size: 'local.allocated.size',
    objects_label: i18n.t('cloudenv.xsky.eos.local.allocated.objects'),
    size_label: i18n.t('cloudenv.xsky.eos.local.allocated.size'),
  },
  {
    name: i18n.t('cloudenv.xsky.eos.external.allocated'),
    objects: 'external.allocated.objects',
    size: 'external.allocated.size',
    objects_label: i18n.t('cloudenv.xsky.eos.external.allocated.objects'),
    size_label: i18n.t('cloudenv.xsky.eos.external.allocated.size'),
  },
]

export const USAGE_DNS_DATAS = [
  {
    name: i18n.t('cloudenv.xsky.eos.dns'),
    eos_dns: 'dns',
    eos_dns_label: i18n.t('cloudenv.xsky.eos.dns.content'),
  },
]

export const USER_TOP5 = [
  {
    name: 'allocated.objects',
    label: i18n.t('cloudenv.xsky.eos.user.allocated.objects'),
    unit: 'b',
  },
  {
    name: 'allocated.size',
    label: i18n.t('cloudenv.xsky.eos.user.allocated.size'),
    unit: 'b',
  },
  {
    name: 'allocated.bucket',
    label: i18n.t('cloudenv.xsky.eos.user.allocated.bucket'),
    unit: 'b',
  },
]

export const BUCKET_TOP5 = [
  {
    name: 'allocated.objects',
    label: i18n.t('cloudenv.xsky.eos.bucket.allocated.objects'),
    unit: 'b',
  },
  {
    name: 'allocated.size',
    label: i18n.t('cloudenv.xsky.eos.bucket.allocated.size'),
    unit: 'b',
  },
]
