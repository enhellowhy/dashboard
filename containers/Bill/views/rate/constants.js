// import i18n from '@/locales'
const lenovoLogo = require('@Compute/views/physicalmachine/assets/lenovo.svg')
const h3cLogo = require('@Compute/views/physicalmachine/assets/h3c.svg')
const dellLogo = require('@Compute/views/physicalmachine/assets/dell.svg')

export const BRAND_TYPES = {
  'New H3C Technologies Co., Ltd.': {
    name: 'h3c',
    label: 'New H3C Technologies Co., Ltd.',
    logo: h3cLogo,
    height: '35px',
    model: 'UniServer R4900 G3,UniServer R4900 G5,UniServer R4700 G5,UniServer R4950 G5,UniServer R6900 G5',
    hiddenName: true,
  },
  Lenovo: {
    name: 'lenovo',
    label: 'Lenovo',
    logo: lenovoLogo,
    height: '12px',
    model: 'ThinkServer SR660 V2,ThinkSystem SR665',
    hiddenName: true,
  },
  'Dell Inc.': {
    name: 'dell',
    label: 'Dell Inc.',
    logo: dellLogo,
    height: '25px',
    model: 'PowerEdge R740xd,PowerEdge R750,PowerEdge R750xs,PowerEdge R7525,PowerEdge R650',
    hiddenName: true,
  },
}
