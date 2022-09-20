import i18n from '@/locales'
export const CEHCK_STATUS_CN = {
  UNK: {
    textColor: '#909399',
    text: i18n.t('network.text_507'),
  },
  INI: {
    textColor: '#67C23A',
    text: i18n.t('network.text_508'),
  },
  SOCKERR: {
    textColor: '#F56C6C',
    text: i18n.t('network.text_509'),
  },
  L4OK: {
    textColor: '#67C23A',
    text: i18n.t('network.text_510'),
  },
  L4TOUT: {
    textColor: '#F56C6C',
    text: i18n.t('network.text_511'),
  },
  L4CON: {
    textColor: '#F56C6C',
    text: i18n.t('network.text_512'),
  },
  L6OK: {
    textColor: '#67C23A',
    text: i18n.t('network.text_513'),
  },
  L6TOUT: {
    textColor: '#F56C6C',
    text: i18n.t('network.text_514'),
  },
  L6RSP: {
    textColor: '#F56C6C',
    text: i18n.t('network.text_515'),
  },
  L7OK: {
    textColor: '#67C23A',
    text: i18n.t('network.text_516'),
  },
  L7OKC: {
    textColor: '#67C23A',
    text: i18n.t('network.text_516'),
  },
  L7TOUT: {
    textColor: '#F56C6C',
    text: i18n.t('network.text_517'),
  },
  L7RSP: {
    textColor: '#F56C6C',
    text: i18n.t('network.text_518'),
  },
  L7STS: {
    textColor: '#F56C6C',
    text: i18n.t('network.text_519'),
  },
}
// export const CEHCK_STATUS_STATE = {
//   backendsState: {
//     success: ['正常'],
//     danger: ['异常'],
//     info: ['部分异常'],
//   },
// }
export const CEHCK_STATUS_STATE = {
  backendsState: {
    name: 'loadbalancer_backends_state',
    label: i18n.t('loadbalancer.backends.state'),
    seleteItem: 'value',
    as: i18n.t('loadbalancer.backends.state'),
    groupBy: ['rip'],
    fromItem: 'loadbalancer_backends_state',
    unit: '',
    transfer: 1,
  },
}
export const HAD_DASHBOARD_DATA = ['tcp', 'http', 'https']
export const LB_HOST = 'lbagent1'
export const FRONTEND = 'FRONTEND'
