import i18n from '@/locales'

// 用于查询消费趋势
export const TIME_SIZE = {
  month: 'day', // 近一个月的时间粒度为1天
  year: 'month', // 近一年的时间密粒度1个月
  last_month: 'day',
  quarter: 'month',
  last_quarter: 'month',
  half_year: 'month',
}

export const DURATION = {
  day: i18n.t('bill.text_3'),
  hour: i18n.t('bill.text_4'),
  minute: i18n.t('bill.text_5'),
}

export const PRICE_UNIT = {
  '/unit/hour': i18n.t('bill.text_551'),
  '/GB/hour': i18n.t('bill.text_552'),
  'unit*hour': i18n.t('bill.text_553'),
  'GB*hour': i18n.t('bill.text_554'),
}

export const CHARGE_TYPE = {
  postpaid: i18n.t('bill.text_6'),
  prepaid: i18n.t('bill.text_7'),
  bandwidth: i18n.t('bill.text_8'),
  traffic: i18n.t('bill.text_9'),
}

export const ACCOUNTS = [{
  item_id: 'all',
  item_name: i18n.t('bill.text_10'),
}]

export const REGIONS = [{
  item_id: 'all',
  item_name: i18n.t('bill.text_11'),
}]

export const PLATFORMS = [{
  item_id: 'all',
  item_name: i18n.t('bill.text_12'),
}]

export const PROJECTS = [{
  item_id: 'all',
  item_name: i18n.t('bill.text_13', [i18n.t('dictionary.project')]),
}]

export const CHARGE_TYPES = [{
  item_id: 'all',
  item_name: i18n.t('bill.text_14'),
}, {
  item_id: 'prepaid',
  item_name: CHARGE_TYPE.prepaid,
}, {
  item_id: 'postpaid',
  item_name: CHARGE_TYPE.postpaid,
}]

export const DIC = {
  g1: i18n.t('bill.text_157'),
  c1: i18n.t('bill.text_555'),
  r1: i18n.t('bill.text_562'),
  'rotate - local': i18n.t('bill.text_556'),
  'rotate::local': i18n.t('bill.text_556'),
  'ssd - local': i18n.t('bill.text_557'),
  'ssd::local': i18n.t('bill.text_557'),
  'rotate - rbd': i18n.t('bill.text_558'),
  'rotate::rbd': i18n.t('bill.text_558'),
  'ssd - rbd': i18n.t('bill.text_559'),
  'ssd::rbd': i18n.t('bill.text_559'),
  'hybrid - rbd': i18n.t('bill.text_560'),
  'hybrid::rbd': i18n.t('bill.text_560'),
  'outer - outflow': i18n.t('bill.text_18'),
  'outer - inflow': i18n.t('bill.text_19'),
  'inner - outflow': i18n.t('bill.text_20'),
  'inner - inflow': i18n.t('bill.text_21'),
  'outer - out_bandwidth': i18n.t('bill.text_22'),
  'outer - in_bandwidth': i18n.t('bill.text_23'),
  'inner - out_bandwidth': i18n.t('bill.text_24'),
  'inner - in_bandwidth': i18n.t('bill.text_25'),
}

export const RATE_UNIT = {
  '1entire': i18n.t('bill.text_26'),
  '1card': i18n.t('bill.text_27'),
  '1core': i18n.t('bill.text_28'),
  '1GB': 'GB',
  '1Mbps': 'Mbps',
}

export const RuleTypes = [
  {
    key: 'EIP_UNUSED',
    label: i18n.t('suggestsyRuleTypes.EIP_UNUSED'),
  },
  {
    key: 'DISK_UNUSED',
    label: i18n.t('suggestsyRuleTypes.DISK_UNUSED'),
  },
  {
    key: 'LB_UNUSED',
    label: i18n.t('suggestsyRuleTypes.LB_UNUSED'),
  },
  {
    key: 'SCALE_DOWN',
    label: i18n.t('suggestsyRuleTypes.SCALE_DOWN'),
  },
  {
    key: 'RDS_UNREASONABLE',
    label: i18n.t('suggestsyRuleTypes.RDS_UNREASONABLE'),
  },
  {
    key: 'OSS_UNREASONABLE',
    label: i18n.t('suggestsyRuleTypes.OSS_UNREASONABLE'),
  },
  {
    key: 'REDIS_UNREASONABLE',
    label: i18n.t('suggestsyRuleTypes.REDIS_UNREASONABLE'),
  },
  {
    key: 'SECGROUPRULEINSERVER_ALLIN',
    label: i18n.t('suggestsyRuleTypes.SECGROUPRULEINSERVER_ALLIN'),
  },
  {
    key: 'SNAPSHOT_UNUSED',
    label: i18n.t('suggestsyRuleTypes.SNAPSHOT_UNUSED'),
  },
  {
    key: 'OSS_SEC_ACL',
    label: i18n.t('suggestsyRuleTypes.OSS_SEC_ACL'),
  },
  {
    key: 'CLOUDACCOUNT_AMOUNT_DAILY',
    label: i18n.t('suggestsyRuleTypes.CLOUDACCOUNT_AMOUNT_DAILY'),
  },
  {
    key: 'CLOUDACCOUNT_AMOUNT_MONTH',
    label: i18n.t('suggestsyRuleTypes.CLOUDACCOUNT_AMOUNT_MONTH'),
  },
]

export const RuleTypeMap = (function () {
  let rtMap = null
  if (!rtMap) {
    rtMap = {}
    RuleTypes.forEach((v) => {
      rtMap[v.key] = v.key
    })
  }
  return rtMap
})()

export const currencyUnitMap = {
  CNY: {
    sign: '￥',
    cn: i18n.t('bill.text_29'),
    label: i18n.t('bill.text_30'),
  },
  USD: {
    sign: '$',
    cn: i18n.t('bill.text_31'),
    label: i18n.t('bill.text_31'),
  },
}

export const DOMAINS = [{
  item_id: 'all',
  item_name: i18n.t('bill.text_13', [i18n.t('dictionary.domain')]),
}]

export const CLOUDPROVIDERS = [{
  item_id: 'all',
  item_name: i18n.t('bill.text_13', [i18n.t('dictionary.cloudprovider')]),
}]

export const RESOURCES = [{
  item_id: 'all',
  item_name: i18n.t('bill.text_32'),
}]

export const USAGES = [{
  item_id: 'all',
  item_name: i18n.t('bill.text_33'),
}]

export const PRECISION = 6
