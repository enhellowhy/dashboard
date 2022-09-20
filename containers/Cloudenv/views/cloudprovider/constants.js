import i18n from '@/locales'

export const XSKY_USER_MONITOR_OPTS = [
  {
    name: 'allocated.size',
    label: i18n.t('cloudenv.xsky.eos.samples.allocated.size'),
    unit: 'B',
    transfer: 1024,
  },
  {
    name: 'allocated.objects',
    label: i18n.t('cloudenv.xsky.eos.samples.allocated.objects'),
    unit: 'b',
    transfer: 1000,
  },
  {
    name: 'rx.bandwidth.byte',
    label: i18n.t('cloudenv.xsky.eos.samples.rx.bandwidth.byte'),
    unit: 'bps',
    transfer: 1024,
  },
  {
    name: 'tx.bandwidth.byte',
    label: i18n.t('cloudenv.xsky.eos.samples.tx.bandwidth.byte'),
    unit: 'bps',
    transfer: 1024,
  },
  {
    name: 'rx.ops.pm',
    label: i18n.t('cloudenv.xsky.eos.samples.rx.ops.pm'),
    unit: ' 次',
    transfer: 1,
  },
  {
    name: 'tx.ops.pm',
    label: i18n.t('cloudenv.xsky.eos.samples.tx.ops.pm'),
    unit: ' 次',
    transfer: 1,
  },
  {
    name: 'del.ops.pm',
    label: i18n.t('cloudenv.xsky.eos.samples.del.ops.pm'),
    unit: ' 次',
    transfer: 1,
  },
]
