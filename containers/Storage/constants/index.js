import i18n from '@/locales'
export const STORAGE_TYPES = {
  local: i18n.t('storage.text_1'),
  baremetal: i18n.t('storage.text_2'),
  sheepdog: 'Sheepdog',
  rbd: 'Ceph',
  docker: i18n.t('storage.text_3'),
  nas: 'NAS',
  vsan: 'vSAN',
  nfs: 'NFS',
  gpfs: 'GPFS',
  localstorage: i18n.t('storage.text_4'),
  ceph: i18n.t('storage.text_5'),
  iscsi: 'iscsi',
}

// 对象用户选择配置
export const CLOUDPROVIDER_TYPES_MAP = {
  new: {
    label: i18n.t('storage.bucket.owner.new'),
    key: 'new',
  },
  specify: {
    label: i18n.t('storage.bucket.owner.specify'),
    key: 'specify',
  },
}

export const MEDIUM_TYPES = {
  rotate: i18n.t('storage.text_6'),
  ssd: i18n.t('storage.text_7'),
  hybrid: i18n.t('storage.text_8'),
}

export const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
}

export const ACL_TYPE = {
  private: i18n.t('storage.text_9'),
  'public-read': i18n.t('storage.text_10'),
  'public-read-write': i18n.t('storage.text_11'),
  'authenticated-read': i18n.t('storage.text_182'),
}

export const OSS_MONITOR_OPTS = {
  xsky: [
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
      name: 'list.ops.pm',
      label: i18n.t('cloudenv.xsky.eos.samples.list.ops.pm'),
      unit: ' 次',
      transfer: 1,
    },
    {
      name: 'del.ops.pm',
      label: i18n.t('cloudenv.xsky.eos.samples.del.ops.pm'),
      unit: ' 次',
      transfer: 1,
    },
    {
      name: 'latency.ms',
      label: i18n.t('cloudenv.xsky.eos.samples.latency.ms'),
      unit: 'ms',
      transfer: 1000,
    },
  ],
  aliyun: [
    {
      name: 'GetObjectE2eLatency',
      label: i18n.t('storage.text_12'),
      seleteItem: 'req_late',
      fromItem: 'oss_latency',
      as: i18n.t('storage.text_13'),
      unit: 'ms',
      transfer: 1,
      tag: {
        request: 'get',
      },
    },
    {
      name: 'GetObjectCount',
      label: i18n.t('storage.text_14'),
      seleteItem: 'req_count',
      fromItem: 'oss_req',
      as: i18n.t('storage.text_14'),
      unit: '',
      transfer: 1,
      tag: {
        request: 'get',
      },
    },
  ],
  huawei: [
    {
      name: 'GetObjectE2eLatency',
      label: i18n.t('storage.text_13'),
      seleteItem: 'req_count',
      fromItem: 'oss_req',
      as: i18n.t('storage.text_13'),
      unit: '',
      transfer: 1,
      tag: {
        request: 'get',
      },
    },
    {
      name: 'first_byte_latency',
      label: i18n.t('storage.text_15'),
      seleteItem: 'req_late',
      fromItem: 'oss_latency',
      as: i18n.t('storage.text_15'),
      unit: 'ms',
      transfer: 1,
      tag: {
        request: 'get',
      },
    },
  ],
}

export const LOCATION_MAP = {
  'oss-cn-shanghai-finance-1': i18n.t('storage.aliyun_shanghai_finance_1'), // 上海金融云内网
  'oss-cn-shanghai-finance-1-pub': i18n.t('storage.aliyun_shanghai_finance_1_pub'), // 上海金融云外网
  'oss-cn-hzjbp': i18n.t('storage.aliyun_oss_cn_hzjbp'), // 杭州金融云内网
  'oss-cn-hzfinance': i18n.t('storage.aliyun_oss_cn_hzfinance'), // 杭州金融云外网
  'oss-cn-shenzhen-finance-1': i18n.t('storage.aliyun_shenzhen_finance_1'), // 深圳金融云内网
  'oss-cn-szfinance': i18n.t('storage.aliyun_oss_cn_szfinance'), // 深圳金融云外网
}

export const FINANCE_INTERNAL = ['oss-cn-shanghai-finance-1', 'oss-cn-hzjbp', 'oss-cn-shenzhen-finance-1']
