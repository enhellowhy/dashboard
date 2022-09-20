import { RuleTypes } from '@Bill/constants'
import i18n from '@/locales'
import { durationMaps } from '@Bill/views/suggestsrule/constants'

let getMetircAlertUtil = null
const modules = require.context('../../../containers', true, /^((?![\\/]node_modules).)*.\/router\/index.js$/)
if (Array.prototype.includes.call(modules.keys(), './Monitor/router/index.js')) { // 如果当前项目包含 Monitor 模块，那么引入 getMetircAlertUtil 可以更友好的显示
  getMetircAlertUtil = require('../../Monitor/views/commonalert/utils/index.js').getMetircAlertUtil
}

export const getRuleTypeName = (type) => {
  const ruleType = RuleTypes.find((item) => { return item.key === type })
  return ruleType ? ruleType.label : type
}

export const getRuleDesc = (type, setting = {}, row) => {
  const ruleDescMap = {
    LB_UNUSED: i18n.t('bill.text_86'),
    DISK_UNUSED: i18n.t('bill.text_263'),
    EIP_UNUSED: i18n.t('bill.text_264'),
    SNAPSHOT_UNUSED: i18n.t('bill.text_265'),
    OSS_SEC_ACL: i18n.t('bill.text_266'),
    SECGROUPRULEINSERVER_ALLIN: i18n.t('bill.text_267'),
    CLOUDACCOUNT_AMOUNT_DAILY: i18n.t('bill.text_276'),
    CLOUDACCOUNT_AMOUNT_MONTH: i18n.t('bill.text_277'),
  }
  if (row && getMetircAlertUtil) {
    const { strategy } = getMetircAlertUtil(row, 'common_alert_metric_details')
    if (strategy !== '-') return strategy
  } else if (setting.scale_rule) {
    const sett = setting.scale_rule.map((item, index) => {
      if (index === 0) {
        return `${item.database}.${item.measurement}.${item.field}${item.eval_type}${item.threshold}`
      }
      return ` ${item.operator} ${item.database}.${item.measurement}.${item.field}${item.eval_type}${item.threshold}`
    })
    return sett.join('')
  }
  let str = ruleDescMap[type] || i18n.t('bill.text_87')
  if (row) {
    const zh = getTimeWithI18n(row.time_from)
    if (zh === '-') return str
    str = `${i18n.t('bill.text_262', [zh])}${str}`
  }
  return str
}
// 14d => 14天/14d
export const getTimeWithI18n = time => {
  if (!time) return '-'
  const timestr = time.replace(/(\d+)(\D+)/g, (str, $1, $2) => {
    return `${$1}${durationMaps[$2] || $2}`
  })
  return timestr
}
